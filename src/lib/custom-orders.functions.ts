import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveAccess } from "@/lib/custom-orders.access.server";
import {
  uploadRequestSchema,
  submitOrderSchema,
  trackSchema,
  adminListSchema,
  adminUpdateSchema,
  adminMessageSchema,
  conversationSchema,
  threadMessageSchema,
} from "@/lib/custom-orders.schemas";
import {
  saveLocalOrder,
  getLocalOrderById,
  getLocalOrderByNumber,
  listLocalOrders,
  updateLocalOrder,
  addLocalMessage,
  type StoredCustomOrder,
} from "@/lib/custom-orders.storage";

/** Creates signed upload slots in the private bucket for a pending intake. */
export const createIntakeUploads = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => uploadRequestSchema.parse(d))
  .handler(async ({ data }) => {
    const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = await import("@/lib/custom-orders");
    const slots: { name: string; path: string; token: string }[] = [];

    for (const file of data.files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type))
        throw new Error(`Unsupported file type: ${file.name}`);
      if (file.size > MAX_FILE_SIZE) throw new Error(`${file.name} is larger than 10MB`);
      const ext = (file.name.split(".").pop() ?? "bin")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 5);
      const path = `intake/${data.intakeId}/${crypto.randomUUID()}.${ext}`;

      try {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: signed, error } = await supabaseAdmin.storage
          .from("design-uploads")
          .createSignedUploadUrl(path);
        if (!error && signed) {
          slots.push({ name: file.name, path, token: signed.token });
          continue;
        }
      } catch {
        // Fallback for local / offline development
      }
      slots.push({ name: file.name, path, token: `local-token-${crypto.randomUUID()}` });
    }
    return { slots };
  });

export const submitCustomOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitOrderSchema.parse(d))
  .handler(async ({ data }) => {
    const files = data.files.filter((f) => f.path.startsWith(`intake/${data.intakeId}/`));
    const now = new Date().toISOString();
    const orderNumber = `NN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const localId = crypto.randomUUID();

    const localRecord: StoredCustomOrder = {
      id: localId,
      order_number: orderNumber,
      full_name: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      whatsapp: data.whatsapp || null,
      preferred_contact: data.preferredContact,
      delivery_address: data.deliveryAddress || null,
      order_type: data.orderType,
      selected_design: data.selectedDesign || null,
      clothing_type: data.clothingType || null,
      fabric_preference: data.fabricPreference || null,
      color: data.color || null,
      color_notes: data.colorNotes || null,
      customizations: data.customizations,
      description: data.description || null,
      special_instructions: data.specialInstructions || null,
      event_type: data.eventType || null,
      event_date: data.eventDate || null,
      required_date: data.requiredDate || null,
      urgency: data.urgency || null,
      measurement_unit: data.measurementUnit,
      measurements: data.measurements,
      needs_measurement_help: data.needsMeasurementHelp,
      status: "pending_review",
      payment_status: "unpaid",
      price: null,
      currency: "GHS",
      created_at: now,
      updated_at: now,
      files: files.map((f) => ({
        id: crypto.randomUUID(),
        file_name: f.name,
        file_type: f.type,
        file_size: f.size,
        storage_path: f.path,
        kind: f.kind ?? null,
        uploaded_at: now,
      })),
      messages: [],
    };

    let result = {
      orderNumber,
      createdAt: now,
      status: "pending_review",
      fileCount: files.length,
    };

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: order, error } = await supabaseAdmin
        .from("custom_orders")
        .insert({
          order_number: "",
          full_name: data.fullName,
          email: data.email.toLowerCase(),
          phone: data.phone,
          whatsapp: data.whatsapp || null,
          preferred_contact: data.preferredContact,
          delivery_address: data.deliveryAddress || null,
          order_type: data.orderType,
          selected_design: data.selectedDesign || null,
          clothing_type: data.clothingType || null,
          fabric_preference: data.fabricPreference || null,
          color: data.color || null,
          color_notes: data.colorNotes || null,
          customizations: data.customizations,
          description: data.description || null,
          special_instructions: data.specialInstructions || null,
          event_type: data.eventType || null,
          event_date: data.eventDate || null,
          required_date: data.requiredDate || null,
          urgency: data.urgency || null,
          measurement_unit: data.measurementUnit,
          measurements: data.measurements,
          needs_measurement_help: data.needsMeasurementHelp,
        })
        .select("id, order_number, created_at, status")
        .single();

      if (order && !error) {
        localRecord.id = order.id;
        localRecord.order_number = order.order_number;
        localRecord.created_at = order.created_at;
        result = {
          orderNumber: order.order_number,
          createdAt: order.created_at,
          status: order.status as string,
          fileCount: files.length,
        };

        if (files.length) {
          await supabaseAdmin.from("custom_order_files").insert(
            files.map((f) => ({
              order_id: order.id,
              file_name: f.name,
              file_type: f.type,
              file_size: f.size,
              storage_path: f.path,
              kind: f.kind ?? null,
            })),
          );
        }
      }
    } catch (e) {
      console.warn("[custom-orders] Supabase insert skipped/failed:", e);
    }

    // Always back up / persist to local store
    saveLocalOrder(localRecord);
    return result;
  });

/** Public tracking: requires the order number plus the email or phone on the order. */
export const trackCustomOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => trackSchema.parse(d))
  .handler(async ({ data }) => {
    const contact = data.contact.trim().toLowerCase();
    const digits = (v: string) => v.replace(/\D/g, "");
    const local = getLocalOrderByNumber(data.orderNumber);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let order: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let messages: any[] = [];
    let fileCount = 0;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: remoteOrder } = await supabaseAdmin
        .from("custom_orders")
        .select(
          "id, order_number, full_name, email, phone, whatsapp, status, payment_status, price, currency, clothing_type, selected_design, order_type, event_type, event_date, required_date, expected_completion, created_at, updated_at",
        )
        .eq("order_number", data.orderNumber.trim().toUpperCase())
        .maybeSingle();

      if (remoteOrder) {
        order = remoteOrder;
        const { data: remoteMsgs } = await supabaseAdmin
          .from("custom_order_messages")
          .select("id, sender, body, created_at")
          .eq("order_id", order.id)
          .order("created_at", { ascending: true });
        messages = remoteMsgs ?? [];

        const { count } = await supabaseAdmin
          .from("custom_order_files")
          .select("id", { count: "exact", head: true })
          .eq("order_id", order.id);
        fileCount = count ?? 0;
      }
    } catch {
      // Fallback to local
    }

    if (!order && local) {
      order = local;
      messages = local.messages ?? [];
      fileCount = local.files?.length ?? 0;
    }

    const matches =
      !!order &&
      (order.email.toLowerCase() === contact ||
        (digits(contact).length >= 6 &&
          (digits(order.phone ?? "").endsWith(digits(contact)) ||
            digits(order.whatsapp ?? "").endsWith(digits(contact)))));

    if (!order || !matches) {
      throw new Error("No order found for that reference and contact detail.");
    }

    return {
      orderNumber: order.order_number,
      fullName: order.full_name,
      status: order.status as string,
      paymentStatus: order.payment_status as string,
      price: order.price,
      currency: order.currency,
      clothingType: order.clothing_type,
      selectedDesign: order.selected_design,
      orderType: order.order_type,
      eventType: order.event_type,
      eventDate: order.event_date,
      requiredDate: order.required_date,
      expectedCompletion: order.expected_completion,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      fileCount,
      messages,
    };
  });

/** Orders belonging to the signed-in client, matched by account id or email. */
export const listMyCustomOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string })?.email?.toLowerCase();
    const local = listLocalOrders()
      .filter((o) => (email && o.email.toLowerCase() === email) || o.customer_id === context.userId)
      .map((o) => ({
        id: o.id,
        order_number: o.order_number,
        status: o.status,
        payment_status: o.payment_status,
        price: o.price,
        currency: o.currency,
        clothing_type: o.clothing_type,
        selected_design: o.selected_design,
        required_date: o.required_date,
        created_at: o.created_at,
      }));

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let query = supabaseAdmin
        .from("custom_orders")
        .select(
          "id, order_number, status, payment_status, price, currency, clothing_type, selected_design, required_date, created_at",
        )
        .order("created_at", { ascending: false });

      query = email
        ? query.or(`customer_id.eq.${context.userId},email.eq.${email}`)
        : query.eq("customer_id", context.userId);

      const { data } = await query;
      if (data?.length) return data;
    } catch {
      // Fallback to local
    }

    return local;
  });

export const adminListCustomOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => adminListSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { isAdmin } = await resolveAccess(context);
    if (!isAdmin) throw new Error("Forbidden");

    const localRows = listLocalOrders().map((o) => ({
      id: o.id,
      order_number: o.order_number,
      full_name: o.full_name,
      email: o.email,
      phone: o.phone,
      status: o.status,
      payment_status: o.payment_status,
      price: o.price,
      currency: o.currency,
      clothing_type: o.clothing_type,
      order_type: o.order_type,
      required_date: o.required_date,
      created_at: o.created_at,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let remoteRows: any[] = [];
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const query = supabaseAdmin
        .from("custom_orders")
        .select(
          "id, order_number, full_name, email, phone, status, payment_status, price, currency, clothing_type, order_type, required_date, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(300);

      const { data: rows } = await query;
      if (rows?.length) remoteRows = rows;
    } catch {
      // Fallback
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = new Map<string, any>();
    for (const r of [...localRows, ...remoteRows]) {
      map.set(r.order_number || r.id, r);
    }
    let combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    if (data.status && data.status !== "any")
      combined = combined.filter((r) => r.status === data.status);
    if (data.category && data.category !== "any")
      combined = combined.filter((r) => r.clothing_type === data.category);
    if (data.from) combined = combined.filter((r) => r.created_at >= data.from!);
    if (data.to) combined = combined.filter((r) => r.created_at <= `${data.to}T23:59:59`);
    if (data.search) {
      const s = data.search.trim().toLowerCase();
      combined = combined.filter((r) =>
        [r.order_number, r.full_name, r.email, r.phone].some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(s),
        ),
      );
    }

    return combined;
  });

export const adminGetCustomOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    const { isAdmin } = await resolveAccess(context);
    if (!isAdmin) throw new Error("Forbidden");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let order: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let files: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let messages: any[] = [];

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: remoteOrder } = await supabaseAdmin
        .from("custom_orders")
        .select("*")
        .eq("id", data.id)
        .single();

      if (remoteOrder) {
        order = remoteOrder;
        const resFiles = await supabaseAdmin
          .from("custom_order_files")
          .select("*")
          .eq("order_id", order.id)
          .order("uploaded_at", { ascending: true });
        files = resFiles.data ?? [];

        const resMsg = await supabaseAdmin
          .from("custom_order_messages")
          .select("*")
          .eq("order_id", order.id)
          .order("created_at", { ascending: true });
        messages = resMsg.data ?? [];
      }
    } catch {
      // Fallback
    }

    if (!order) {
      const local = getLocalOrderById(data.id);
      if (local) {
        order = local;
        files = (local.files ?? []).map((f) => ({ ...f, url: null }));
        messages = local.messages ?? [];
      }
    }

    if (!order) throw new Error("Order not found");
    return { order, files, messages };
  });

export const adminUpdateCustomOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => adminUpdateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { isAdmin } = await resolveAccess(context);
    if (!isAdmin) throw new Error("Forbidden");

    const patch: Record<string, unknown> = {};
    if (data.status) patch["status"] = data.status;
    if (data.paymentStatus) patch["payment_status"] = data.paymentStatus;
    if (data.price !== undefined) patch["price"] = data.price;
    if (data.internalNotes !== undefined) patch["internal_notes"] = data.internalNotes;
    if (data.expectedCompletion !== undefined)
      patch["expected_completion"] = data.expectedCompletion || null;

    updateLocalOrder(data.id, patch);

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("custom_orders")
        .update(patch as never)
        .eq("id", data.id);
    } catch {
      // Local order already updated
    }

    return { ok: true };
  });

export const adminAddOrderMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => adminMessageSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { isAdmin } = await resolveAccess(context);
    if (!isAdmin) throw new Error("Forbidden");

    addLocalMessage(data.orderId, "admin", data.body);

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("custom_order_messages")
        .insert({ order_id: data.orderId, sender: "admin", body: data.body });
    } catch {
      // Local message already saved
    }

    return { ok: true };
  });

/* ---------------- Conversations (client <-> studio) ---------------- */

export const listConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { isAdmin, email } = await resolveAccess(context);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orders: any[] = [];
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let query = supabaseAdmin
        .from("custom_orders")
        .select("id, order_number, full_name, clothing_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!isAdmin) {
        query = email
          ? query.or(`customer_id.eq.${context.userId},email.eq.${email}`)
          : query.eq("customer_id", context.userId);
      }
      const res = await query;
      if (res.data) orders = res.data;
    } catch {
      // Fallback
    }

    if (!orders.length) {
      orders = listLocalOrders()
        .filter((o) => isAdmin || (email && o.email.toLowerCase() === email))
        .map((o) => ({
          id: o.id,
          order_number: o.order_number,
          full_name: o.full_name,
          clothing_type: o.clothing_type,
          status: o.status,
          created_at: o.created_at,
          lastMessage: o.messages?.slice(-1)[0] ?? null,
        }));
      return { isAdmin, conversations: orders };
    }

    return {
      isAdmin,
      conversations: orders.map((o) => ({ ...o, lastMessage: null })),
    };
  });

export const getConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => conversationSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { isAdmin, email } = await resolveAccess(context);
    const local = getLocalOrderById(data.orderId);

    if (local) {
      const allowed =
        isAdmin ||
        local.customer_id === context.userId ||
        (!!email && local.email.toLowerCase() === email);
      if (allowed) {
        return {
          isAdmin,
          order: {
            id: local.id,
            order_number: local.order_number,
            full_name: local.full_name,
            email: local.email,
            customer_id: local.customer_id,
            clothing_type: local.clothing_type,
            status: local.status,
          },
          messages: local.messages ?? [],
        };
      }
    }

    throw new Error("Conversation not found");
  });

export const sendConversationMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => threadMessageSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { isAdmin } = await resolveAccess(context);
    const msg = addLocalMessage(data.orderId, isAdmin ? "admin" : "client", data.body);
    if (!msg) throw new Error("Could not send message");
    return msg;
  });

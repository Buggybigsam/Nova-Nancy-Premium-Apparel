import { z } from "zod";

export const fileMetaSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(120),
  size: z
    .number()
    .int()
    .positive()
    .max(10 * 1024 * 1024),
  kind: z.string().max(60).optional(),
});

export const uploadRequestSchema = z.object({
  intakeId: z.string().uuid(),
  files: z.array(fileMetaSchema).min(1).max(12),
});

export const submitOrderSchema = z.object({
  intakeId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  whatsapp: z.string().trim().max(40).optional(),
  preferredContact: z.enum(["whatsapp", "phone", "email"]),
  deliveryAddress: z.string().trim().max(500).optional(),
  orderType: z.enum(["existing_design", "custom_design", "recreate_reference", "modification"]),
  selectedDesign: z.string().trim().max(160).optional(),
  clothingType: z.string().trim().max(80).optional(),
  fabricPreference: z.string().trim().max(80).optional(),
  color: z.string().trim().max(80).optional(),
  colorNotes: z.string().trim().max(500).optional(),
  customizations: z.array(z.string().max(80)).max(20).default([]),
  description: z.string().trim().max(4000).optional(),
  specialInstructions: z.string().trim().max(2000).optional(),
  eventType: z.string().trim().max(80).optional(),
  eventDate: z.string().max(20).optional(),
  requiredDate: z.string().max(20).optional(),
  urgency: z.string().max(40).optional(),
  measurementUnit: z.enum(["inches", "cm"]),
  measurements: z.record(z.string(), z.string().max(20)).default({}),
  needsMeasurementHelp: z.boolean().default(false),
  files: z
    .array(fileMetaSchema.extend({ path: z.string().min(1).max(400) }))
    .max(12)
    .default([]),
});

export const trackSchema = z.object({
  orderNumber: z.string().trim().min(3).max(40),
  contact: z.string().trim().min(3).max(200),
});

export const adminListSchema = z.object({
  status: z.string().max(40).optional(),
  category: z.string().max(80).optional(),
  search: z.string().max(120).optional(),
  from: z.string().max(20).optional(),
  to: z.string().max(20).optional(),
});

export const adminUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.string().max(40).optional(),
  paymentStatus: z.string().max(40).optional(),
  price: z.number().nonnegative().nullable().optional(),
  internalNotes: z.string().max(4000).nullable().optional(),
  expectedCompletion: z.string().max(20).nullable().optional(),
});

export const adminMessageSchema = z.object({
  orderId: z.string().uuid(),
  body: z.string().trim().min(1).max(3000),
});

export type SubmitOrderInput = z.infer<typeof submitOrderSchema>;

export const conversationSchema = z.object({ orderId: z.string().uuid() });

export const threadMessageSchema = z.object({
  orderId: z.string().uuid(),
  body: z.string().trim().min(1).max(3000),
});

import { supabase } from "@/integrations/supabase/client";

export type StyleRow = {
  id: string;
  title: string;
  tag: string | null;
  description: string | null;
  storage_path: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type StyleWithImage = StyleRow & { imageUrl: string | null };

const SIGNED_TTL = 60 * 60 * 24 * 7;

export async function withSignedImages(rows: StyleRow[]): Promise<StyleWithImage[]> {
  if (rows.length === 0) return [];
  const { data } = await supabase.storage
    .from("styles")
    .createSignedUrls(rows.map((r) => r.storage_path), SIGNED_TTL);
  const byPath = new Map((data ?? []).map((d) => [d.path ?? "", d.signedUrl]));
  return rows.map((r) => ({ ...r, imageUrl: byPath.get(r.storage_path) ?? null }));
}

export async function fetchPublishedStyles(limit = 8): Promise<StyleWithImage[]> {
  const { data, error } = await supabase
    .from("styles")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return withSignedImages(data as StyleRow[]);
}

export async function fetchAllStyles(): Promise<StyleWithImage[]> {
  const { data } = await supabase
    .from("styles")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return withSignedImages((data ?? []) as StyleRow[]);
}

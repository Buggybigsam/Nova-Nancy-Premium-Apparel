import { supabase } from "@/integrations/supabase/client";

export type PortfolioItemRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  summary: string | null;
  description: string | null;
  storage_path: string;
  details: { label: string; value: string }[];
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type PortfolioItem = PortfolioItemRow & { imageUrl: string | null };

const SIGNED_TTL = 60 * 60 * 24 * 7;

async function withImages(rows: PortfolioItemRow[]): Promise<PortfolioItem[]> {
  if (rows.length === 0) return [];
  const { data } = await supabase.storage
    .from("styles")
    .createSignedUrls(rows.map((r) => r.storage_path), SIGNED_TTL);
  const byPath = new Map((data ?? []).map((d) => [d.path ?? "", d.signedUrl]));
  return rows.map((r) => ({ ...r, imageUrl: byPath.get(r.storage_path) ?? null }));
}

function normalise(rows: any[]): PortfolioItemRow[] {
  return (rows ?? []).map((r) => ({
    ...r,
    details: Array.isArray(r.details) ? r.details : [],
  })) as PortfolioItemRow[];
}

export async function fetchPublishedPortfolio(): Promise<PortfolioItem[]> {
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return withImages(normalise(data ?? []));
}

export async function fetchAllPortfolio(): Promise<PortfolioItem[]> {
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return withImages(normalise(data ?? []));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

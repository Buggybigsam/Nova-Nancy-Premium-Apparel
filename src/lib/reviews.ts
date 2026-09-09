import { supabase } from "@/integrations/supabase/client";

export type ReviewRow = {
  id: string;
  customer_id: string | null;
  author_name: string;
  location: string | null;
  rating: number;
  body: string;
  is_approved: boolean;
  created_at: string;
};

export async function fetchApprovedReviews(limit = 12): Promise<ReviewRow[]> {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as ReviewRow[];
}

export async function fetchAllReviews(): Promise<ReviewRow[]> {
  const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  return (data ?? []) as ReviewRow[];
}

export async function submitReview(input: {
  customerId: string;
  authorName: string;
  location: string;
  rating: number;
  body: string;
}) {
  const { error } = await supabase.from("reviews").insert({
    customer_id: input.customerId,
    author_name: input.authorName,
    location: input.location || null,
    rating: input.rating,
    body: input.body,
    is_approved: false,
  });
  if (error) throw error;
}

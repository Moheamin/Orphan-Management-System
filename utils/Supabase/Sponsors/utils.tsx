import { supabase } from "../supabase";

export async function fetchSponsorStats() {
  const { data, count, error } = await supabase()
    .from("sponsor")
    .select("sponsorship_count", { count: "exact" })
    .eq("is_deleted", false) // Only active sponsors (not deleted)
    .eq("status", "نشط"); // Added: Only count when status is 'نشط'

  if (error) {
    console.error("❌ Supabase stats error:", error);
    throw error;
  }

  // 'count' now reflects rows where is_deleted is false AND status is 'نشط'
  const totalSponsors = count ?? 0;

  const totalSponsorships = data.reduce(
    (sum, row) => sum + (row.sponsorship_count ?? 0),
    0,
  );

  return {
    totalSponsors,
    totalSponsorships,
  };
}

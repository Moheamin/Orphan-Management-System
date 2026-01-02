import { supabase } from "../supabase";

export async function fetchSponsorStats() {
  const { data, count, error } = await supabase()
    .from("sponsor")
    .select("sponsorship_count", { count: "exact" });

  if (error) {
    console.error("❌ Supabase stats error:", error);
    throw error;
  }

  const totalSponsors = count ?? 0;

  const totalSponsorships = data.reduce(
    (sum, row) => sum + (row.sponsorship_count ?? 0),
    0
  );

  return {
    totalSponsors,
    totalSponsorships,
  };
}

import { supabase } from "../supabase";

export async function deleteSponsor(sponsorId: string) {
  console.log("Attempting to delete sponsor with ID:", sponsorId);

  const { data, error } = await supabase()
    .from("sponsor") // ✅ Correct table name (singular)
    .delete()
    .eq("id", sponsorId)
    .select();

  if (error) {
    console.error("❌ Supabase delete error:", error);
    throw error;
  }

  console.log("✅ Successfully deleted sponsor:", data);
  return data;
}

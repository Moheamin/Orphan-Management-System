import { supabase } from "../supabase";

export async function deleteSponsor(sponsorId: string) {
  const { data, error } = await supabase()
    .from("sponsor") // ✅ Correct table name (singular)
    .update({ is_deleted: true }) // Set your flag here
    .eq("id", sponsorId);

  if (error) {
    console.error("❌ Supabase delete error:", error);
    throw error;
  }

  console.log("✅ Successfully deleted sponsor:", data);
  return data;
}

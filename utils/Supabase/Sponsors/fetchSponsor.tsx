import { supabase } from "../supabase";

export async function FetchSponsor() {
  const { data, error } = await supabase()
    .from("sponsor") // ✅ Correct table name (singular)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Supabase fetch error:", error);
    throw error;
  }

  console.log("✅ Fetched sponsors:", data);
  return { sponsor: data }; // Keep for compatibility with your component
}

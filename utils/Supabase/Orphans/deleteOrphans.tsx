import { supabase } from "../supabase";

export async function deleteOrphan(orphanId: number) {
  // We use .update() instead of .delete()
  const { data, error } = await supabase()
    .from("orphan")
    .update({ is_deleted: true }) // Set your flag here
    .order("created_at", { ascending: false })
    .eq("id", orphanId);

  return { data, error };
}

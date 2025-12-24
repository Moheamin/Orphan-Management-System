import { supabase } from "../supabase";

export async function deleteOrphan(orphanId: number) {
  const { error } = await supabase().from("orphan").delete().eq("id", orphanId);
  return { error };
}

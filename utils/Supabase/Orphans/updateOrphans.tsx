import { supabase } from "../supabase";

export async function updateOrphan(orphanId: number, updateData: {}) {
  const { data, error } = await supabase()
    .from("orphan")
    .upsert({ selected: "someValue" })
    .select();

  return { data, error };
}

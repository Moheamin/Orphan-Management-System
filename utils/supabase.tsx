import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cavpiewbzvnwoaihtebd.supabase.co";
const supabaseKey = "sb_publishable_5T8czwdt_vs-V07ROx_d6g_ERkc40J8";

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY environment variable is not set");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Export a function to fetch orphans instead of fetching at module level
export async function fetchOrphans() {
  const { data: orphan, error } = await supabase.from("orphan").select("*");
  return { orphan, error };
}

export async function addOrphan(orphanData: {
  name: string;
  age: number;
  type: string;
  priority: string;
  is_sponsored?: boolean;
  actions?: string | null;
  residence: string;
}) {
  const { data: orphan, error } = await supabase
    .from("orphan")
    .insert([
      {
        name: orphanData.name,
        age: orphanData.age,
        type: orphanData.type,
        priority: orphanData.priority,
        is_sponsored: orphanData.is_sponsored || false,
        actions: orphanData.actions || null,
        residence: orphanData.residence,
      },
    ])
    .select();

  return { orphan, error };
}

// Default export for backward compatibility
export default supabase;

export async function deleteOrphan(orphanId: number) {
  const { error } = await supabase.from("orphan").delete().eq("id", orphanId);
  return { error };
}

export async function updateOrphan(orphanId: number, updateData: {}) {
  const { data, error } = await supabase
    .from("orphan")
    .upsert({ selected: "someValue" })
    .select();

  return { data, error };
}

import { supabase } from "../supabase";

export async function fetchOrphans() {
  const { data: orphan, error } = await supabase().from("orphan").select("*");
  return { orphan, error };
}

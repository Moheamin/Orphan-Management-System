import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cavpiewbzvnwoaihtebd.supabase.co";
const supabaseKey = "sb_publishable_5T8czwdt_vs-V07ROx_d6g_ERkc40J8";

export function supabase() {
  if (!supabaseKey) {
    throw new Error("SUPABASE_KEY environment variable is not set");
  } else {
    return createClient(supabaseUrl, supabaseKey);
  }
}

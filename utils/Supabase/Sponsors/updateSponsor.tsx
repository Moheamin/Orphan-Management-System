import { supabase } from "../supabase";

export async function updateSponsor(sponsorId: number, updateData: {}) {
  const { data, error } = await supabase()
    .from("sponsor")
    .upsert({ selected: "someValue" })
    .select();

  return { data, error };
}

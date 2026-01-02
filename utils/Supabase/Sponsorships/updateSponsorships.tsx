import { supabase } from "../supabase";
import { type UpdateSponsorPayload } from "../../sponsor";
import { toSnakeCase } from "../../toSnakeCase";

export async function updateSponsor(payload: UpdateSponsorPayload) {
  const { id, ...rest } = payload;

  const updateData = toSnakeCase(rest);

  const { data, error } = await supabase()
    .from("sponsorship")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

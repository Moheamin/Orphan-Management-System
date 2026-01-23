import { supabase } from "../supabase";
import { toSnakeCase } from "../../toSnakeCase";

export async function updateSponsorships(payload: {
  id: string;
  note: string;
}) {
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

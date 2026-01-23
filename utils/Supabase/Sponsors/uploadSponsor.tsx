// services/addSponsor.ts

import { supabase } from "../supabase";
import { type SponsorFormData } from "../../sponsor";
import { toSnakeCase } from "../../toSnakeCase";

export async function addSponsor(payload: SponsorFormData) {
  const insertData = {
    ...toSnakeCase(payload),
    join_date: new Date().toISOString().split("T")[0],
  };

  const { data, error } = await supabase()
    .from("sponsor")
    .insert({ ...insertData, is_deleted: false })
    .select()
    .single();

  if (error) throw error;
  return data;
}

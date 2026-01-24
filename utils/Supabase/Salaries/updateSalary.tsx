import { supabase } from "../supabase";

type UpdateSalaryPayload = {
  id: number;
  amount: number;
  status?: string;
};

export async function updateSalary(payload: UpdateSalaryPayload) {
  const { id, ...updateData } = payload;

  const { data, error } = await supabase()
    .from("salary")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

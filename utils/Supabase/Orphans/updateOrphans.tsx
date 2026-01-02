import { supabase } from "../supabase";

type UpdateOrphanPayload = {
  id: number;
  name?: string;
  age?: number;
  gender?: string;
  type?: string;
  residence?: string;
  health_condition?: string;
  education_level?: string;
  poverty_level?: string;
  priority?: number;
  is_sponsored?: boolean;
  actions?: string | null;
};

export async function updateOrphan(payload: UpdateOrphanPayload) {
  const { id, ...updateData } = payload;

  const { data, error } = await supabase()
    .from("orphan")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

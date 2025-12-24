// src/Supabase/Orphans/uploadOrphans.ts
import { supabase } from "../supabase";

export async function addOrphan(orphanData: {
  name: string;
  age: number;
  type: string;
  priority: number; // ✅ Changed from string to number
  is_sponsored?: boolean;
  actions?: string | null;
  residence: string;
  gender?: string;
  poverty_level?: string;
  health_condition?: string;
  education_level?: string;
}) {
  const { data: orphan, error } = await supabase()
    .from("orphan") // ✅ Make sure table name matches your database
    .insert([orphanData])
    .select();

  if (error) throw error;
  return orphan;
}

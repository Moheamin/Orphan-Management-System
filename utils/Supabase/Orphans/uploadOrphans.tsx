// src/Supabase/Orphans/uploadOrphans.ts
import { supabase } from "../supabase";

export async function addOrphan(orphanData: {
  name: string;
  age: number;
  type: string;
  priority: number; // ✅ Changed from string to number
  is_sponsored?: boolean;
  residence: string;
  gender?: string;
  poverty_level?: string;
  health_condition?: string;
  education_level?: string;
  is_deleted?: boolean;
}) {
  const { data: orphan, error } = await supabase()
    .from("orphan") // ✅ Make sure table name matches your database
    .insert({ ...orphanData, is_deleted: false })
    .select();

  if (error) throw error;
  return orphan;
}

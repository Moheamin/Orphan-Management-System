import { useQuery } from "@tanstack/react-query";
import { supabase } from "../Supabase/supabase";
export const useOrphanLookup = () => {
  return useQuery({
    queryKey: ["orphans", "lookup"],
    queryFn: async () => {
      const { data, error } = await supabase()
        .from("orphan")
        .select("id, name") // Only fetch what we need
        .eq("is_deleted", false);
      if (error) throw error;
      return data;
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import { fetchOrphans } from "../../Supabase/Orphans/fetchOrphans";
export function useGetOrphans() {
  return useQuery({
    queryKey: ["orphans"],
    queryFn: fetchOrphans,
  });
}

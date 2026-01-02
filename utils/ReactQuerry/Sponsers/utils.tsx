import { useQuery } from "@tanstack/react-query";
import { fetchSponsorStats } from "../../Supabase/Sponsors/utils";

export function useSponsorStats() {
  return useQuery({
    queryKey: ["sponsor-stats"],
    queryFn: fetchSponsorStats,
  });
}

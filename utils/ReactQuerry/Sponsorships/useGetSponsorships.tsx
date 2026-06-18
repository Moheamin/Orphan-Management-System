import { useQuery } from "@tanstack/react-query";
import { fetchSponsorship } from "../../Supabase/Sponsorships/fetchSponsorships";

export function useGetSponsorships() {
  return useQuery({
    queryKey: ["sponsorships"],
    queryFn: fetchSponsorship,
    staleTime: 1000 * 60 * 2, // 2 minutes — avoid re-fetching on every navigation
    gcTime: 1000 * 60 * 10,
  });
}

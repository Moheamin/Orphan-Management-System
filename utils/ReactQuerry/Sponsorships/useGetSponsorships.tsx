import { useQuery } from "@tanstack/react-query";
import { fetchSponsorship } from "../../Supabase/Sponsorships/fetchSponsorships";
export function useGetSponsorships() {
  return useQuery({
    queryKey: ["sponsorships"],
    queryFn: fetchSponsorship,
  });
}

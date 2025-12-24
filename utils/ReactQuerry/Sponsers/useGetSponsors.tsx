import { useQuery } from "@tanstack/react-query";
import { FetchSponsor } from "../../Supabase/Sponsors/fetchSponsor";

export function useGetSponsors() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["sponsors"], // ✅ Must match add/delete hooks
    queryFn: FetchSponsor,
  });

  return { data, error, isLoading };
}

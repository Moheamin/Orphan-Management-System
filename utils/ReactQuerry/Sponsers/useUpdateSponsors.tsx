import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSponsor } from "../../Supabase/Sponsors/updateSponsor";
import { toast } from "react-hot-toast";

export function useUpdateSponsors() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updateSponsorMutate } = useMutation({
    mutationFn: updateSponsor,
    onSuccess: () => {
      toast.success("Sponsor updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["sponsors"],
        exact: false, // allow partial match
      });
    },
    onError: (error) => {
      toast.error("Failed to update! Please check your connection.");
      console.error(error);
    },
  });

  return { updateSponsorMutate, isPending };
}

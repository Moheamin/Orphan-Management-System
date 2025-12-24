import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrphan } from "../../Supabase/Orphans/updateOrphans";
import { toast } from "react-hot-toast";

export function useUpdateOrphans() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updateOrphanMutate } = useMutation({
    mutationFn: updateOrphan,
    onSuccess: () => {
      toast.success("Orphan updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["orphans"],
        exact: false, // allow partial match
      });
    },
    onError: (error) => {
      toast.error("Failed to update! Please check your connection.");
      console.error(error);
    },
  });

  return { updateOrphanMutate, isPending };
}

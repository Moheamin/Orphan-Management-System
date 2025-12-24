import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrphan } from "../../Supabase/Orphans/deleteOrphans";
import { toast } from "react-hot-toast";

export function useDeleteOrphans() {
  const queryClient = useQueryClient();

  const { isPending, mutate: deleteOrphanMutate } = useMutation({
    mutationFn: deleteOrphan,
    onSuccess: () => {
      toast.success("Orphan Deleted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["orphans"],
        exact: false, // allow partial match
      });
    },
    onError: (error) => {
      toast.error("Faild to upload! Please check your connection.");
      console.error(error);
    },
  });

  return { deleteOrphanMutate, isPending };
}

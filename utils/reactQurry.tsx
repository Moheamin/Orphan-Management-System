import { useQuery } from "@tanstack/react-query";
import { fetchOrphans, addOrphan, deleteOrphan } from "./supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useGetOrphans() {
  return useQuery({
    queryKey: ["orphans"],
    queryFn: fetchOrphans,
  });
}

export function useEditOrphans() {
  const queryClient = useQueryClient();

  const { isPending, mutate: editOrphanMutate } = useMutation({
    mutationFn: addOrphan,
    onSuccess: () => {
      toast.success("Orphan added successfully!");

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

  return { editOrphanMutate, isPending };
}

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

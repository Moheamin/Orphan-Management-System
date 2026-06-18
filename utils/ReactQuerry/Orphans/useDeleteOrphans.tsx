import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrphan } from "../../Supabase/Orphans/deleteOrphans";
import { toast } from "react-hot-toast";

export function useDeleteOrphans() {
  const queryClient = useQueryClient();

  const { isPending, mutate: deleteOrphanMutate } = useMutation({
    mutationFn: deleteOrphan,
    onSuccess: () => {
      toast.success("تم حذف اليتيم بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["orphans"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
      queryClient.invalidateQueries({ queryKey: ["orphanReceives"] });
    },
    onError: (error) => {
      toast.error("فشل في الحذف! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { deleteOrphanMutate, isPending };
}

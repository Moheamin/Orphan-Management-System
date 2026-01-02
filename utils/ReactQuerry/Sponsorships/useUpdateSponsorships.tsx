import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrphan } from "../../Supabase/Orphans/updateOrphans";
import { toast } from "react-hot-toast";

export function useUpdateOrphans() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updateOrphanMutate } = useMutation({
    mutationFn: updateOrphan,
    onSuccess: () => {
      toast.success("تم تحديث بيانات اليتيم بنجاح!");
      // ✅ Invalidate and refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["orphans"],
      });
      queryClient.refetchQueries({
        queryKey: ["orphans"],
        type: "active",
      });
    },
    onError: (error) => {
      toast.error("فشل في التحديث! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { updateOrphanMutate, isPending };
}

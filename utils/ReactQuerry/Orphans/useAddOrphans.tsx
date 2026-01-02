import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addOrphan } from "../../Supabase/Orphans/uploadOrphans";

export function useAddOrphans() {
  const queryClient = useQueryClient();

  const {
    isPending,
    isSuccess,
    mutate: addOrphanMutate,
  } = useMutation({
    mutationFn: addOrphan,
    onSuccess: () => {
      toast.success("تم إضافة اليتيم بنجاح!");
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
      toast.error("فشل في الإضافة! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { addOrphanMutate, isPending, isSuccess };
}

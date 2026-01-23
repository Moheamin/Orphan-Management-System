import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSponsor } from "../../Supabase/Sponsors/updateSponsor";
import { toast } from "react-hot-toast";

export function useUpdateSponsors() {
  const queryClient = useQueryClient();
  const { isPending, mutate: updateSponsorMutate } = useMutation({
    mutationFn: updateSponsor,
    onSuccess: () => {
      toast.success("تم تحديث بيانات الكفيل بنجاح!");
      // ✅ Invalidate and refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["sponsors"],
      });
      queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
      queryClient.refetchQueries({
        queryKey: ["sponsors"],
        type: "active",
      });
    },
    onError: (error) => {
      toast.error("فشل في التحديث! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { updateSponsorMutate, isPending };
}

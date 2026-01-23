import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSponsor } from "../../Supabase/Sponsors/deleteSponsor";
import { toast } from "react-hot-toast";

export function useDeleteSponsors() {
  const queryClient = useQueryClient();

  const { isPending, mutate: deleteSponsorMutate } = useMutation({
    mutationFn: deleteSponsor,
    onSuccess: () => {
      toast.success("تم حذف الكفيل بنجاح!");
      queryClient.invalidateQueries({
        queryKey: ["sponsors"],
        exact: false, // allow partial match
      });
      queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
    },
    onError: (error) => {
      console.error("❌ Delete sponsor error:", error);
      toast.error("فشل في الحذف! يرجى التحقق من الاتصال.");
    },
  });

  return { deleteSponsorMutate, isPending };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addSponsor } from "../../Supabase/Sponsors/uploadSponsor";

export function useAddSponsors() {
  const queryClient = useQueryClient();

  const {
    isPending,
    isSuccess,
    mutate: addSponsorMutate,
  } = useMutation({
    mutationFn: addSponsor,
    onSuccess: () => {
      console.log("✅ Sponsor added - invalidating queries");
      toast.success("تم إضافة الكفيل بنجاح!");
      // ✅ Invalidate and refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["sponsors"],
      });
      queryClient.refetchQueries({
        queryKey: ["sponsors"],
        type: "active",
      });
    },
    onError: (error) => {
      console.error("❌ Add sponsor error:", error);
      toast.error("فشل في الإضافة! يرجى التحقق من الاتصال.");
    },
  });

  return { addSponsorMutate, isPending, isSuccess };
}

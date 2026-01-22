import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSponsorships } from "../../Supabase/Sponsorships/updateSponsorships";
import { toast } from "react-hot-toast";

export function useUpdateSponsorships() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSponsorships,
    onSuccess: () => {
      toast.success("تم تحديث الملاحظة بنجاح!");
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
    },
    onError: (error) => {
      toast.error("فشل في التحديث! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return {
    updateNote: mutation.mutate,
    isUpdating: mutation.isPending,
    isError: mutation.error,
  };
}

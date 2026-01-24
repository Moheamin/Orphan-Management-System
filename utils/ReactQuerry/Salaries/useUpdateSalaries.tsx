import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSalary } from "../../Supabase/Salaries/updateSalary";
import { toast } from "react-hot-toast";

export function useUpdateSalary() {
  const queryClient = useQueryClient();

  const { isPending, mutate: updateSalaryMutate } = useMutation({
    mutationFn: updateSalary,
    onSuccess: () => {
      toast.success("تم تحديث بيانات الراتب بنجاح!");
      // ✅ Invalidate and refetch immediately
      queryClient.invalidateQueries({
        queryKey: ["salaries"],
      });
      queryClient.refetchQueries({
        queryKey: ["salaries"],
        type: "active",
      });
    },
    onError: (error) => {
      toast.error("فشل في التحديث! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { updateSalaryMutate, isPending };
}

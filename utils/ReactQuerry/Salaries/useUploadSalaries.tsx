import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { addSalary } from "../../Supabase/Salaries/uploadSalary";

export function useAddSalary() {
  const queryClient = useQueryClient();

  const {
    isPending,
    isSuccess,
    mutate: addSalaryMutate,
  } = useMutation({
    mutationFn: addSalary,
    onSuccess: () => {
      toast.success("تم إضافة الراتب بنجاح!");
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
      toast.error("فشل في الإضافة! يرجى التحقق من الاتصال.");
      console.error(error);
    },
  });

  return { addSalaryMutate, isPending, isSuccess };
}

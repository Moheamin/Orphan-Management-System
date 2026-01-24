import { useQuery } from "@tanstack/react-query";
import { fetchSalary } from "../../Supabase/Salaries/fetchSalary";

export function useGetSalaries() {
  return useQuery({
    queryKey: ["salaries"],
    queryFn: fetchSalary,
  });
}

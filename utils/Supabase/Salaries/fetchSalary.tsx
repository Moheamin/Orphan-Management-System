import { supabase } from "../supabase";

// Inside your Supabase/Sponsorships/fetchSponsorships.ts
export const fetchSalary = async () => {
  const { data, error } = await supabase()
    .from("live_salaries_view")
    .select("*");

  if (error) throw error;
  return data;
};

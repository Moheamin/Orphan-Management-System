import { supabase } from "../supabase";

// Inside your Supabase/Sponsorships/fetchSponsorships.ts
export const fetchSponsorship = async () => {
  const { data, error } = await supabase()
    .from("live_sponsorship_dashboard")
    .select("*")
    .order("created_at", { ascending: false });

  console.log(data);

  if (error) throw error;
  return data;
};

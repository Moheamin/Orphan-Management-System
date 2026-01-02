import { supabase } from "../supabase";

// Inside your Supabase/Sponsorships/fetchSponsorships.ts
export const fetchSponsorship = async () => {
  const { data, error } = await supabase().from("sponsorship").select(`
      *,
      orphan:orphan_id (name),
      sponsor:sponsor_id (name)
    `);

  if (error) throw error;
  return data;
};

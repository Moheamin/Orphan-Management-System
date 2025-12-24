import { supabase } from "../supabase";

export async function addSponsor(sponsorData: {
  name: string;
  phone: string;
  email?: string | null;
  monthlyAmount: string;
  sponsorshipCount: string;
  status: string;
}) {
  console.log("Attempting to insert sponsor:", sponsorData);

  // Convert to correct data types and use correct column names
  const { data, error } = await supabase()
    .from("sponsor") // ✅ Correct table name (singular)
    .insert([
      {
        name: sponsorData.name,
        phone: sponsorData.phone,
        email: sponsorData.email || null,
        monthly_amount: parseFloat(sponsorData.monthlyAmount), // snake_case + number
        sponsorship_count: parseInt(sponsorData.sponsorshipCount), // snake_case + number
        status: sponsorData.status,
        join_date: new Date().toISOString().split("T")[0], // snake_case
      },
    ])
    .select();

  if (error) {
    console.error("❌ Supabase insert error:", error);
    throw error;
  }

  console.log("✅ Successfully inserted sponsor:", data);
  return data;
}

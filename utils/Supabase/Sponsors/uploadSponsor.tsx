import { supabase } from "../supabase";
import { type SponsorPayload } from "../../sponsor";
import { generateSponsorPayment } from "../SponsorPayments/generatePayments";

export async function addSponsor(
  payload: SponsorPayload & { orphanIds: string[] },
) {
  const { orphanIds, orphan_id: _unused, ...sponsorData } = payload;
  const client = supabase();
  const today = new Date().toISOString().split("T")[0];

  // Insert one sponsor row per orphan (replicated model)
  // If no orphans selected, insert one row with orphan_id = null
  const rowsToInsert =
    orphanIds.length > 0
      ? orphanIds.map((orphanId) => ({
          ...sponsorData,
          orphan_id: orphanId,
          join_date: today,
          is_deleted: false,
        }))
      : [
          {
            ...sponsorData,
            orphan_id: null,
            join_date: today,
            is_deleted: false,
          },
        ];

  const { data: sponsors, error } = await client
    .from("sponsor")
    .insert(rowsToInsert)
    .select();

  if (error) throw error;

  // Mark all assigned orphans as sponsored in a single batch call
  if (orphanIds.length > 0) {
    const { error: orphanErr } = await client
      .from("orphan")
      .update({ is_sponsored: true })
      .in("id", orphanIds);
    if (orphanErr) throw orphanErr;
  }

  // Generate/update sponsor_payment for current month
  if (orphanIds.length > 0) {
    await generateSponsorPayment(
      sponsorData.name as string,
      sponsorData.phone as string,
    );
  }

  return sponsors?.[0];
}

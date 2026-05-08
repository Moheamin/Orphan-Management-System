import { supabase } from "../supabase";

type UpdatePayload = {
  id: string;
  paid_amount: number;
  expected_amount: number;
};

type CreatePayload = {
  sponsor_id: string;
  payment_target_month: string;
  expected_amount: number;
  paid_amount: number;
  status?: string;
  note?: string;
};

/**
 * Create a new sponsor_payment record.
 * The DB trigger `automate_sponsor_payment_details` handles:
 *   - status (based on paid vs expected)
 *   - payment_date (set automatically when fully paid)
 *   - remaining_debt / extra_charity (GENERATED columns)
 * The trigger `handle_payment_surplus` routes surplus → orphanage_funds.
 */
export async function createSponsorPayment(payload: CreatePayload) {
  // Step 1: insert (trigger fires)
  const { data, error } = await supabase()
    .from("sponsor_payment")
    .insert({
      sponsor_id: payload.sponsor_id,
      payment_target_month: payload.payment_target_month,
      expected_amount: payload.expected_amount,
      paid_amount: payload.paid_amount,
      note: payload.note || "",
    })
    .select()
    .single();

  if (error) throw error;

  // Step 2: set payment_date after trigger has run
  if (payload.paid_amount > 0) {
    const { error: dateError } = await supabase()
      .from("sponsor_payment")
      .update({ payment_date: new Date().toISOString() })
      .eq("id", data.id);

    if (dateError) throw dateError;
  }

  return data;
}

/**
 * Update an existing sponsor_payment record.
 * Only send paid_amount and expected_amount — the DB trigger does the rest:
 *   - Auto-recalculates status
 *   - Sets/clears payment_date
 *   - Updates remaining_debt and extra_charity (GENERATED)
 *   - Routes surplus to orphanage_funds if paid > expected
 */
export async function updateSponsorPayment(payload: UpdatePayload) {
  const { id, paid_amount, expected_amount } = payload;

  // Step 1: update amounts — DB trigger fires here and may reset payment_date to NULL
  const { data, error } = await supabase()
    .from("sponsor_payment")
    .update({ paid_amount, expected_amount })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Step 2: force payment_date AFTER the trigger has already run
  const { error: dateError } = await supabase()
    .from("sponsor_payment")
    .update({
      payment_date: paid_amount > 0 ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (dateError) throw dateError;

  return data;
}

/**
 * Update only the note field of a sponsor_payment.
 * This is a lightweight update that does NOT trigger surplus logic.
 */
export async function updateSponsorPaymentNote(payload: {
  id: string;
  note: string;
}) {
  const { id, note } = payload;

  const { data, error } = await supabase()
    .from("sponsor_payment")
    .update({ note })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

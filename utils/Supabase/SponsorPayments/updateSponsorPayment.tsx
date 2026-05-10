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
 * Manually calculates and sets status (since DB trigger may not exist).
 */
export async function createSponsorPayment(payload: CreatePayload) {
  // Calculate status and payment_date based on amounts
  const newStatus = calculateStatus(
    payload.paid_amount,
    payload.expected_amount,
  );
  const paymentDate = payload.paid_amount > 0 ? new Date().toISOString() : null;

  // Insert with calculated status
  const { data, error } = await supabase()
    .from("sponsor_payment")
    .insert({
      sponsor_id: payload.sponsor_id,
      payment_target_month: payload.payment_target_month,
      expected_amount: payload.expected_amount,
      paid_amount: payload.paid_amount,
      status: newStatus,
      payment_date: paymentDate,
      note: payload.note || "",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Calculate status based on paid vs expected amounts
 */
function calculateStatus(paidAmount: number, expectedAmount: number): string {
  if (paidAmount === 0) return "قيد الانتظار";
  if (paidAmount === expectedAmount) return "مدفوع بالكامل";
  if (paidAmount > expectedAmount) return "فائض";
  return "مدفوع جزئيا";
}

/**
 * Update an existing sponsor_payment record.
 * Manually calculates and updates status (since DB trigger may not exist).
 */
export async function updateSponsorPayment(payload: UpdatePayload) {
  const { id, paid_amount, expected_amount } = payload;

  // Calculate the new status based on amounts
  const newStatus = calculateStatus(paid_amount, expected_amount);
  const paymentDate = paid_amount > 0 ? new Date().toISOString() : null;

  // Update both amounts AND status together
  const { error } = await supabase()
    .from("sponsor_payment")
    .update({
      paid_amount,
      expected_amount,
      status: newStatus,
      payment_date: paymentDate,
    })
    .eq("id", id);

  if (error) throw error;

  // REFETCH the complete updated record to confirm all changes
  const { data, error: fetchError } = await supabase()
    .from("sponsor_payment")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

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

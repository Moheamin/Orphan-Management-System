import { supabase } from "../supabase";

const MONTHLY_BUDGET = 100000;

export async function fetchOrphanReceives() {
  const { data, error } = await supabase()
    .from("orphan_financial_status_view")
    .select("*");

  if (error) throw error;

  // Group rows by orphan_id (view returns one row per sponsor per orphan)
  const orphanMap = new Map<string, any>();

  (data ?? []).forEach((row) => {
    if (!orphanMap.has(row.orphan_id)) {
      orphanMap.set(row.orphan_id, {
        orphan_id: row.orphan_id,
        orphan_name: row.orphan_name,
        orphan_type: row.type,
        orphan_residence: null, // not in view, add if needed
        is_sponsored: row.is_sponsored,
        monthly_need: Number(row.monthly_need ?? MONTHLY_BUDGET),
        orphanage_fund_balance: Number(row.orphanage_fund_balance ?? 0),
        sponsor_payments: [],
      });
    }

    // Attach sponsor payment data if a sponsor exists on this row
    if (row.sponsor_id) {
      const orphan = orphanMap.get(row.orphan_id);
      orphan.sponsor_payments.push({
        id: row.sponsor_id,
        sponsor_id: row.sponsor_id,
        sponsor_name: row.sponsor_name ?? "—",
        sponsorship_type: row.sponsor_status ?? "—",
        expected_amount: Number(row.monthly_need ?? 0),
        paid_amount: Number(row.sponsor_paid_amount ?? 0),
        remaining_debt: Number(row.sponsor_remaining_debt ?? 0),
        extra_charity: 0,
        status: row.financial_status,
        payment_date: null,
        payment_month: null,
      });
    }
  });

  // Compute totals per orphan
  let remainingSurplus = (data?.[0]?.orphanage_fund_balance ?? 0) as number;

  const result = Array.from(orphanMap.values()).map((orphan) => {
    const totalSponsorExpected = orphan.sponsor_payments.reduce(
      (s: number, p: any) => s + p.expected_amount,
      0,
    );
    const totalSponsorPaid = orphan.sponsor_payments.reduce(
      (s: number, p: any) => s + p.paid_amount,
      0,
    );
    const totalSponsorGap = orphan.sponsor_payments.reduce(
      (s: number, p: any) => s + p.remaining_debt,
      0,
    );

    const orphanage_base_share = Math.max(
      0,
      orphan.monthly_need - totalSponsorExpected,
    );
    const gap_covered_from_surplus = Math.min(
      totalSponsorGap,
      remainingSurplus,
    );
    remainingSurplus -= gap_covered_from_surplus;
    const uncovered_gap = Math.max(
      0,
      totalSponsorGap - gap_covered_from_surplus,
    );

    const total_actual_received =
      totalSponsorPaid + orphanage_base_share + gap_covered_from_surplus;

    let funding_status = "Covered";
    if (uncovered_gap > 0) funding_status = "Deficit";
    else if (gap_covered_from_surplus > 0) funding_status = "Partially Funded";

    return {
      orphan_id: orphan.orphan_id,
      orphan_name: orphan.orphan_name,
      orphan_type: orphan.orphan_type,
      orphan_residence: orphan.orphan_residence,
      orphanage_base_share,
      orphanage_actual_paid: orphanage_base_share + gap_covered_from_surplus,
      gap_covered_from_surplus,
      uncovered_gap,
      expected_sponsor_share: totalSponsorExpected,
      total_monthly_target: orphan.monthly_need,
      total_actual_received,
      funding_status,
      financial_gap: totalSponsorGap,
      surplus_available: Number(orphan.orphanage_fund_balance),
      sponsor_payments: orphan.sponsor_payments,
    };
  });

  return result;
}

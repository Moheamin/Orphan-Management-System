import { supabase } from "../supabase";

const BASE_AMOUNT = 50_000;

export const fetchSponsorPayments = async () => {
  const client = supabase();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  // 1. Fetch all active sponsors
  const { data: sponsors, error: sponsorsErr } = await client
    .from("elegant_sponsors_list")
    .select("id, name, phone, sponsorship_type, sponsorship_count")
    .eq("is_deleted", false);

  if (sponsorsErr) console.error("Failed to fetch sponsors:", sponsorsErr);

  // 2. Fetch sponsorship pricing
  const { data: prices, error: pricesErr } = await client
    .from("sponsorship_prices")
    .select("type_name, monthly_cost");

  if (pricesErr) console.error("Failed to fetch prices:", pricesErr);

  const priceMap = new Map(
    (prices || []).map((p: any) => [p.type_name, Number(p.monthly_cost)]),
  );

  // 3. Batch-fetch all active sponsor-orphan links with orphan names
  const { data: allSponsorLinks } = await client
    .from("sponsor")
    .select("id, name, phone, orphan_id, orphan:orphan_id ( id, name )")
    .eq("is_deleted", false)
    .not("orphan_id", "is", null);

  // Build maps: "name|phone" => [{ id, name }], and sponsor.id => personKey
  const orphansByPersonKey = new Map<string, { id: string; name: string }[]>();
  const sponsorIdToPersonKey = new Map<string, string>();

  for (const link of allSponsorLinks || []) {
    const key = `${link.name}|${link.phone}`;
    sponsorIdToPersonKey.set(link.id, key);
    const orphan = link.orphan as any;
    if (orphan?.name) {
      if (!orphansByPersonKey.has(key)) orphansByPersonKey.set(key, []);
      const list = orphansByPersonKey.get(key)!;
      if (!list.find((o) => o.id === orphan.id)) {
        list.push({ id: orphan.id, name: orphan.name });
      }
    }
  }

  for (const s of sponsors || []) {
    sponsorIdToPersonKey.set(s.id, `${s.name}|${s.phone}`);
  }

  // 4. Compute expected amounts
  const computeExpected = async (sponsor: any): Promise<number> => {
    if (!sponsor.sponsorship_type) return BASE_AMOUNT;
    const singlePrice = priceMap.get(sponsor.sponsorship_type);
    if (singlePrice !== undefined)
      return singlePrice * (sponsor.sponsorship_count || 1);
    const { data: rows } = await client
      .from("sponsor")
      .select("sponsorship_type")
      .eq("name", sponsor.name)
      .eq("phone", sponsor.phone)
      .eq("is_deleted", false)
      .not("orphan_id", "is", null);
    const total = (rows || []).reduce(
      (sum: number, r: any) => sum + (priceMap.get(r.sponsorship_type) || 0),
      0,
    );
    return total > 0 ? total : BASE_AMOUNT;
  };

  const sponsorExpectedMap = new Map<string, number>();
  for (const s of sponsors || []) {
    sponsorExpectedMap.set(s.id, await computeExpected(s));
  }

  // 5. Existing current-month payments
  const { data: currentMonthPayments } = await client
    .from("sponsor_payment")
    .select("id, sponsor_id, sponsor ( name )")
    .eq("payment_target_month", currentMonth);

  const paidIds = new Set(
    (currentMonthPayments || []).map((p: any) => p.sponsor_id),
  );
  const paidNames = new Set(
    (currentMonthPayments || []).map((p: any) => p.sponsor?.name),
  );

  // 6. Insert missing payments
  // ⚠️ DO NOT include extra_charity or remaining_debt — they are GENERATED columns in Postgres
  const missingSponsors = (sponsors || []).filter(
    (s: any) => !paidIds.has(s.id) && !paidNames.has(s.name),
  );

  for (const s of missingSponsors) {
    const expectedAmount = sponsorExpectedMap.get(s.id) ?? BASE_AMOUNT;
    const { error: insertErr } = await client.from("sponsor_payment").insert({
      sponsor_id: s.id,
      payment_target_month: currentMonth,
      expected_amount: expectedAmount,
      paid_amount: 0,
      status: "قيد الانتظار",
      note: "",
      // ✅ Never set extra_charity or remaining_debt here — Postgres computes them
    });
    if (insertErr)
      console.error(
        `Insert failed for ${s.name}:`,
        insertErr.message,
        insertErr.code,
      );
  }

  // 7. Fetch all payments
  const { data: allPayments, error: fetchErr } = await client
    .from("sponsor_payment")
    .select(
      `
      id, sponsor_id, payment_target_month,
      expected_amount, paid_amount, extra_charity, remaining_debt,
      payment_date, status, note, created_at,
      sponsor ( name, phone )
    `,
    )
    .order("created_at", { ascending: false });

  if (fetchErr) throw fetchErr;

  const flatPayments = (allPayments || []).map((row: any) => {
    const freshExpected =
      row.sponsor_id && sponsorExpectedMap.has(row.sponsor_id)
        ? sponsorExpectedMap.get(row.sponsor_id)!
        : row.expected_amount;

    const personKey =
      sponsorIdToPersonKey.get(row.sponsor_id) ||
      (row.sponsor?.name && row.sponsor?.phone
        ? `${row.sponsor.name}|${row.sponsor.phone}`
        : null);

    return {
      ...row,
      expected_amount: freshExpected,
      sponsor_name: row.sponsor?.name || "—",
      payment_date: row.payment_date ? row.payment_date.split("T")[0] : null,
      orphans: personKey ? orphansByPersonKey.get(personKey) || [] : [],
    };
  });

  // 8. Virtual fallback
  const finalPaidIds = new Set(
    flatPayments
      .filter((p: any) => p.payment_target_month === currentMonth)
      .map((p: any) => p.sponsor_id),
  );
  const finalPaidNames = new Set(
    flatPayments
      .filter((p: any) => p.payment_target_month === currentMonth)
      .map((p: any) => p.sponsor_name),
  );

  const virtualRecords: any[] = [];
  for (const s of (sponsors || []).filter(
    (s: any) => !finalPaidIds.has(s.id) && !finalPaidNames.has(s.name),
  )) {
    const expectedAmount = sponsorExpectedMap.get(s.id) ?? BASE_AMOUNT;
    const personKey = `${s.name}|${s.phone}`;
    virtualRecords.push({
      id: `virtual-${s.id}`,
      sponsor_id: s.id,
      sponsor_name: s.name,
      payment_target_month: currentMonth,
      expected_amount: expectedAmount,
      paid_amount: 0,
      extra_charity: 0,
      remaining_debt: expectedAmount,
      payment_date: null,
      status: "قيد الانتظار",
      note: "",
      created_at: new Date().toISOString(),
      orphans: orphansByPersonKey.get(personKey) || [],
      _isVirtual: true,
    });
  }

  return [...virtualRecords, ...flatPayments];
};

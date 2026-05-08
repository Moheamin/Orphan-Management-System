import { useMemo, useState, type ReactNode } from "react";
import { useGetOrphanReceives } from "../../utils/ReactQuerry/OrphanReceives/useGetOrphanReceives";
import { DataTable } from "../../components/CompoundTable";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

const FILTER_OPTIONS = [
  { label: "مغطى", value: "covered" },
  { label: "تمويل جزئي", value: "partial" },
  { label: "عجز", value: "deficit" },
];

const STATUS_CFG: Record<
  string,
  { label: string; style: string; icon: ReactNode }
> = {
  Covered: {
    label: "مغطى",
    style:
      "bg-[var(--successColor)]/10 text-[var(--successColor)] border-[var(--successColor)]",
    icon: <TrendingUp size={11} />,
  },
  "Partially Funded": {
    label: "جزئي",
    style:
      "bg-[var(--warningColor)]/10 text-[var(--warningColor)] border-[var(--warningColor)]",
    icon: <Minus size={11} />,
  },
  Deficit: {
    label: "عجز - الدار فقط",
    style:
      "bg-[var(--errorColor)]/10 text-[var(--errorColor)] border-[var(--errorColor)]",
    icon: <AlertTriangle size={11} />,
  },
};

function PayStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    فائض: "bg-[var(--successColor)]/10 text-[var(--successColor)]",
    "مدفوع جزئياً": "bg-[var(--warningColor)]/10 text-[var(--warningColor)]",
    "قيد الانتظار": "bg-[var(--errorColor)]/10 text-[var(--errorColor)]",
    "مدفوع جزئيا": "bg-[var(--warningColor)]/10 text-[var(--warningColor)]",
  };
  const style = map[status] ?? "bg-[var(--fillColor)] text-[var(--textMuted)]";
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${style}`}>
      {status}
    </span>
  );
}

function SponsorSubTable({
  payments,
  orphanageShare,
  orphanageActualPaid,
  gap,
  gapCovered,
  uncoveredGap,
  surplusAvailable,
}: {
  payments: any[];
  orphanageShare: number;
  orphanageActualPaid: number;
  gap: number;
  gapCovered: number;
  uncoveredGap: number;
  surplusAvailable: number;
}) {
  return (
    <div className="bg-[var(--bgColor)] border-t border-[var(--borderColor)]">
      {payments.length === 0 ? (
        <div className="px-4 py-3 text-center text-xs text-[var(--textMuted)]">
          لا يوجد كفلاء — الدار تغطي الـ 100,000 د.ع كاملاً
        </div>
      ) : (
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-[var(--borderColor)]">
              {[
                "الكفيل",
                "نوع الكفالة",
                "المتوقع",
                "المدفوع",
                "المتبقي",
                "الحالة",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-[10px] text-[var(--textMuted)] font-bold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-b border-[var(--borderColor)]/50 hover:bg-[var(--fillColor)]"
              >
                <td className="px-4 py-2 text-xs font-bold text-[var(--textColor)]">
                  {p.sponsor_name}
                </td>
                <td className="px-4 py-2 text-xs text-[var(--textMuted)]">
                  {p.sponsorship_type || "—"}
                </td>
                <td className="px-4 py-2 text-xs font-mono">
                  {p.expected_amount?.toLocaleString()}{" "}
                  <span className="text-[10px] text-[var(--textMuted)]">
                    د.ع
                  </span>
                </td>
                <td className="px-4 py-2 text-xs font-mono text-[var(--successColor)]">
                  {p.paid_amount?.toLocaleString()}{" "}
                  <span className="text-[10px]">د.ع</span>
                </td>
                <td
                  className={`px-4 py-2 text-xs font-mono ${
                    p.remaining_debt > 0
                      ? "text-[var(--errorColor)]"
                      : "text-[var(--successColor)]"
                  }`}
                >
                  {p.remaining_debt > 0 ? "-" : ""}
                  {p.remaining_debt?.toLocaleString()}{" "}
                  <span className="text-[10px]">د.ع</span>
                </td>
                <td className="px-4 py-2">
                  <PayStatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Orphanage funds breakdown */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-[var(--borderColor)] bg-[var(--fillColor)]/60">
        <div className="flex flex-wrap gap-2">
          {gapCovered > 0 && (
            <span className="text-[10px] bg-[var(--warningColor)]/10 text-[var(--warningColor)] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
              <AlertTriangle size={10} />
              غُطّي {gapCovered.toLocaleString()} د.ع من فائض الدار
            </span>
          )}
          {uncoveredGap > 0 && (
            <span className="text-[10px] bg-[var(--errorColor)]/10 text-[var(--errorColor)] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
              <AlertTriangle size={10} />
              عجز غير مغطى: {uncoveredGap.toLocaleString()} د.ع
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] text-[var(--textMuted)]">
          <span>
            حصة الدار الأساسية:{" "}
            <strong className="text-[var(--textColor)]">
              {orphanageShare.toLocaleString()} د.ع
            </strong>
          </span>
          {gap > 0 && (
            <span>
              إجمالي دفع الدار:{" "}
              <strong className="text-[var(--warningColor)]">
                {orphanageActualPaid.toLocaleString()} د.ع
              </strong>
            </span>
          )}
          <span>
            الفائض المتاح:{" "}
            <strong className="text-[var(--primeColor)]">
              {surplusAvailable.toLocaleString()} د.ع
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

function OrphanRow({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  const s = STATUS_CFG[item.funding_status] ?? STATUS_CFG["Covered"];

  return (
    <>
      <DataTable.TableRow>
        {/* Name + Sponsors */}
        <DataTable.TableCell>
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-bold text-sm text-[var(--textColor)]">
              {item.orphan_name}
            </span>
            <span className="text-[10px] text-[var(--textMuted)]">
              {item.orphan_type} · {item.orphan_residence}
            </span>
            {/* Sponsors list */}
            {item.sponsor_payments?.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1 justify-end">
                {item.sponsor_payments.map((p: any) => (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      p.remaining_debt <= 0
                        ? "bg-[var(--successColor)]/10 text-[var(--successColor)] border-[var(--successColor)]/30"
                        : p.paid_amount > 0
                          ? "bg-[var(--warningColor)]/10 text-[var(--warningColor)] border-[var(--warningColor)]/30"
                          : "bg-[var(--errorColor)]/10 text-[var(--errorColor)] border-[var(--errorColor)]/30"
                    }`}
                  >
                    {p.sponsor_name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] text-[var(--textMuted)] mt-0.5 italic">
                بدون كفيل
              </span>
            )}
          </div>
        </DataTable.TableCell>

        {/* Orphanage share */}
        <DataTable.TableCell className="hidden md:table-cell font-mono text-sm text-right">
          {item.orphanage_base_share?.toLocaleString()}
          <span className="text-[10px] text-[var(--textMuted)] mr-1">د.ع</span>
        </DataTable.TableCell>

        {/* Sponsor share */}
        <DataTable.TableCell className="hidden md:table-cell font-mono text-sm text-right">
          {item.expected_sponsor_share > 0 ? (
            <>
              {item.expected_sponsor_share?.toLocaleString()}{" "}
              <span className="text-[10px] text-[var(--textMuted)]">د.ع</span>
            </>
          ) : (
            <span className="text-[var(--textMuted)]">—</span>
          )}
        </DataTable.TableCell>

        {/* Total target */}
        <DataTable.TableCell className="font-mono text-sm font-bold text-right">
          {item.total_monthly_target?.toLocaleString()}
          <span className="text-[10px] font-normal text-[var(--textMuted)] mr-1">
            د.ع
          </span>
        </DataTable.TableCell>

        {/* Received */}
        <DataTable.TableCell className="hidden lg:table-cell font-mono text-sm font-bold text-right text-[var(--successColor)]">
          {item.total_actual_received?.toLocaleString()}
          <span className="text-[10px] font-normal mr-1">د.ع</span>
        </DataTable.TableCell>

        {/* Gap */}
        <DataTable.TableCell className="hidden md:table-cell font-mono text-sm font-bold text-right">
          {item.financial_gap > 0 ? (
            <span className="text-[var(--errorColor)]">
              -{item.financial_gap?.toLocaleString()}
              <span className="text-[10px] font-normal mr-1">د.ع</span>
            </span>
          ) : (
            <span className="text-[var(--successColor)]">0</span>
          )}
        </DataTable.TableCell>

        {/* Status */}
        <DataTable.TableCell>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${s.style}`}
          >
            {s.icon} {s.label}
          </span>
        </DataTable.TableCell>

        {/* Expand toggle */}
        <DataTable.TableCell>
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-1.5 rounded-md hover:bg-[var(--fillColor)] text-[var(--textMuted)] transition-colors"
            aria-label="عرض الكفلاء"
          >
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </DataTable.TableCell>
      </DataTable.TableRow>

      {/* Expanded sponsors sub-table */}
      {open && (
        <tr>
          <td colSpan={8} className="p-0">
            <SponsorSubTable
              payments={item.sponsor_payments}
              orphanageShare={item.orphanage_base_share}
              orphanageActualPaid={item.orphanage_actual_paid}
              gap={item.financial_gap}
              gapCovered={item.gap_covered_from_surplus}
              uncoveredGap={item.uncovered_gap}
              surplusAvailable={item.surplus_available}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function OrphanReceivesContent() {
  const { data, error, isLoading } = useGetOrphanReceives();
  const { searchQuery, filterValue } = DataTable.useContext();
  const records = data || [];

  const filtered = useMemo(() => {
    let result = records;
    const q = searchQuery.trim().toLowerCase();
    if (q)
      result = result.filter((o) => o.orphan_name?.toLowerCase().includes(q));
    if (filterValue && filterValue !== "all") {
      const map: Record<string, string> = {
        covered: "Covered",
        partial: "Partially Funded",
        deficit: "Deficit",
      };
      result = result.filter((o) => o.funding_status === map[filterValue]);
    }
    return result;
  }, [records, searchQuery, filterValue]);

  const totals = useMemo(
    () => ({
      target: filtered.reduce((s, o) => s + (o.total_monthly_target ?? 0), 0),
      received: filtered.reduce(
        (s, o) => s + (o.total_actual_received ?? 0),
        0,
      ),
      gap: filtered.reduce((s, o) => s + (o.financial_gap ?? 0), 0),
      deficit: filtered.filter((o) => o.funding_status === "Deficit").length,
      covered: filtered.filter((o) => o.funding_status === "Covered").length,
    }),
    [filtered],
  );

  if (isLoading) return <DataTable.Loading />;
  if (error) return <DataTable.Error message="حدث خطأ عند تحميل البيانات" />;

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)]">
          <div className="p-2 rounded-lg bg-[var(--primeColor)]/10">
            <DollarSign size={18} className="text-[var(--primeColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              الهدف الشهري
            </span>
            <span className="text-sm font-bold text-[var(--textColor)]">
              {totals.target.toLocaleString()} د.ع
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)]">
          <div className="p-2 rounded-lg bg-[var(--successColor)]/10">
            <TrendingUp size={18} className="text-[var(--successColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              إجمالي المُستلم
            </span>
            <span className="text-sm font-bold text-[var(--successColor)]">
              {totals.received.toLocaleString()} د.ع
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)]">
          <div className="p-2 rounded-lg bg-[var(--errorColor)]/10">
            <TrendingDown size={18} className="text-[var(--errorColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              إجمالي العجز
            </span>
            <span className="text-sm font-bold text-[var(--errorColor)]">
              {totals.gap.toLocaleString()} د.ع
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)]">
          <div className="p-2 rounded-lg bg-[var(--successColor)]/10">
            <TrendingUp size={18} className="text-[var(--successColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1">
            <span className="text-[10px] text-[var(--textMuted)]">
              مغطى / عجز
            </span>
            <span className="text-sm font-bold text-[var(--textColor)]">
              <span className="text-[var(--successColor)]">
                {totals.covered}
              </span>
              {" / "}
              <span className="text-[var(--errorColor)]">{totals.deficit}</span>
            </span>
          </div>
        </div>
      </div>

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن يتيم..." />
        <DataTable.Filter label="حالة التمويل" options={FILTER_OPTIONS} />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>اسم اليتيم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              حصة الدار
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              حصة الكفلاء المتوقعة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الهدف (100k)</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              المُستلم الفعلي
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              العجز
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الحالة</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>
              <span className="sr-only">عرض الكفلاء</span>
            </DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filtered}
          emptyMessage="لا توجد نتائج"
          renderRow={(item: any) => (
            <OrphanRow key={item.orphan_id} item={item} />
          )}
        />
      </DataTable.Table>

      <DataTable.ResultsCount count={filtered.length} total={records.length} />
    </>
  );
}

export default function OrphanReceivesTable() {
  return (
    <DataTable.Root>
      <OrphanReceivesContent />
    </DataTable.Root>
  );
}

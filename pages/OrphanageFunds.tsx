import { useMemo, useState, useEffect } from "react";
import { useGetOrphanageFunds } from "../utils/ReactQuerry/OrphanageFunds/useGetOrphanageFunds";
import { useUpdateOrphanageFundNote } from "../utils/ReactQuerry/OrphanageFunds/useUpdateOrphanageFunds";
import { DataTable } from "../components/CompoundTable";
import {
  Landmark,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  StickyNote,
} from "lucide-react";

interface FundRecord {
  id: string;
  amount: number;
  transaction_type: string;
  source_payment_id: string | null;
  note: string | null;
  created_at: string;
}

const FUND_FILTERS = [
  { label: "فائض", value: "surplus" },
  { label: "تبرع", value: "donation" },
];

function OrphanageFundsContent() {
  const { data: funds, isLoading, isError } = useGetOrphanageFunds();
  const { updateNote } = useUpdateOrphanageFundNote();
  const { searchQuery, filterValue } = DataTable.useContext();
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (funds) {
      const initialNotes: Record<string, string> = {};
      funds.forEach((f: FundRecord) => {
        initialNotes[f.id] = f.note || "";
      });
      setNotes(initialNotes);
    }
  }, [funds]);

  const records: FundRecord[] = funds || [];

  const filtered = useMemo(() => {
    let result = records;
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (f) =>
          f.note?.toLowerCase().includes(query) ||
          f.transaction_type?.toLowerCase().includes(query),
      );
    }
    if (filterValue && filterValue !== "all") {
      result = result.filter((f) => f.transaction_type === filterValue);
    }
    return result;
  }, [records, searchQuery, filterValue]);

  const totalFunds = records.reduce((s, f) => s + (f.amount || 0), 0);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "surplus":
        return "فائض";
      case "donation":
        return "تبرع";
      default:
        return type;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "surplus":
        return "bg-[var(--primeColor)]/10 text-[var(--primeColor)] border-[var(--primeColor)]";
      case "donation":
        return "bg-[var(--successColor)]/10 text-[var(--successColor)] border-[var(--successColor)]";
      default:
        return "bg-[var(--fillColor)] text-[var(--textMuted)] border-[var(--borderColor)]";
    }
  };

  if (isLoading) return <DataTable.Loading />;
  if (isError)
    return <DataTable.Error message="حدث خطأ عند تحميل بيانات الصندوق" />;

  return (
    <>
      {/* Summary card */}
      <div className="mb-5">
        <div className="relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl border border-[var(--borderColor)] bg-gradient-to-bl from-[var(--fillColor)] to-[var(--backgroundColor)]">
          <div className="absolute -left-4 -bottom-4 opacity-5">
            <Landmark size={90} />
          </div>
          <div className="p-3 rounded-xl bg-[var(--primeColor)]/10 shrink-0">
            <Landmark size={24} className="text-[var(--primeColor)]" />
          </div>
          <div className="flex flex-col items-end flex-1 gap-0.5">
            <span className="text-[11px] text-[var(--textMuted)] font-medium">
              إجمالي الصندوق
            </span>
            <span className="text-2xl font-bold text-[var(--textColor)] tabular-nums">
              {totalFunds.toLocaleString()}
              <span className="text-sm font-normal text-[var(--textMuted)] mr-1">
                د.ع
              </span>
            </span>
            <span className="text-[10px] text-[var(--textMuted)]">
              {records.length} عملية مسجلة
            </span>
          </div>
        </div>
      </div>

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث في الملاحظات..." />
        <DataTable.Filter label="نوع العملية" options={FUND_FILTERS} />
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--fillColor)] rounded-xl border border-[var(--borderColor)]">
          <TrendingUp size={16} className="text-[var(--primeColor)]" />
          <span className="text-xs font-bold">{filtered.length} عملية</span>
        </div>
      </DataTable.Header>

      {/* Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[var(--borderColor)]">
        <div className="min-w-[700px]">
          {" "}
          {/* Forces the table to maintain width on mobile */}
          <DataTable.Table>
            <DataTable.TableHead>
              <DataTable.TableRow>
                <DataTable.TableHeaderCell className="w-[150px]">
                  المبلغ
                </DataTable.TableHeaderCell>
                <DataTable.TableHeaderCell className="w-[120px]">
                  نوع العملية
                </DataTable.TableHeaderCell>
                <DataTable.TableHeaderCell className="min-w-[250px]">
                  الملاحظات
                </DataTable.TableHeaderCell>
                <DataTable.TableHeaderCell className="w-[180px]">
                  التاريخ
                </DataTable.TableHeaderCell>
              </DataTable.TableRow>
            </DataTable.TableHead>

            <DataTable.TableBody
              data={filtered}
              emptyMessage={
                filterValue !== "all"
                  ? "لا توجد عمليات تطابق هذا الفلتر"
                  : "لا توجد عمليات في الصندوق"
              }
              renderRow={(fund: FundRecord) => (
                <DataTable.TableRow key={fund.id}>
                  {/* Amount Cell */}
                  <DataTable.TableCell>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {fund.transaction_type === "surplus" ? (
                        <ArrowDownRight
                          size={16}
                          className="text-[var(--primeColor)] shrink-0"
                        />
                      ) : (
                        <ArrowUpRight
                          size={16}
                          className="text-[var(--successColor)] shrink-0"
                        />
                      )}
                      <span className="font-bold text-sm text-[var(--textColor)] tabular-nums">
                        {fund.amount?.toLocaleString()}{" "}
                        <span className="text-[10px] font-normal text-[var(--textMuted)]">
                          د.ع
                        </span>
                      </span>
                    </div>
                  </DataTable.TableCell>

                  {/* Type Cell */}
                  <DataTable.TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap ${getTypeStyle(fund.transaction_type)}`}
                    >
                      {getTypeLabel(fund.transaction_type)}
                    </span>
                  </DataTable.TableCell>

                  {/* Notes Cell (Textarea) */}
                  <DataTable.TableCell>
                    <div className="relative group min-w-[200px]">
                      <textarea
                        rows={1}
                        className="w-full text-xs text-[var(--textColor)] bg-[var(--borderColor)] border border-transparent rounded-lg px-2 py-2 
                          hover:border-[var(--primeColor)] focus:bg-[var(--fillColor)] focus:border-[var(--primeColor)] 
                          focus:ring-2 focus:ring-[var(--primeColor)]/10 resize-none overflow-hidden"
                        value={notes[fund.id] ?? ""}
                        placeholder="ملاحظة..."
                        maxLength={200}
                        onChange={(e) => {
                          setNotes((prev) => ({
                            ...prev,
                            [fund.id]: e.target.value,
                          }));
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onBlur={() =>
                          updateNote({
                            id: fund.id,
                            note: notes[fund.id] ?? "",
                          })
                        }
                      />
                      <StickyNote
                        size={12}
                        className="absolute left-2 top-2.5 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity"
                      />
                    </div>
                  </DataTable.TableCell>

                  {/* Date Cell */}
                  <DataTable.TableCell className="tabular-nums text-[var(--textMuted2)] text-xs whitespace-nowrap">
                    {fund.created_at
                      ? new Date(fund.created_at).toLocaleDateString("ar-IQ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </DataTable.TableCell>
                </DataTable.TableRow>
              )}
            />
          </DataTable.Table>
        </div>
      </div>

      <DataTable.ResultsCount count={filtered.length} total={records.length} />
    </>
  );
}

export default function OrphanageFunds() {
  return (
    <div className="mx-4 md:mx-8 mb-8">
      <div className="mt-6 md:mt-8 mr-2 mb-6 md:mb-8 flex flex-col items-end">
        <h1 className="mb-2 text-xl md:text-2xl font-bold text-[var(--textColor)]">
          صندوق الدار
        </h1>
        <p className="mb-4 text-[var(--subTextColor)] text-sm">
          سجل الفائض والتبرعات الواردة لدار الأيتام
        </p>
      </div>
      <DataTable.Root>
        <OrphanageFundsContent />
      </DataTable.Root>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { SquarePen, CreditCard, StickyNote, Users } from "lucide-react";
import { DataTable } from "../../components/CompoundTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetSponsorPayments } from "../../utils/ReactQuerry/SponsorPayments/useGetSponsorPayments";
import { useUpdateSponsorPaymentNote } from "../../utils/ReactQuerry/SponsorPayments/useUpdateSponsorPayments";
import SponsorPaymentModal from "./SponsorPaymentsModal";
import OrphansModal from "../OrphansModal";

interface OrphanEntry {
  id: string;
  name: string;
}

interface PaymentRecord {
  id: string;
  sponsor_name: string;
  sponsor_id?: string;
  payment_target_month: string;
  expected_amount: number;
  paid_amount: number;
  extra_charity: number;
  remaining_debt: number;
  payment_date: string | null;
  status: "مدفوع بالكامل" | "فائض" | "مدفوع جزئيا" | "متوقف" | "قيد الانتظار";
  note?: string;
  orphans?: OrphanEntry[];
  _isVirtual?: boolean;
}

const PAYMENT_FILTERS = [
  { label: "مدفوع بالكامل", value: "مدفوع بالكامل" },
  { label: "فائض", value: "فائض" },
  { label: "مدفوع جزئياً", value: "مدفوع جزئيا" },
  { label: "متوقف", value: "متوقف" },
  { label: "قيد الانتظار", value: "قيد الانتظار" },
];

function SponsorPaymentsTableContent() {
  const { data: payments, isLoading, isError } = useGetSponsorPayments();
  const { updateNote } = useUpdateSponsorPaymentNote();

  const { searchQuery, filterValue, setIsModalOpen, editItem, setEditItem } =
    DataTable.useContext();

  const [notes, setNotes] = useState<Record<string, string>>({});

  // Orphans modal state
  const [orphansModal, setOrphansModal] = useState<{
    open: boolean;
    sponsorName: string;
    orphans: OrphanEntry[];
  }>({ open: false, sponsorName: "", orphans: [] });

  // Sync notes without clobbering active edits
  useEffect(() => {
    if (payments) {
      setNotes((prev) => {
        const next = { ...prev };
        payments.forEach((p: PaymentRecord) => {
          if (!(p.id in next)) next[p.id] = p.note || "";
        });
        return next;
      });
    }
  }, [payments]);

  const filteredPayments = useMemo(() => {
    let data: PaymentRecord[] = payments || [];
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      data = data.filter(
        (p) =>
          p.sponsor_name?.toLowerCase().includes(query) ||
          p.orphans?.some((o) => o.name.toLowerCase().includes(query)),
      );
    }
    if (filterValue && filterValue !== "all") {
      data = data.filter((p) => p.status === filterValue);
    }
    return data;
  }, [payments, searchQuery, filterValue]);

  const handleEditAction = (payment: PaymentRecord) => {
    setEditItem(payment);
    setIsModalOpen(true);
  };

  const openOrphansModal = (payment: PaymentRecord) => {
    setOrphansModal({
      open: true,
      sponsorName: payment.sponsor_name,
      orphans: payment.orphans || [],
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "مدفوع بالكامل":
        return "bg-[var(--successColor)]/10 text-[var(--successColor)] border-[var(--successColor)]";
      case "فائض":
        return "bg-[var(--primeColor)]/10 text-[var(--primeColor)] border-[var(--primeColor)]";
      case "مدفوع جزئيا":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "متوقف":
        return "bg-[var(--errorColor)]/10 text-[var(--errorColor)] border-[var(--errorColor)]";
      case "قيد الانتظار":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-[var(--fillColor)] text-[var(--textMuted)] border-[var(--borderColor)]";
    }
  };

  const renderRemaining = (payment: PaymentRecord) => {
    if (payment.status === "قيد الانتظار") {
      return (
        <span className="text-[var(--errorColor)] font-bold tabular-nums">
          −{payment.expected_amount?.toLocaleString()}
          <span className="text-[10px] font-normal"> د.ع</span>
        </span>
      );
    }
    if (payment.extra_charity > 0) {
      return (
        <span className="text-[var(--primeColor)] font-bold tabular-nums">
          +{payment.extra_charity.toLocaleString()}
          <span className="text-[10px] font-normal"> د.ع</span>
        </span>
      );
    }
    if (payment.remaining_debt > 0) {
      return (
        <span className="text-[var(--errorColor)] font-bold tabular-nums">
          −{payment.remaining_debt.toLocaleString()}
          <span className="text-[10px] font-normal"> د.ع</span>
        </span>
      );
    }
    return (
      <span className="text-[var(--successColor)] font-bold tabular-nums">
        ✓ مسدًّد
      </span>
    );
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <DataTable.Error message="حدث خطأ بتحميل البيانات" />;

  return (
    <>
      {/* Payment edit modal */}
      <DataTable.ModalWrapper>
        <SponsorPaymentModal
          setIsModel={(val: boolean) => setIsModalOpen(!!val)}
          onSuccess={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      {/* Orphans detail modal — rendered outside DataTable.ModalWrapper */}
      {orphansModal.open && (
        <OrphansModal
          sponsorName={orphansModal.sponsorName}
          orphans={orphansModal.orphans}
          onClose={() => setOrphansModal((s) => ({ ...s, open: false }))}
        />
      )}

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث باسم الكفيل أو اليتيم..." />
        <DataTable.Filter label="حالة الدفع" options={PAYMENT_FILTERS} />
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--fillColor)] rounded-xl border border-[var(--borderColor)]">
          <CreditCard size={18} className="text-[var(--primeColor)]" />
          <span className="text-sm font-bold">
            السجلات: {filteredPayments.length}
          </span>
        </div>
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <DataTable.TableRow>
            <DataTable.TableHeaderCell>الكفيل</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              المبلغ المتوقع
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden md:table-cell">
              المبلغ المدفوع
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              المتبقي
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="hidden lg:table-cell">
              التاريخ
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الحالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="text-center">
              الإجراءات
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="w-1/4 min-w-[150px]">
              الملاحظات
            </DataTable.TableHeaderCell>
          </DataTable.TableRow>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredPayments}
          emptyMessage={
            filterValue !== "all"
              ? "لا توجد دفعات تطابق هذا الفلتر"
              : "لا توجد بيانات"
          }
          renderRow={(payment: PaymentRecord) => (
            <DataTable.TableRow key={payment.id}>
              {/* Sponsor name + orphans badge */}
              <DataTable.TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[var(--textColor)] truncate max-w-[160px]">
                    {payment.sponsor_name || "—"}
                  </span>

                  {/* Orphan badge — click to open modal */}
                  {payment.orphans && payment.orphans.length > 0 ? (
                    <button
                      onClick={() => openOrphansModal(payment)}
                      className="flex items-center gap-1 w-fit group"
                      title="عرض الأيتام المكفولين"
                    >
                      <Users
                        size={11}
                        className="text-[var(--primeColor)] shrink-0"
                      />
                      <span className="text-[10px] text-[var(--primeColor)] font-medium group-hover:underline">
                        {payment.orphans.length === 1
                          ? payment.orphans[0].name
                          : `${payment.orphans.length} أيتام`}
                      </span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-[var(--textMuted)] opacity-50">
                      بدون كفالة يتيم
                    </span>
                  )}

                  {/* Mobile: paid amount */}
                  <span className="md:hidden text-xs font-bold text-[var(--primeColor)]">
                    المدفوع: {payment.paid_amount?.toLocaleString()} د.ع
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell font-mono font-bold">
                {payment.expected_amount?.toLocaleString()}{" "}
                <span className="text-[10px] font-normal">د.ع</span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden md:table-cell font-mono font-bold text-[var(--primeColor)]">
                {payment.paid_amount?.toLocaleString()}{" "}
                <span className="text-[10px] font-normal">د.ع</span>
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell">
                {renderRemaining(payment)}
              </DataTable.TableCell>

              <DataTable.TableCell className="hidden lg:table-cell tabular-nums text-[var(--textMuted2)]">
                {payment.payment_date || "—"}
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border ${getStatusStyle(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </div>
              </DataTable.TableCell>

              <DataTable.TableCell>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleEditAction(payment)}
                    className="p-2 text-[var(--primeColor)] hover:bg-[var(--primeColor)]/10 rounded-lg transition-all"
                    title="تعديل"
                  >
                    <SquarePen size={18} />
                  </button>
                </div>
              </DataTable.TableCell>

              {/* Live note */}
              <DataTable.TableCell>
                <div className="relative group">
                  <textarea
                    rows={1}
                    dir="rtl"
                    className="w-full text-xs text-[var(--textColor)] bg-[var(--borderColor)] border border-transparent rounded-lg px-2 py-2
                      hover:border-[var(--primeColor)] focus:bg-[var(--fillColor)] focus:border-[var(--primeColor)]
                      focus:ring-2 focus:ring-[var(--primeColor)]/10 resize-none overflow-hidden"
                    value={notes[payment.id] ?? ""}
                    placeholder="ملاحظة..."
                    maxLength={90}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNotes((prev) => ({ ...prev, [payment.id]: val }));
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onBlur={() => {
                      if (!payment.id?.startsWith("virtual-")) {
                        updateNote({
                          id: payment.id,
                          note: notes[payment.id] || "",
                        });
                      }
                    }}
                  />
                  <StickyNote
                    size={12}
                    className="absolute left-2 top-2.5 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity"
                  />
                </div>
              </DataTable.TableCell>
            </DataTable.TableRow>
          )}
        />
      </DataTable.Table>

      <DataTable.ResultsCount
        count={filteredPayments.length}
        total={payments?.length || 0}
      />
    </>
  );
}

export default function SponsorPaymentsTable() {
  return (
    <DataTable.Root>
      <SponsorPaymentsTableContent />
    </DataTable.Root>
  );
}

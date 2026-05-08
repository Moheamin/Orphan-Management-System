import { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  useCreateSponsorPayment,
  useUpdateSponsorPayment,
} from "../../utils/ReactQuerry/SponsorPayments/useUpdateSponsorPayments";

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
  status: string;
  note?: string;
  orphan_names?: string[];
  _isVirtual?: boolean;
}

interface SponsorPaymentModalProps {
  setIsModel: (val: boolean) => void;
  onSuccess: () => void;
  editData: PaymentRecord | null;
}

export default function SponsorPaymentModal({
  setIsModel,
  onSuccess,
  editData,
}: SponsorPaymentModalProps) {
  const { updatePaymentMutate, isPending: isUpdating } =
    useUpdateSponsorPayment();
  const { createPaymentMutate, isPending: isCreating } =
    useCreateSponsorPayment();

  const isVirtual = editData?._isVirtual;
  const isPending = isUpdating || isCreating;

  const [paidAmount, setPaidAmount] = useState<string>("");
  const [expectedAmount, setExpectedAmount] = useState<string>("");

  useEffect(() => {
    if (editData) {
      setPaidAmount(String(editData.paid_amount ?? 0));
      setExpectedAmount(String(editData.expected_amount ?? 0));
    }
  }, [editData]);

  if (!editData) return null;

  const paid = parseFloat(paidAmount) || 0;
  const expected = parseFloat(expectedAmount) || 0;
  const diff = paid - expected;

  // Preview what the status will be after saving (mirrors DB trigger logic)
  const previewStatus = (() => {
    if (paid === 0) return "قيد الانتظار";
    if (paid === expected) return "مدفوع بالكامل";
    if (paid > expected) return "فائض";
    return "مدفوع جزئيا";
  })();

  const getStatusStyle = (s: string) => {
    switch (s) {
      case "مدفوع بالكامل":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "فائض":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "مدفوع جزئيا":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "متوقف":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const handleSubmit = () => {
    if (isVirtual && editData.sponsor_id) {
      // Create a real DB record for a virtual (pending-insert) payment
      createPaymentMutate(
        {
          sponsor_id: editData.sponsor_id,
          payment_target_month: editData.payment_target_month,
          expected_amount: expected,
          paid_amount: paid,
          note: editData.note || "",
        },
        {
          onSuccess: () => onSuccess(),
        },
      );
    } else {
      // Update existing record — DB trigger handles status, remaining_debt, extra_charity, payment_date, and surplus routing
      updatePaymentMutate(
        {
          id: editData.id,
          paid_amount: paid,
          expected_amount: expected,
        },
        {
          onSuccess: () => onSuccess(),
        },
      );
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsModel(false);
      }}
    >
      <div className="bg-[var(--backgroundColor)] border border-[var(--borderColor)] rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--borderColor)]">
          <button
            onClick={() => setIsModel(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--fillColor)] transition-colors text-[var(--textMuted)]"
          >
            <X size={18} />
          </button>
          <div className="flex flex-col items-end gap-0.5">
            <h2 className="font-bold text-[var(--textColor)] text-base">
              تعديل بيانات الدفعة
            </h2>
            <span className="text-xs text-[var(--textMuted)]">
              {editData.payment_target_month}
            </span>
          </div>
        </div>

        {/* Sponsor Info */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--fillColor)] border border-[var(--borderColor)]">
            <div className="flex items-center gap-2 text-xs text-[var(--textMuted)]">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusStyle(editData.status)}`}
              >
                {editData.status}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[var(--textColor)]">
                  {editData.sponsor_name}
                </span>
                <User size={14} className="text-[var(--primeColor)]" />
              </div>
              {editData.orphan_names && editData.orphan_names.length > 0 && (
                <span className="text-[10px] text-[var(--textMuted)] text-right">
                  الأيتام:{" "}
                  <span className="text-[var(--primeColor)] font-medium">
                    {editData.orphan_names.join("، ")}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-5 py-3 space-y-4">
          {/* Expected Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--textColor)] text-right">
              المبلغ المتوقع <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                className="w-full text-sm font-mono bg-[var(--fillColor)] border border-[var(--borderColor)] rounded-xl
                  px-4 py-2.5 text-right pr-14
                  focus:outline-none focus:ring-2 focus:ring-[var(--primeColor)]/20 focus:border-[var(--primeColor)]
                  transition-all"
                value={expectedAmount}
                onChange={(e) => setExpectedAmount(e.target.value)}
                placeholder="0"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-[var(--textMuted)] font-medium">
                د.ع
              </span>
            </div>
          </div>

          {/* Paid Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--textColor)] text-right">
              المبلغ المدفوع <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                className="w-full text-sm font-mono bg-[var(--fillColor)] border border-[var(--borderColor)] rounded-xl
                  px-4 py-2.5 text-right pr-14
                  focus:outline-none focus:ring-2 focus:ring-[var(--primeColor)]/20 focus:border-[var(--primeColor)]
                  transition-all"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="0"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-[var(--textMuted)] font-medium">
                د.ع
              </span>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] p-3 space-y-2">
            <p className="text-[10px] font-bold text-[var(--textMuted)] text-right uppercase tracking-wide">
              معاينة النتيجة
            </p>

            {/* Status preview */}
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusStyle(previewStatus)}`}
              >
                {previewStatus}
              </span>
              <span className="text-xs text-[var(--textMuted)]">
                الحالة بعد الحفظ
              </span>
            </div>

            {/* Difference */}
            {paid > 0 && (
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold tabular-nums ${diff > 0 ? "text-[var(--primeColor)]" : diff < 0 ? "text-red-500" : "text-emerald-600"}`}
                >
                  {diff > 0
                    ? `+${diff.toLocaleString()} د.ع (فائض → صندوق الدار)`
                    : diff < 0
                      ? `−${Math.abs(diff).toLocaleString()} د.ع (متبقي)`
                      : "✓ مسدًّد بالكامل"}
                </span>
                <span className="text-xs text-[var(--textMuted)]">الفرق</span>
              </div>
            )}

            {/* Surplus note */}
            {diff > 0 && (
              <div className="flex items-start gap-1.5 pt-1 border-t border-[var(--borderColor)]">
                <p className="text-[10px] text-[var(--primeColor)] text-right leading-relaxed">
                  سيتم إضافة الفائض تلقائياً إلى صندوق الدار عند الحفظ
                </p>
                <CheckCircle2
                  size={12}
                  className="text-[var(--primeColor)] shrink-0 mt-0.5"
                />
              </div>
            )}
          </div>

          {/* Virtual record warning */}
          {isVirtual && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 text-right leading-relaxed">
                هذا سجل مؤقت. سيتم إنشاء دفعة جديدة في قاعدة البيانات عند الحفظ.
              </p>
              <AlertCircle
                size={14}
                className="text-amber-600 shrink-0 mt-0.5"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-5 pt-2">
          <button
            onClick={() => setIsModel(false)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[var(--borderColor)] text-[var(--textMuted)]
              hover:bg-[var(--fillColor)] transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || (!paidAmount && !expectedAmount)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[var(--primeColor)] text-white
              hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

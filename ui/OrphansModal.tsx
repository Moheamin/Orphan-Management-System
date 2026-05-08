import { X, UserRound, Heart } from "lucide-react";

interface OrphanEntry {
  id: string;
  name: string;
}

interface OrphansModalProps {
  sponsorName: string;
  orphans: OrphanEntry[];
  onClose: () => void;
}

export default function OrphansModal({
  sponsorName,
  orphans,
  onClose,
}: OrphansModalProps) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[var(--backgroundColor)] border border-[var(--borderColor)] rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--borderColor)]">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--fillColor)] transition-colors text-[var(--textMuted)]"
          >
            <X size={17} />
          </button>
          <div className="flex flex-col items-end">
            <h2 className="font-bold text-[var(--textColor)] text-sm">
              الأيتام المكفولون
            </h2>
            <span className="text-[11px] text-[var(--textMuted)]">
              {sponsorName}
            </span>
          </div>
        </div>

        {/* List */}
        <div className="p-4">
          {orphans.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-[var(--textMuted)]">
              <UserRound size={32} className="opacity-30" />
              <p className="text-sm">لا يوجد أيتام مسجلون لهذا الكفيل</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {orphans.map((orphan, i) => (
                <li
                  key={orphan.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--fillColor)] border border-[var(--borderColor)]"
                >
                  <span className="text-[10px] text-[var(--textMuted)] tabular-nums">
                    #{i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--textColor)]">
                      {orphan.name}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[var(--primeColor)]/10 flex items-center justify-center">
                      <Heart size={13} className="text-[var(--primeColor)]" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Count badge */}
        {orphans.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-end gap-1.5 px-3 py-2 rounded-xl bg-[var(--primeColor)]/5 border border-[var(--primeColor)]/20">
              <span className="text-xs text-[var(--textMuted)]">
                إجمالي الأيتام
              </span>
              <span className="text-sm font-bold text-[var(--primeColor)]">
                {orphans.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

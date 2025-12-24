import { X, AlertTriangle } from "lucide-react";

export default function CheckPopup({
  onClick,
  onCancel,
}: {
  onClick?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header with Icon */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 px-6 pt-6 pb-4 relative">
          <button
            onClick={onCancel}
            className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">تأكيد الحذف</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-center text-gray-600 text-base leading-relaxed">
            هل أنت متأكد من حذف هذا العنصر؟
            <br />
            <span className="text-sm text-gray-500 mt-2 inline-block">
              لا يمكن التراجع عن هذا الإجراء
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClick}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            حذف
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl border border-gray-200 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            إلغاء
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

import { use, useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useDeleteOrphans, useGetOrphans } from "../utils/reactQurry";
import LoadingSpinner from "../ui/LoadingSpinner";
import { SquarePen, Search, X } from "lucide-react";

export default function Table() {
  const [isModel, setIsModel] = useState(false);
  // React Query handles loading, error, and data states for you
  const { data, error, isLoading } = useGetOrphans();

  const { deleteOrphanMutate } = useDeleteOrphans();
  // Extract orphans from the data, with fallback to empty array
  const orphans = data?.orphan || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-red-600">حدث خطأ في تحميل البيانات</span>
      </div>
    );
  }
  return (
    <>
      {/* Pass onSuccess callback - though it's optional since mutation handles it */}
      {isModel && (
        <Modal
          setIsModel={setIsModel}
          onSuccess={() => {
            // Optional: Do something extra after success
            console.log("Orphan added successfully!");
          }}
        />
      )}

      <div
        dir="rtl"
        className="w-full rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4 md:p-6"
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} color="var(--iconColor)" />
            </span>
            <input
              type="text"
              placeholder="البحث عن كفيل..."
              className="w-full rounded-full border border-emerald-100 bg-emerald-50 px-10 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* top bar: filter + search */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Button
              adj="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm hover:bg-emerald-50 transition"
              onClick={() => (isModel ? setIsModel(false) : setIsModel(true))}
            >
              <span className="text-md font-semibold">اضافة</span>
              <span className="text-md font-semibold">كفيل</span>
            </Button>
          </div>
        </div>
        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-scroll rounded-2xl border border-emerald-100 bg-white text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-900">
                  الاسم
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-900">
                  العمر
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-900">
                  نوع اليتيم
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-900">
                  السكن
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-900">
                  الأولوية
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-900">
                  حالة الكفالة
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-900">
                  الإجراءات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-emerald-50">
              {orphans.map((orphan: any) => {
                const priorityColor =
                  orphan?.priority >= 90
                    ? "bg-red-500"
                    : orphan?.priority >= 75
                    ? "bg-orange-400"
                    : "bg-emerald-600";

                const sponsorshipClasses =
                  orphan?.sponsorship_status === "مكفول"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200";

                return (
                  <tr
                    key={orphan?.id ?? `${orphan?.name}-${orphan?.age}`}
                    className="hover:bg-emerald-50/60 transition-colors"
                  >
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {orphan?.name}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {orphan?.age} سنة
                    </td>

                    <td className="px-4 py-3 text-gray-700">{orphan?.type}</td>

                    <td className="px-4 py-3 text-gray-700">
                      {orphan?.residence}
                    </td>

                    {/* priority with small progress bar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {orphan?.priority}
                        </span>
                        <div className="h-1.5 w-24 rounded-full bg-emerald-50">
                          <div
                            className={`h-full rounded-full ${priorityColor}`}
                            style={{
                              width: `${Math.min(
                                Number(orphan?.priority) || 0,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* sponsorship pill */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium ${sponsorshipClasses}`}
                      >
                        {orphan?.is_sponsored ? "مكفول" : "غير مكفول"}
                      </span>
                    </td>

                    {/* actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-start gap-3">
                        <button>
                          <SquarePen
                            size={16}
                            color="var(--iconColor)"
                            className="cursor-pointer"
                          />
                        </button>
                        <button onClick={() => deleteOrphanMutate(orphan?.id)}>
                          <X
                            size={16}
                            color="#be1010"
                            className="cursor-pointer"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

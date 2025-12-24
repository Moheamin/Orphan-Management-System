import { useMemo } from "react";
import { SquarePen, X } from "lucide-react";
import { useGetOrphans } from "../../utils/ReactQuerry/Orphans/useGetOrphans";
import { useDeleteOrphans } from "../../utils/ReactQuerry/Orphans/useDeleteOrphans";
import OrphanModal from "./OrphanModal";
import CheckPopup from "../checkPopup";
import { DataTable } from "../../components/CompoundTable";

// Priority color function (reversed: 0 = green, 100 = red)
const getPriorityColor = (value?: number | string) => {
  const v = Math.min(Math.max(Number(value) || 0, 0), 100);
  const hue = Math.round(120 - (v / 100) * 120);
  return `hsl(${hue} 72% 38%)`;
};

function OrphansTableContent() {
  const { data, error, isLoading } = useGetOrphans();
  const { deleteOrphanMutate } = useDeleteOrphans();
  const { searchQuery, deleteConfirm, setDeleteConfirm, setIsModalOpen } =
    DataTable.useContext();

  const orphans = data?.orphan || [];

  const filteredOrphans = useMemo(() => {
    if (!searchQuery.trim()) return orphans;

    const query = searchQuery.toLowerCase();
    return orphans.filter(
      (orphan: any) =>
        orphan?.name?.toLowerCase().includes(query) ||
        orphan?.phone?.toLowerCase().includes(query) ||
        orphan?.email?.toLowerCase().includes(query)
    );
  }, [orphans, searchQuery]);

  function handleDelete(orphanId: number) {
    deleteOrphanMutate(orphanId, {
      onSuccess: () => {
        setDeleteConfirm(null);
      },
      onError: (error) => {
        console.error("Failed to delete orphan:", error);
        setDeleteConfirm(null);
      },
    });
  }

  if (isLoading) return <DataTable.Loading />;
  if (error) return <DataTable.Error />;

  return (
    <>
      {/* Modal rendered when isModalOpen is true */}
      <DataTable.ModalWrapper>
        <OrphanModal
          setIsModal={(value) => setIsModalOpen(typeof value === 'function' ? value(false) : value)}
          onSuccess={() => console.log("Orphan added successfully!")}
        />
      </DataTable.ModalWrapper>

      {/* Delete Confirmation Popup */}
      {deleteConfirm !== null && (
        <CheckPopup
          onClick={() => handleDelete(deleteConfirm as number)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن يتيم..." />
        <DataTable.AddButton label="يتيم" />
      </DataTable.Header>

      <DataTable.Table>
        <DataTable.TableHead>
          <tr>
            <DataTable.TableHeaderCell>الاسم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>العمر</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>نوع اليتيم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>السكن</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الأولوية</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>حالة الكفالة</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الإجراءات</DataTable.TableHeaderCell>
          </tr>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredOrphans}
          emptyMessage="لا توجد بيانات"
          renderRow={(orphan: any) => {
            const progress = Math.min(Number(orphan?.priority) || 0, 100);

            return (
              <DataTable.TableRow
                key={orphan?.id ?? `${orphan?.name}-${orphan?.age}`}
              >
                <DataTable.TableCell className="text-right font-medium text-gray-900">
                  {orphan?.name}
                </DataTable.TableCell>

                <DataTable.TableCell className="text-gray-700">
                  {orphan?.age} سنة
                </DataTable.TableCell>

                <DataTable.TableCell className="text-gray-700">
                  {orphan?.type}
                </DataTable.TableCell>

                <DataTable.TableCell className="text-gray-700">
                  {orphan?.residence}
                </DataTable.TableCell>

                <DataTable.TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {orphan?.priority}
                    </span>
                    <div className="h-1.5 w-24 rounded-full bg-emerald-50">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: getPriorityColor(progress),
                        }}
                      />
                    </div>
                  </div>
                </DataTable.TableCell>

                <DataTable.TableCell>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium ${
                      orphan?.is_sponsored
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {orphan?.is_sponsored ? "مكفول" : "غير مكفول"}
                  </span>
                </DataTable.TableCell>

                <DataTable.TableCell>
                  <div className="flex items-center justify-start gap-3">
                    <button
                      title="تعديل"
                      className="text-gray-500 hover:text-emerald-600 transition"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirm(orphan?.id)}>
                      <X size={16} color="#be1010" className="cursor-pointer" />
                    </button>
                  </div>
                </DataTable.TableCell>
              </DataTable.TableRow>
            );
          }}
        />
      </DataTable.Table>

      <DataTable.ResultsCount
        filteredCount={filteredOrphans.length}
        totalCount={orphans.length}
        label="يتيم"
      />
    </>
  );
}

// Main export with Root provider
export default function OrphansTable() {
  return (
    <DataTable.Root>
      <OrphansTableContent />
    </DataTable.Root>
  );
}

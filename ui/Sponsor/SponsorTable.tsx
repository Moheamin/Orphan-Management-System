import { useMemo } from "react";
import { SquarePen, X, Mail, Phone } from "lucide-react";
import { useGetSponsors } from "../../utils/ReactQuerry/Sponsers/useGetSponsors";
import { useDeleteSponsors } from "../../utils/ReactQuerry/Sponsers/useDeleteSponsors";
import SponsorModal from "./SponsorModal";
import CheckPopup from "../checkPopup";
import { DataTable } from "../../components/CompoundTable";

function SponsorsTableContent() {
  const { data, error, isLoading } = useGetSponsors();
  const { deleteSponsorMutate } = useDeleteSponsors();
  const {
    searchQuery,
    deleteConfirm,
    setDeleteConfirm,
    setIsModalOpen,
    editItem,
    setEditItem,
  } = DataTable.useContext();

  const sponsors = data?.sponsor || [];

  // Filter sponsors based on search query
  const filteredSponsors = useMemo(() => {
    if (!searchQuery.trim()) return sponsors;

    const query = searchQuery.toLowerCase();
    return sponsors.filter(
      (sponsor: any) =>
        sponsor?.name?.toLowerCase().includes(query) ||
        sponsor?.phone?.toLowerCase().includes(query) ||
        sponsor?.email?.toLowerCase().includes(query),
    );
  }, [sponsors, searchQuery]);

  function handleDelete(sponsorId: string) {
    deleteSponsorMutate(sponsorId, {
      onSuccess: () => setDeleteConfirm(null),
      onError: (error) => {
        console.error("Failed to delete sponsor:", error);
        setDeleteConfirm(null);
      },
    });
  }

  function handleEdit(sponsor: any) {
    setEditItem(sponsor);
    setIsModalOpen(true);
  }

  if (isLoading) return <DataTable.Loading />;
  if (error) return <DataTable.Error />;

  return (
    <>
      {/* Modal */}
      <DataTable.ModalWrapper>
        <SponsorModal
          setIsModel={(value) =>
            setIsModalOpen(typeof value === "function" ? value(false) : value)
          }
          onCompleted={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <CheckPopup
          onClick={() => handleDelete(deleteConfirm as string)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث عن كفيل..." />
        <DataTable.AddButton label="كفيل" />
      </DataTable.Header>

      <DataTable.Table className="table-fixed w-full">
        <DataTable.TableHead>
          <tr className="border-b border-[var(--borderColor)]">
            <DataTable.TableHeaderCell className="py-3 px-4 text-right text-[var(--textMuted2)] w-1/7">
              الاسم
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="py-3 px-4 text-right text-[var(--textMuted2)] w-2/7">
              معلومات الاتصال
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="py-3 px-4 text-center text-[var(--textMuted2)] w-1/7">
              عدد الكفالات
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="py-3 px-4 text-[var(--textMuted2)] w-1/7">
              نوع الكفالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="py-3 px-4 text-[var(--textMuted2)] w-1/7">
              تاريخ الانضمام
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="py-3 px-4 text-center text-[var(--textMuted2)] w-1/7">
              الحالة
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell className="py-3 px-4 text-center text-[var(--textMuted2)] w-1/7">
              الإجراءات
            </DataTable.TableHeaderCell>
          </tr>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredSponsors}
          emptyMessage="لا توجد بيانات"
          renderRow={(sponsor: any) => {
            const statusClasses =
              sponsor?.status === "نشط"
                ? "bg-[var(--primeColor)] text-white"
                : "bg-[var(--backgroundColor)] text-[var(--textMuted)] border border-[var(--borderColor)]";

            return (
              <DataTable.TableRow
                key={sponsor?.id ?? `${sponsor?.name}-${sponsor?.phone}`}
                className="hover:bg-[var(--fillColor)] transition-colors border-b border-[var(--borderColor)]"
              >
                <DataTable.TableCell className="py-3 px-4 text-right font-medium text-[var(--textColor)] truncate">
                  {sponsor?.name}
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4">
                  <div className="flex flex-col gap-1 text-[var(--subTextColor)]">
                    <div className="flex items-center gap-1 text-xs">
                      <Phone size={12} />
                      <span>{sponsor?.phone}</span>
                    </div>
                    {sponsor?.email && (
                      <div className="flex items-center gap-1 text-xs">
                        <Mail size={12} />
                        <span className="truncate max-w-[200px]">
                          {sponsor?.email}
                        </span>
                      </div>
                    )}
                  </div>
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4 text-center">
                  <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium bg-[var(--fillColor)] text-[var(--primeColor)]">
                    {sponsor?.sponsorship_count || 0}
                  </span>
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4 text-[var(--subTextColor)] truncate">
                  {sponsor?.sponsorship_type || "كفالة شهرية"}
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4 text-xs text-[var(--textMuted)] truncate">
                  {sponsor?.join_date || "-"}
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium ${statusClasses}`}
                  >
                    {sponsor?.status || "نشط"}
                  </span>
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(sponsor)}
                      title="تعديل"
                      className="text-[var(--textMuted2)] hover:text-[var(--primeColor)] transition"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirm(sponsor?.id)}>
                      <X size={16} className="text-[#be1010] cursor-pointer" />
                    </button>
                  </div>
                </DataTable.TableCell>
              </DataTable.TableRow>
            );
          }}
        />
      </DataTable.Table>

      <DataTable.ResultsCount
        filteredCount={filteredSponsors.length}
        totalCount={sponsors.length}
        label="كفيل"
      />
    </>
  );
}

// Main export with Root provider
export default function SponsorsTable() {
  return (
    <DataTable.Root>
      <SponsorsTableContent />
    </DataTable.Root>
  );
}

import { useMemo } from "react";
import { SquarePen, X } from "lucide-react";
import { Mail, Phone } from "lucide-react";
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
        sponsor?.email?.toLowerCase().includes(query)
    );
  }, [sponsors, searchQuery]);

  function handleDelete(sponsorId: string) {
    deleteSponsorMutate(sponsorId, {
      onSuccess: () => {
        setDeleteConfirm(null);
      },
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
      {/* Modal rendered when isModalOpen is true */}
      <DataTable.ModalWrapper>
        <SponsorModal
          setIsModel={(value) =>
            setIsModalOpen(typeof value === "function" ? value(false) : value)
          }
          onCompleted={() => {
            console.log("Sponsor saved successfully!");
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      {/* Delete Confirmation Popup */}
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

      <DataTable.Table>
        <DataTable.TableHead>
          <tr>
            <DataTable.TableHeaderCell>الاسم</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>
              معلومات الاتصال
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>عدد الكفالات</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>نوع الكفالة</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>
              تاريخ الانضمام
            </DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الحالة</DataTable.TableHeaderCell>
            <DataTable.TableHeaderCell>الإجراءات</DataTable.TableHeaderCell>
          </tr>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={filteredSponsors}
          emptyMessage="لا توجد بيانات"
          renderRow={(sponsor: any) => {
            const statusClasses =
              sponsor?.status === "نشط"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 border border-gray-300";

            return (
              <DataTable.TableRow
                key={sponsor?.id ?? `${sponsor?.name}-${sponsor?.phone}`}
              >
                <DataTable.TableCell className="text-right font-medium text-gray-900">
                  {sponsor?.name}
                </DataTable.TableCell>

                <DataTable.TableCell>
                  <div className="flex flex-col gap-1 text-gray-700">
                    <div className="flex items-center gap-1 text-xs">
                      <span>{<Phone size={12} />}</span>
                      <span>{sponsor?.phone}</span>
                    </div>
                    {sponsor?.email && (
                      <div className="flex items-center gap-1 text-xs">
                        <span>{<Mail size={12} />}</span>
                        <span className="truncate max-w-[200px]">
                          {sponsor?.email}
                        </span>
                      </div>
                    )}
                  </div>
                </DataTable.TableCell>

                <DataTable.TableCell className="text-center text-gray-700">
                  <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {sponsor?.sponsorship_count || 0}
                  </span>
                </DataTable.TableCell>

                <DataTable.TableCell className="text-gray-700">
                  {sponsor?.sponsorship_type || "كفالة شهرية"}
                </DataTable.TableCell>

                <DataTable.TableCell className="text-gray-700 text-xs">
                  {sponsor?.join_date || "-"}
                </DataTable.TableCell>

                <DataTable.TableCell>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium ${statusClasses}`}
                  >
                    {sponsor?.status || "نشط"}
                  </span>
                </DataTable.TableCell>

                <DataTable.TableCell>
                  <div className="flex items-center justify-start gap-3">
                    <button
                      onClick={() => handleEdit(sponsor)}
                      title="تعديل"
                      className="text-gray-500 hover:text-emerald-600 transition"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button onClick={() => setDeleteConfirm(sponsor?.id)}>
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

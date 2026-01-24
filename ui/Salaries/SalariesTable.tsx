import { useMemo } from "react";
import { SquarePen, Plus } from "lucide-react";
import { DataTable } from "../../components/CompoundTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetSalaries } from "../../utils/ReactQuerry/Salaries/useGetSalaries";
import SalaryModal from "./SalariesModal";

function SalariesTableContent() {
  const { data: salaries, isLoading, isError } = useGetSalaries();
  const { searchQuery, setIsModalOpen, editItem, setEditItem } =
    DataTable.useContext();

  // Filter logic based on View column names
  const filteredSalaries = useMemo(() => {
    const data = salaries || [];
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(
      (s: any) =>
        s?.sponsor_name?.toLowerCase().includes(query) ||
        s?.orphan_name?.toLowerCase().includes(query),
    );
  }, [salaries, searchQuery]);

  // Open modal for either 'Plus' or 'Edit' - both pass data to the modal
  function handleAction(salary: any) {
    setEditItem(salary);
    setIsModalOpen(true);
  }

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <DataTable.Error />;

  return (
    <>
      {/* Modal Wrapper using the shared Context */}
      <DataTable.ModalWrapper>
        <SalaryModal
          setIsModel={(value) => setIsModalOpen(false)}
          onSuccess={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          editData={editItem}
        />
      </DataTable.ModalWrapper>

      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث باسم الكفيل أو اليتيم..." />
      </DataTable.Header>

      <div className="rounded-2xl border overflow-hidden shadow-sm border-[var(--borderColor)] bg-[var(--backgroundColor)] mt-4">
        <DataTable.Table className="table-fixed w-full">
          <DataTable.TableHead>
            <tr className="border-b border-[var(--borderColor)] bg-[var(--fillColor)]">
              <DataTable.TableHeaderCell className="w-1/6">
                الكفيل
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="w-1/6">
                اليتيم
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="w-1/6">
                المبلغ
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="w-1/6">
                تاريخ الدفع
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="w-1/6 text-center">
                الحالة
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="w-1/6 text-center">
                الإجراءات
              </DataTable.TableHeaderCell>
            </tr>
          </DataTable.TableHead>

          <DataTable.TableBody
            data={filteredSalaries}
            emptyMessage="لا توجد بيانات تطابق البحث"
            renderRow={(salary: any) => (
              <DataTable.TableRow key={salary.payment_id}>
                <DataTable.TableCell className="truncate text-[var(--textColor)]/80">
                  {salary?.sponsor_name}
                </DataTable.TableCell>
                <DataTable.TableCell className="truncate text-[var(--textColor)]/80">
                  {salary?.orphan_name}
                </DataTable.TableCell>
                <DataTable.TableCell>
                  <span className="inline-block px-3 py-1 rounded-full border text-xs border-[var(--primeColor)] text-[var(--textColor)]/70 bg-[var(--backgroundColor)]">
                    {salary?.amount || "0.00"} د.ع
                  </span>
                </DataTable.TableCell>
                <DataTable.TableCell className="tabular-nums text-[var(--textMuted2)]">
                  {salary?.payment_date ?? "—"}
                </DataTable.TableCell>
                <DataTable.TableCell>
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-medium min-w-[80px] ${
                        salary?.status === "مدفوع"
                          ? "bg-[var(--primeColor)] text-white"
                          : salary?.status === "قيد الانتظار"
                            ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
                            : "bg-red-100 text-red-600 border border-red-200"
                      }`}
                    >
                      {salary?.status}
                    </span>
                  </div>
                </DataTable.TableCell>

                <DataTable.TableCell>
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handleAction(salary)}
                      className="text-[var(--primeColor)] hover:scale-110 transition-transform"
                      title="معالجة الدفع"
                    >
                      <Plus size={18} />
                    </button>

                    <button
                      onClick={() => handleAction(salary)}
                      className="text-[var(--textMuted2)] hover:text-[var(--primeColor)] transition-colors"
                      title="تعديل"
                    >
                      <SquarePen size={18} />
                    </button>
                  </div>
                </DataTable.TableCell>
              </DataTable.TableRow>
            )}
          />
        </DataTable.Table>
      </div>

      <DataTable.ResultsCount
        filteredCount={filteredSalaries.length}
        totalCount={salaries?.length || 0}
        label="سجل"
      />
    </>
  );
}

export default function SalariesTable() {
  return (
    <DataTable.Root>
      <SalariesTableContent />
    </DataTable.Root>
  );
}

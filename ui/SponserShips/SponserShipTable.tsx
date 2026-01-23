import { useState, useEffect, useMemo } from "react";
import { DataTable } from "../../components/CompoundTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetSponsorships } from "../../utils/ReactQuerry/Sponsorships/useGetSponsorships";
import { useUpdateSponsorships } from "../../utils/ReactQuerry/Sponsorships/useUpdateSponsorships";

function SponsorshipsTableContent() {
  // 1. Fetch data and mutations
  const { data: sponsorships, isLoading, isError } = useGetSponsorships();
  const { updateNote } = useUpdateSponsorships();

  // 2. Get search query from DataTable Context
  const { searchQuery } = DataTable.useContext();

  // 3. State for handling notes
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Initialize notes from fetched data
  useEffect(() => {
    if (sponsorships) {
      const initialNotes: Record<string, string> = {};
      sponsorships.forEach((s: any) => {
        initialNotes[s.sponsorship_id] = s.note || "";
      });
      setNotes(initialNotes);
    }
  }, [sponsorships]);

  // 4. Search logic: Filters ONLY by Orphan Name or Sponsor Name
  const filteredSponsorships = useMemo(() => {
    const data = sponsorships || [];
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(
      (s: any) =>
        s?.sponsor_name?.toLowerCase().includes(query) ||
        s?.orphan_name?.toLowerCase().includes(query),
    );
  }, [sponsorships, searchQuery]);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">خطأ في جلب البيانات</div>
    );

  return (
    <>
      {/* Search Header */}
      <DataTable.Header>
        <DataTable.SearchInput placeholder="البحث باسم الكفيل أو اليتيم..." />
      </DataTable.Header>

      <div className="rounded-2xl border overflow-hidden shadow-sm border-[var(--borderColor)] bg-[var(--backgroundColor)] mt-4">
        <DataTable.Table className="table-fixed w-full">
          <DataTable.TableHead>
            <tr className="border-b border-[var(--borderColor)] bg-[var(--fillColor)]">
              <DataTable.TableHeaderCell className="font-medium py-3 px-4 text-right text-[var(--textMuted2)] w-1/6">
                الكفيل
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="font-medium py-3 px-4 text-right text-[var(--textMuted2)] w-1/6">
                اليتيم
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="font-medium py-3 px-4 text-right text-[var(--textMuted2)] w-1/6">
                نوع الكفالة
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="font-medium py-3 px-4 text-right text-[var(--textMuted2)] w-1/6">
                تاريخ البداية
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="font-medium py-3 px-4 text-center text-[var(--textMuted2)] w-1/6">
                الحالة
              </DataTable.TableHeaderCell>
              <DataTable.TableHeaderCell className="font-medium py-3 px-4 text-center text-[var(--textMuted2)] w-1/6">
                الملاحظات
              </DataTable.TableHeaderCell>
            </tr>
          </DataTable.TableHead>

          <DataTable.TableBody
            data={filteredSponsorships}
            emptyMessage="لا توجد بيانات تطابق البحث"
            renderRow={(sponsorship: any) => (
              <DataTable.TableRow
                key={sponsorship.sponsorship_id}
                className="border-b last:border-0 hover:bg-[var(--fillColor)] transition-colors border-[var(--borderColor)]"
              >
                <DataTable.TableCell className="text-right py-3 px-4 text-[var(--textColor)]/80 truncate">
                  {sponsorship?.sponsor_name}
                </DataTable.TableCell>

                <DataTable.TableCell className="text-right font-medium py-3 px-4 text-[var(--textColor)]/80 truncate">
                  {sponsorship?.orphan_name}
                </DataTable.TableCell>

                <DataTable.TableCell className="text-right py-3 px-4">
                  <span className="inline-block px-3 py-1 rounded-full border text-xs border-[var(--primeColor)] text-[var(--primeColor)] bg-[var(--backgroundColor)]">
                    {sponsorship?.sponsorship_type}
                  </span>
                </DataTable.TableCell>

                <DataTable.TableCell className="text-right py-3 px-4 tabular-nums truncate text-[var(--textMuted)]">
                  {sponsorship?.start_date}
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4">
                  <div className="flex justify-center items-center w-full">
                    <span
                      className={`inline-flex items-center justify-center px-6 py-1 rounded-full text-xs font-medium min-w-[80px] truncate ${
                        sponsorship?.status === "نشط"
                          ? "bg-[var(--primeColor)] text-white"
                          : "bg-red-100 text-red-600 border border-red-200"
                      }`}
                    >
                      {sponsorship?.status}
                    </span>
                  </div>
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4">
                  <textarea
                    className="w-full resize-none border border-[var(--borderColor)] rounded px-2 py-1 text-[var(--textColor)] 
                    focus:ring-2 focus:ring-[var(--primeColor)] focus:outline-none 
                    selection:bg-[var(--primeColor)] selection:text-white"
                    value={notes[sponsorship.sponsorship_id] || ""}
                    placeholder="اضافة ملاحظة..."
                    maxLength={90}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [sponsorship.sponsorship_id]: e.target.value,
                      }))
                    }
                    onBlur={() =>
                      updateNote({
                        id: sponsorship.sponsorship_id,
                        note: notes[sponsorship.sponsorship_id],
                      })
                    }
                  />
                </DataTable.TableCell>
              </DataTable.TableRow>
            )}
          />
        </DataTable.Table>
      </div>

      {/* Footer count summary */}
      <DataTable.ResultsCount
        filteredCount={filteredSponsorships.length}
        totalCount={sponsorships?.length || 0}
        label="كفالة"
      />
    </>
  );
}

// 5. Main Component Wrapper
export default function SponsorshipsTable() {
  return (
    <DataTable.Root>
      <SponsorshipsTableContent />
    </DataTable.Root>
  );
}

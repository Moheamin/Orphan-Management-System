import { useState, useEffect } from "react";
import { DataTable } from "../../components/CompoundTable";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetSponsorships } from "../../utils/ReactQuerry/Sponsorships/useGetSponsorships";
import { useUpdateSponsorships } from "../../utils/ReactQuerry/Sponsorships/useUpdateSponsorships";
import debounce from "lodash.debounce";

export default function SponsorshipsTable() {
  // Fetch all sponsorships
  const { data: sponsorships, isLoading, isError } = useGetSponsorships();

  // Mutation for updating notes
  const { updateNote, isUpdating: isMutating } = useUpdateSponsorships();

  // State to hold notes by row ID
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Initialize notes after data is fetched
  useEffect(() => {
    if (sponsorships) {
      const initialNotes: Record<string, string> = {};
      sponsorships.forEach((s) => {
        initialNotes[s.id] = s.note || "";
      });
      setNotes(initialNotes);
    }
  }, [sponsorships]);

  // Debounced save (avoid spamming DB on every keypress)
  const debouncedSave = debounce((id: number, note: string) => {
    updateNote({ id, note });
  }, 800);

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">خطأ في جلب البيانات</div>
    );

  return (
    <DataTable.Root>
      <div className="rounded-2xl border overflow-hidden shadow-sm border-[var(--borderColor)] bg-[var(--backgroundColor)]">
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
            data={sponsorships || []}
            emptyMessage="لا توجد بيانات"
            renderRow={(sponsorship: any) => (
              <DataTable.TableRow
                key={sponsorship.id}
                className="border-b last:border-0 hover:bg-[var(--fillColor)] transition-colors border-[var(--borderColor)]"
              >
                <DataTable.TableCell className="text-right py-3 px-4 text-[var(--textColor)] truncate">
                  {sponsorship?.sponsor?.name}
                </DataTable.TableCell>

                <DataTable.TableCell className="text-right font-medium py-3 px-4 text-[var(--subTextColor)] truncate">
                  {sponsorship?.orphan?.name}
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
                    <span className="inline-flex items-center justify-center px-6 py-1 rounded-full text-xs font-medium min-w-[80px] bg-[var(--primeColor)] text-white truncate">
                      {sponsorship?.status || "نشط"}
                    </span>
                  </div>
                </DataTable.TableCell>

                <DataTable.TableCell className="py-3 px-4">
                  <textarea
                    className=" w-full resize-none border border-[var(--borderColor)] rounded px-2 py-1 text-[var(--textColor)]
    focus:ring-2 focus:ring-[var(--primeColor)] focus:outline-none
    selection:bg-[var(--primeColor)] selection:text-white"
                    value={notes[sponsorship.id] || ""}
                    placeholder="اضافة ملاحظة..."
                    maxLength={90}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [sponsorship.id]: e.target.value,
                      }))
                    }
                    onBlur={() =>
                      updateNote({
                        id: sponsorship.id,
                        note: notes[sponsorship.id],
                      })
                    }
                  />
                </DataTable.TableCell>
              </DataTable.TableRow>
            )}
          />
        </DataTable.Table>
      </div>
    </DataTable.Root>
  );
}

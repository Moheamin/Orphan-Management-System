import { Eye } from "lucide-react";
import { DataTable } from "../../components/CompoundTable";
import { useGetSponsorships } from "../../utils/ReactQuerry/Sponsorships/useGetSponsorships";

function SponsorshipsTableContent() {
  const { data: sponsorships, isLoading, isError } = useGetSponsorships();

  if (isLoading)
    return (
      <div className="p-8 text-center text-emerald-600">
        جاري تحميل البيانات...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">خطأ في جلب البيانات</div>
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <DataTable.Table>
        <DataTable.TableHead>
          {/* Matches the light mint/gray header background in the image */}
          <tr className="border-b border-gray-50 bg-[#F9FAFB]">
            {/* 1. Sponsor - Right Aligned */}
            <DataTable.TableHeaderCell className="text-gray-400 font-medium py-4 text-right pr-6">
              الكفيل
            </DataTable.TableHeaderCell>

            {/* 2. Orphan - Right Aligned */}
            <DataTable.TableHeaderCell className="text-gray-400 font-medium py-4 text-right">
              اليتيم
            </DataTable.TableHeaderCell>

            {/* 3. Type - Right Aligned (Matches the 'pill' content below) */}
            <DataTable.TableHeaderCell className="text-gray-400 font-medium py-4 text-right">
              نوع الكفالة
            </DataTable.TableHeaderCell>

            {/* 4. Start Date - Right Aligned */}
            <DataTable.TableHeaderCell className="text-gray-400 font-medium py-4 text-right">
              تاريخ البداية
            </DataTable.TableHeaderCell>

            {/* 5. Status - Centered */}
            <DataTable.TableHeaderCell className="text-gray-400 font-medium py-4 text-center">
              الحالة
            </DataTable.TableHeaderCell>

            {/* 6. Actions - Centered */}
            <DataTable.TableHeaderCell className="text-gray-400 font-medium py-4 text-center pl-6">
              الإجراءات
            </DataTable.TableHeaderCell>
          </tr>
        </DataTable.TableHead>

        <DataTable.TableBody
          data={sponsorships || []}
          emptyMessage="لا توجد بيانات"
          renderRow={(sponsorship: any) => (
            <DataTable.TableRow
              key={sponsorship.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              {/* ... previous columns (Sponsor, Orphan, Type, Date) stay text-right ... */}
              <DataTable.TableCell className="text-right text-gray-700 py-5 pr-8">
                {sponsorship?.sponsor?.name}
              </DataTable.TableCell>
              <DataTable.TableCell className="text-right text-gray-700 font-medium">
                {sponsorship?.orphan?.name}
              </DataTable.TableCell>
              <DataTable.TableCell className="text-right">
                <span className="inline-block px-3 py-1 rounded-full border border-emerald-200 text-emerald-700 bg-white text-xs">
                  {sponsorship?.sponsorship_type}
                </span>
              </DataTable.TableCell>
              <DataTable.TableCell className="text-right text-gray-500 tabular-nums">
                {sponsorship?.start_date}
              </DataTable.TableCell>

              {/* 5. FIX FOR STATUS (الحالة) */}
              <DataTable.TableCell>
                <div className="flex justify-center items-center w-full">
                  <span className="inline-flex items-center justify-center px-6 py-1 rounded-full text-xs font-medium bg-[#007F5F] text-white min-w-[80px]">
                    {sponsorship?.status || "نشط"}
                  </span>
                </div>
              </DataTable.TableCell>

              {/* 6. FIX FOR ACTIONS (الإجراءات) */}
              <DataTable.TableCell className="pl-8">
                <div className="flex justify-center items-center w-full">
                  <button className="p-2 text-gray-400 hover:text-emerald-600 transition-all flex items-center justify-center">
                    <Eye size={20} />
                  </button>
                </div>
              </DataTable.TableCell>
            </DataTable.TableRow>
          )}
        />
      </DataTable.Table>
    </div>
  );
}

export default function SponserShipTabe() {
  return (
    <DataTable.Root>
      <div className="p-6 bg-[#F3F4F6] min-h-screen">
        <SponsorshipsTableContent />
      </div>
    </DataTable.Root>
  );
}

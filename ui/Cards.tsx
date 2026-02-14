import { Handshake, Users } from "lucide-react";
import Card from "../components/Card";
import { useSponsorStats } from "../utils/ReactQuerry/Sponsers/utils";

export default function Cards() {
  const { data, isLoading, error } = useSponsorStats();

  if (error) {
    return (
      <p className="text-red-500 text-center">
        Failed to load sponsor statistics
      </p>
    );
  }

  return (
    /* Change: grid-cols-1 (mobile) 
       Change: sm:grid-cols-2 (tablet and up)
       Change: Added responsive padding (px-4) and centered the list
    */
    <ul className="mt-8 md:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10 px-4 md:mr-4">
      {/* Total Sponsors */}
      <Card>
        <div className="p-4 flex items-center justify-between w-full">
          {/* Icon Container */}
          <div className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)] shrink-0">
            <Users size={28} />
          </div>

          <div className="flex flex-col items-end text-right gap-1">
            <h2 className="text-[var(--textMuted2)] text-xs sm:text-sm font-medium">
              اجمالي الكفلاء
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-[var(--cellTextColor)]">
              {isLoading ? "..." : (data?.totalSponsors ?? 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* Total Sponsorships */}
      <Card>
        <div className="p-4 flex items-center justify-between w-full">
          {/* Icon Container */}
          <div className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)] shrink-0">
            <Handshake size={28} />
          </div>

          <div className="flex flex-col items-end text-right gap-1">
            <h2 className="text-[var(--textMuted2)] text-xs sm:text-sm font-medium">
              اجمالي الكفالات
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-[var(--cellTextColor)]">
              {isLoading ? "..." : (data?.totalSponsorships ?? 0)}
            </p>
          </div>
        </div>
      </Card>
    </ul>
  );
}

import { Users, Handshake } from "lucide-react"; //
import Card from "../components/Card";
import { useSponsorStats } from "../utils/ReactQuerry/Sponsers/utils";
import { useUpdateSponsors } from "../utils/ReactQuerry/Sponsers/useUpdateSponsors";
import LoadingSpinner from "../components/LoadingSpinner";

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
    <ul className="mt-16 grid grid-cols-2 gap-10 mr-4">
      {/* Total Sponsors */}
      <Card>
        <div className="p-2 flex items-center justify-between w-full">
          {/* Icon Container */}
          <div className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)]">
            <Users size={28} />
          </div>

          <div className="flex flex-col items-end text-right gap-1">
            <h2 className="text-[var(--textMuted2)]  text-sm font-medium">
              اجمالي الكفلاء
            </h2>
            <p className="text-2xl font-bold text-[var(--cellTextColor)]">
              {isLoading ? "..." : (data?.totalSponsors ?? 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* Total Sponsorships */}
      <Card>
        <div className="p-2 flex items-center justify-between w-full">
          {/* Icon Container */}
          <div className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)]">
            <Handshake size={28} />
          </div>

          <div className="flex flex-col items-end text-right gap-1">
            <h2 className="text-[var(--textMuted2)] text-sm font-medium">
              اجمالي الكفالات
            </h2>
            <p className="text-2xl font-bold text-[var(--cellTextColor)]  ">
              {isLoading ? "..." : (data?.totalSponsorships ?? 0)}
            </p>
          </div>
        </div>
      </Card>
    </ul>
  );
}

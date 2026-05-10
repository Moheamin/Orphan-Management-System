import React, { useState, useEffect } from "react";
import { Users as UsersIcon, CreditCard, Heart, Baby } from "lucide-react";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetOrphans } from "../utils/ReactQuerry/Orphans/useGetOrphans";
import { useSponsorStats } from "../utils/ReactQuerry/Sponsers/utils";
import { useGetSponsors } from "../utils/ReactQuerry/Sponsers/useGetSponsors";
import { useGetSponsorships } from "../utils/ReactQuerry/Sponsorships/useGetSponsorships";
import { useGetSponsorPayments } from "../utils/ReactQuerry/SponsorPayments/useGetSponsorPayments";
import { useGetUsers } from "../utils/ReactQuerry/Users/useGetUsers";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Overview() {
  const [chartHeight, setChartHeight] = useState(260);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartHeight(220);
      } else {
        setChartHeight(280);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: orphansData, isLoading: orphansLoading } = useGetOrphans();
  const { data: sponsorStats, isLoading: sponsorsLoading } = useSponsorStats();
  const { data: sponsorsData, isLoading: sponsorsListLoading } =
    useGetSponsors();
  const { data: sponsorships, isLoading: sponsorshipsLoading } =
    useGetSponsorships();
  const { data: payments, isLoading: paymentsLoading } =
    useGetSponsorPayments();
  const { isLoading: usersLoading } = useGetUsers();

  const totalOrphans = orphansData?.orphan?.length ?? 0;
  const totalSponsors = sponsorStats?.totalSponsors ?? 0;
  const totalSponsorships = sponsorStats?.totalSponsorships ?? 0;
  const totalPayments =
    payments?.reduce((sum: any, p: any) => sum + (p.paid_amount ?? 0), 0) ?? 0;

  function countCreatedThisMonth(items: any[]) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    return items.filter((item) => {
      if (!item.created_at) return false;
      const d = new Date(item.created_at);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
  }

  const newOrphansThisMonth = countCreatedThisMonth(orphansData?.orphan || []);
  const newSponsorsThisMonth = sponsorsData?.sponsor
    ? countCreatedThisMonth(sponsorsData.sponsor)
    : 0;
  const newSponsorshipsThisMonth = countCreatedThisMonth(sponsorships || []);

  const urgentCases = (orphansData?.orphan || []).filter(
    (o: any) => o.priority >= 80,
  );
  const mediumCases = (orphansData?.orphan || []).filter(
    (o: any) => o.priority >= 60 && o.priority < 80,
  );

  const getPriorityBadge = (priority: number) => {
    const baseClasses =
      "px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap";
    if (priority >= 80) {
      return (
        <span
          className={`${baseClasses} bg-[var(--errorColor)]/10 text-[var(--errorColor)]`}
        >
          عالية
        </span>
      );
    } else if (priority >= 60) {
      return (
        <span
          className={`${baseClasses} bg-[var(--warningColor)]/10 text-[var(--warningColor)]`}
        >
          متوسطة
        </span>
      );
    }
    return (
      <span
        className={`${baseClasses} bg-[var(--successColor)]/10 text-[var(--successColor)]`}
      >
        منخفضة
      </span>
    );
  };

  const sponsorshipTypes = React.useMemo(() => {
    if (!sponsorships || !Array.isArray(sponsorships)) return [];
    const typeMap: Record<string, number> = {};
    sponsorships.forEach((s: any) => {
      const type = s.sponsorship_type || "غير محدد";
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    return Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  }, [sponsorships]);

  const barData = React.useMemo(() => {
    if (!orphansData?.orphan || !Array.isArray(orphansData.orphan)) return [];
    const now = new Date();
    const monthsArr: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const label = d.toLocaleString("ar-EG", { month: "long" });
      monthsArr.push({ key, label });
    }
    const orphanCounts: Record<string, number> = {};
    orphansData.orphan.forEach((o: any) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      orphanCounts[key] = (orphanCounts[key] || 0) + 1;
    });
    let sponsorCounts: Record<string, number> = {};
    if (Array.isArray(sponsorsData?.sponsor)) {
      sponsorsData.sponsor.forEach((s: any) => {
        if (!s.created_at) return;
        const d = new Date(s.created_at);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        sponsorCounts[key] = (sponsorCounts[key] || 0) + 1;
      });
    }
    return monthsArr.map(({ key, label }) => ({
      month: label,
      الكفلاء: sponsorCounts[key] || 0,
      الأيتام: orphanCounts[key] || 0,
    }));
  }, [orphansData, sponsorsData]);

  const COLORS = ["#3b7e5c", "#6fcf97", "#b2f2bb"];

  const renderCustomLabel = ({
    name,
    value,
    cx,
    cy,
    midAngle,
    outerRadius,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 80;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#3b7e5c"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
        fontSize="14"
      >
        {`${name}: ${value}`}
      </text>
    );
  };

  const loading =
    orphansLoading ||
    sponsorsLoading ||
    sponsorsListLoading ||
    sponsorshipsLoading ||
    paymentsLoading ||
    usersLoading;

  return (
    <div
      className="flex flex-col gap-6 px-4 md:px-8 py-6 bg-[var(--backgroundColor)] min-h-screen"
      dir="rtl"
    >
      {loading ? (
        <LoadingSpinner size="md" />
      ) : (
        <>
          {/* Stats Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto">
            {[
              {
                icon: <CreditCard size={28} />,
                label: "دفعات الكفلاء",
                val: `${totalPayments.toLocaleString()} د.ع`,
                sub: "إجمالي هذا الشهر",
              },
              {
                icon: <Heart size={28} />,
                label: "الكفالات الفعالة",
                val: totalSponsorships,
                sub: `+${newSponsorshipsThisMonth} هذا الشهر`,
              },
              {
                icon: <UsersIcon size={28} />,
                label: "الكفلاء النشطون",
                val: totalSponsors,
                sub: `+${newSponsorsThisMonth} هذا الشهر`,
              },
              {
                icon: <Baby size={28} />,
                label: "إجمالي الأيتام",
                val: totalOrphans,
                sub: `+${newOrphansThisMonth} هذا الشهر`,
              },
            ].map((item, i) => (
              <Card key={i}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start text-right gap-1">
                    <span className="text-xs text-[var(--textMuted2)]">
                      {item.label}
                    </span>
                    <span className="text-xl font-bold text-[var(--cellTextColor)]">
                      {item.val}
                    </span>
                    <span className="text-xs text-[var(--textMuted2)]">
                      {item.sub}
                    </span>
                  </div>
                  <span className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)]">
                    {item.icon}
                  </span>
                </div>
              </Card>
            ))}
          </ul>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-6xl mx-auto">
            {/* Pie Chart Card */}
            <div className="bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] p-5">
              <h2 className="text-sm font-bold mb-3 text-[var(--primeColor)] text-right">
                توزيع الكفالات
              </h2>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart>
                  <Pie
                    data={sponsorshipTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={renderCustomLabel}
                  >
                    {sponsorshipTypes.map((_entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4">
                {sponsorshipTypes.length === 0 ? (
                  <div className="text-center text-sm text-[var(--textMuted)] py-4">
                    لا توجد كفالات حالياً.
                  </div>
                ) : (
                  <table className="w-full text-xs text-right border-t mt-2">
                    <thead>
                      <tr className="text-[var(--primeColor)] border-b">
                        <th className="py-1">نوع الكفالة</th>
                        <th className="py-1">العدد</th>
                        <th className="py-1">النسبة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sponsorshipTypes.map((row, idx) => (
                        <tr
                          key={row.name}
                          className={
                            idx % 2 === 0 ? "bg-[var(--fillColor)]" : ""
                          }
                        >
                          <td className="py-1 font-bold">{row.name}</td>
                          <td className="py-1">{row.value}</td>
                          <td className="py-1">
                            {Math.round(
                              (row.value / (sponsorships?.length || 1)) * 100,
                            )}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Bar Chart Card */}
            <div className="bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] p-5">
              <h2 className="text-sm font-bold mb-3 text-[var(--primeColor)] text-right">
                الإحصائيات الشهرية
              </h2>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar
                    dataKey="الكفلاء"
                    fill="#3b7e5c"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="الأيتام"
                    fill="#6fcf97"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Urgent Cases Section */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] p-5 md:p-6 flex flex-col gap-4">
              {/* Header: Text Right, Icon Left */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-right text-[var(--textColor)]">
                  حالات تحتاج اهتمام عاجل
                </h2>
                <span className="bg-[var(--errorColor)]/10 text-[var(--errorColor)] p-2 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </span>
              </div>

              {/* List Items */}
              {(() => {
                const sortedCases = [...urgentCases, ...mediumCases].sort(
                  (a, b) => b.priority - a.priority,
                );
                if (sortedCases.length === 0)
                  return (
                    <div className="text-center text-sm text-[var(--textMuted)] py-6">
                      لا توجد حالات عاجلة حالياً
                    </div>
                  );

                return sortedCases.map((orphan: any) => (
                  <div
                    key={orphan.id}
                    className="flex items-center justify-between gap-4 bg-[var(--fillColor)] rounded-xl p-4 border border-[var(--borderColor)]/40"
                  >
                    {/* 1. النص في اليمين (بسبب RTL هو العنصر الأول في الكود) */}
                    <div className="flex flex-col items-start text-right gap-0.5 flex-1">
                      <span className="font-bold text-sm text-[var(--textColor)]">
                        {orphan.name}{" "}
                        <span className="text-[var(--textMuted)] text-xs font-normal">
                          ({orphan.age} سنة)
                        </span>
                      </span>
                      <span className="text-xs text-[var(--textMuted)]">
                        {orphan.type ||
                          orphan.description ||
                          orphan.residence ||
                          "—"}
                      </span>
                    </div>

                    {/* 2. الشارة (Badge) في اليسار */}
                    <div className="shrink-0">
                      {getPriorityBadge(orphan.priority)}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Overview;

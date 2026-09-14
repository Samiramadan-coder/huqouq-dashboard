import { Card } from "../ui/card";
import { getTranslations } from "next-intl/server";
import { Clock3, ShieldAlert, TrendingUp, UsersRound } from "lucide-react";

type StatItem = {
  value: number | string;
  key: string;
  icon: React.ElementType;
  cardClassName: string;
  titleClassName: string;
  iconClassName: string;
};

const stats: StatItem[] = [
  {
    value: 10,
    key: "totalClients",
    icon: UsersRound,
    cardClassName: "bg-primary/6",
    titleClassName: "text-primary",
    iconClassName: "text-slate-700",
  },
  {
    value: 7,
    key: "active",
    icon: TrendingUp,
    cardClassName: "bg-green-50",
    titleClassName: "text-green-600",
    iconClassName: "text-green-600",
  },
  {
    value: 1,
    key: "suspended",
    icon: ShieldAlert,
    cardClassName: "bg-red-50",
    titleClassName: "text-red-500",
    iconClassName: "text-red-500",
  },
  {
    value: 1,
    key: "flagged",
    icon: Clock3,
    cardClassName: "bg-amber-50",
    titleClassName: "text-amber-500",
    iconClassName: "text-amber-500",
  },
];

export default async function Stats() {
  const t = await getTranslations("Clients.stats");

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.key}
            className={`ring-0! border border-white/50 flex-row px-4 py-3 ${stat.cardClassName}`}
          >
            <div
              className="
                flex size-10 shrink-0 items-center justify-center
                rounded-xl border border-white/80
                bg-white shadow-sm
              "
            >
              <Icon
                className={`size-4.5 ${stat.iconClassName}`}
                strokeWidth={1.8}
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <span
                className={`text-[22px] font-semibold leading-none ${stat.titleClassName}`}
              >
                {stat.value}
              </span>

              <span className="mt-1.5 text-[11px] font-normal text-gray-500">
                {t(stat.key)}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

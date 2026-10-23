import { Counts } from "@/types/clients";
import { getTranslations } from "next-intl/server";
import StatsCards from "../people-directory/stats-cards";
import { Clock3, ShieldAlert, TrendingUp, UsersRound } from "lucide-react";

export default async function Stats({ counts }: { counts: Counts }) {
  const t = await getTranslations("Clients.stats");

  return (
    <StatsCards
      stats={[
        {
          key: "totalClients",
          label: t("totalClients"),
          value: counts.total,
          icon: UsersRound,
          cardClassName: "bg-primary/6",
          titleClassName: "text-primary",
          iconClassName: "text-slate-700",
        },
        {
          key: "active",
          label: t("active"),
          value: counts.active,
          icon: TrendingUp,
          cardClassName: "bg-green-50",
          titleClassName: "text-green-600",
          iconClassName: "text-green-600",
        },
        {
          key: "suspended",
          label: t("suspended"),
          value: counts.suspended,
          icon: ShieldAlert,
          cardClassName: "bg-red-50",
          titleClassName: "text-red-500",
          iconClassName: "text-red-500",
        },
        {
          key: "flagged",
          label: t("flagged"),
          value: counts.flagged,
          icon: Clock3,
          cardClassName: "bg-amber-50",
          titleClassName: "text-amber-500",
          iconClassName: "text-amber-500",
        },
      ]}
    />
  );
}

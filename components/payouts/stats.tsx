import { getTranslations } from "next-intl/server";
import { CircleCheck, Download, UsersRound, Wallet } from "lucide-react";
import type { Summary } from "@/types/payouts";

export default async function Stats({ stats }: { stats: Summary }) {
  const t = await getTranslations("Payouts.stats");

  const items = [
    {
      key: "totalPending",
      value: stats.total_pending,
      currency: true,
      icon: Wallet,
      iconClassName: "bg-orange-500",
      valueClassName: "text-orange-600",
    },
    {
      key: "readyForPayout",
      value: stats.ready_for_payout,
      currency: true,
      icon: Download,
      iconClassName: "bg-secondary",
      valueClassName: "text-[#8a6d1f]",
    },
    {
      key: "paidThisMonth",
      value: stats.paid_this_month,
      currency: true,
      icon: CircleCheck,
      iconClassName: "bg-green-500",
      valueClassName: "text-green-700",
    },
    {
      key: "lawyersWithBalance",
      value: stats.lawyers_with_balance,
      currency: false,
      icon: UsersRound,
      iconClassName: "bg-primary",
      valueClassName: "text-primary",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-white ${item.iconClassName}`}
            >
              <Icon className="size-4.5" strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-500">
                {t(item.key)}
              </p>
              <p
                className={`text-[20px] font-bold leading-tight ${item.valueClassName}`}
              >
                {item.currency
                  ? t("amount", { value: item.value.toLocaleString("en-US") })
                  : item.value.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

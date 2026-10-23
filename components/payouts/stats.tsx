import { cn } from "@/lib/utils";
import { formatMoney } from "./format";
import type { Summary } from "@/types/payouts";
import { getFormatter, getTranslations } from "next-intl/server";
import { CircleCheck, Download, UsersRound, Wallet } from "lucide-react";

// Totals are displayed exactly as the API computes them; nothing is summed here.
export default async function Stats({ stats }: { stats: Summary }) {
  const t = await getTranslations("Payouts.stats");
  const format = await getFormatter();
  const money = (value: number) => formatMoney(format, value, stats.currency);

  const items = [
    {
      key: "totalPending",
      value: money(stats.total_pending),
      icon: Wallet,
      iconClassName: "bg-orange-500",
      valueClassName: "text-orange-600",
    },
    {
      key: "readyForPayout",
      value: money(stats.ready_for_payout),
      icon: Download,
      iconClassName: "bg-secondary",
      valueClassName: "text-[#8a6d1f]",
    },
    {
      key: "paidThisMonth",
      value: money(stats.paid_this_month),
      icon: CircleCheck,
      iconClassName: "bg-green-500",
      valueClassName: "text-green-700",
    },
    {
      key: "lawyersWithBalance",
      value: format.number(stats.lawyers_with_balance),
      icon: UsersRound,
      iconClassName: "bg-primary",
      valueClassName: "text-primary",
    },
  ] as const;

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, value, icon: Icon, iconClassName, valueClassName }) => (
        <div
          key={key}
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4"
        >
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg text-white",
              iconClassName,
            )}
          >
            <Icon aria-hidden className="size-4.5" strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <dt className="text-[11px] font-medium text-gray-500">{t(key)}</dt>
            <dd
              className={cn("text-[20px] font-bold leading-tight", valueClassName)}
            >
              <bdi>{value}</bdi>
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

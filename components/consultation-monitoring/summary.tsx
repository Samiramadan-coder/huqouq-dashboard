import {
  CalendarClock,
  CalendarDays,
  CircleCheck,
  CircleX,
  Flag,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { formatMoney, formatNumber } from "@/lib/format";
import { SummaryType } from "@/types/consultation-monitoring";

const cards = [
  {
    key: "upcoming_today",
    Icon: CalendarClock,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    key: "this_week",
    Icon: CalendarDays,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "completed_30_days",
    Icon: CircleCheck,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "cancelled_30_days",
    Icon: CircleX,
    iconClassName: "bg-gray-100 text-gray-500",
  },
  {
    key: "refunds_this_month",
    Icon: Undo2,
    iconClassName: "bg-amber-50 text-amber-500",
  },
] as const satisfies readonly {
  key: keyof SummaryType;
  Icon: typeof Flag;
  iconClassName: string;
}[];

export default function Summary({ summary }: { summary: SummaryType }) {
  const t = useTranslations("ConsultationMonitoring.Summary");
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4">
      {cards.map(({ key, Icon, iconClassName }) => {
        const value =
          key === "refunds_this_month"
            ? formatMoney(summary[key], "AED", locale)
            : formatNumber(summary[key], locale);

        return (
          <div
            key={key}
            className={cn(
              "rounded-xl border px-4 py-4 flex items-center gap-3 bg-white border-gray-200",
            )}
          >
            <div
              className={cn(
                "size-9 shrink-0 rounded-lg flex items-center justify-center",
                iconClassName,
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className={cn("text-xl font-bold leading-tight truncate")}>
                {value}
              </p>
              <p className="text-xs text-gray-500 truncate">{t(key)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

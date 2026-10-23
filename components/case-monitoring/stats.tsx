import { cn } from "@/lib/utils";
import { Counts } from "@/types/case-monitoring";
import { Activity, Briefcase, Clock, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

const cards = [
  {
    key: "all_active",
    Icon: Briefcase,
    iconClassName: "text-primary/40",
    valueClassName: "text-primary",
  },
  {
    key: "in_progress",
    Icon: Activity,
    iconClassName: "text-emerald-700",
    valueClassName: "text-emerald-700",
  },
  {
    key: "pending_closure",
    Icon: Clock,
    iconClassName: "text-orange-400",
    valueClassName: "text-orange-700",
  },
  {
    key: "needs_attention",
    Icon: TriangleAlert,
    iconClassName: "text-orange-400",
    valueClassName: "text-orange-700",
  },
] as const satisfies readonly {
  key: keyof Counts;
  Icon: typeof Briefcase;
  iconClassName: string;
  valueClassName: string;
}[];

export default function Stats({ counts }: { counts: Counts }) {
  const t = useTranslations("CaseMonitoring");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(({ key, Icon, iconClassName, valueClassName }) => (
        <div
          key={key}
          className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3"
        >
          <Icon className={cn("size-4", iconClassName)} />
          <div>
            <p className="text-[11px] text-gray-400 font-medium">{t(key)}</p>
            <p
              className={cn("text-[22px] font-bold leading-tight", valueClassName)}
            >
              {counts[key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

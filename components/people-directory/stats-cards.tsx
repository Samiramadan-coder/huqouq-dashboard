import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import type { LucideIcon } from "lucide-react";

export type StatCard = {
  key: string;
  label: string;
  value: number;
  icon: LucideIcon;
  cardClassName: string;
  titleClassName: string;
  iconClassName: string;
};

// Row of summary cards shown above the lawyers and clients lists.
export default function StatsCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ key, label, value, icon: Icon, ...classNames }) => (
        <Card
          key={key}
          className={cn(
            "ring-0! border border-white/50 flex-row px-4 py-3",
            classNames.cardClassName,
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white shadow-sm">
            <Icon
              aria-hidden
              className={cn("size-4.5", classNames.iconClassName)}
              strokeWidth={1.8}
            />
          </div>

          <div className="flex min-w-0 flex-col-reverse">
            <span className="mt-1.5 text-[11px] font-normal text-gray-500">
              {label}
            </span>
            <span
              className={cn(
                "text-[22px] font-semibold leading-none",
                classNames.titleClassName,
              )}
            >
              {value}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

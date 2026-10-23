import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type ActivityStat = {
  key: string;
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  color: string;
};

// Grid of activity counters shown in the details sheets.
export default function ActivityGrid({
  title,
  stats,
  children,
}: {
  title: string;
  stats: ActivityStat[];
  children?: ReactNode;
}) {
  return (
    <section className="w-full space-y-3 text-start">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {title}
      </h2>

      <dl className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
        {stats.map(({ key, label, value, icon: Icon, color }) => (
          <Card
            key={key}
            className="gap-0 rounded-2xl border border-gray-100 bg-gray-50 py-0 shadow-none"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                <Icon aria-hidden className={cn("size-3.5", color)} />
              </div>

              <div className="min-w-0 flex flex-col-reverse">
                <dt className="mt-1 text-[11px] leading-4 text-gray-400">
                  {label}
                </dt>
                <dd className="text-lg font-bold leading-5 text-primary">
                  <bdi>{value}</bdi>
                </dd>
              </div>
            </CardContent>
          </Card>
        ))}
      </dl>

      {children}
    </section>
  );
}

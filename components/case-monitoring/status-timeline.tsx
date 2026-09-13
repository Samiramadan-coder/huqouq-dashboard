import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Activity, Check } from "lucide-react";
import { TimeLine } from "@/types/case-monitoring";
import { getTranslations } from "next-intl/server";

type StatusTimelineProps = {
  items: TimeLine[];
};

export async function StatusTimeline({ items }: StatusTimelineProps) {
  const t = await getTranslations("CaseMonitoring");

  return (
    <div className="w-full">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isDone = item.state === "done";
        const isCurrent = item.state === "current";
        const isUpcoming = item.state === "upcoming";

        return (
          <div
            key={`${item.key}-${index}`}
            className="relative flex min-h-20.5 gap-4"
          >
            {/* Timeline */}
            <div className="relative flex w-10 shrink-0 justify-center">
              {!isLast && (
                <div
                  className={cn(
                    "absolute left-1/2 top-10 h-[calc(100%-40px)] w-px -translate-x-1/2",
                    isUpcoming ? "bg-slate-100" : "bg-slate-200",
                  )}
                />
              )}

              <div
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors",
                  isDone && "bg-primary text-white",
                  isCurrent && "bg-secondary text-white",
                  isUpcoming &&
                    "border-2 border-slate-100 bg-white text-gray-200",
                )}
              >
                {isDone && (
                  <div className="flex size-4 items-center justify-center rounded-full border border-white/90">
                    <Check className="size-2.5 stroke-2" />
                  </div>
                )}

                {isCurrent && <Activity className="size-4 stroke-[1.75]" />}

                {isUpcoming && (
                  <div className="size-2 rounded-full bg-gray-100" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-[13px] font-semibold",
                    isDone && "text-primary",
                    isCurrent && "text-secondary",
                    isUpcoming && "text-gray-400",
                  )}
                >
                  {item.label}
                </p>

                {isCurrent && (
                  <Badge
                    variant="outline"
                    className="h-5 rounded-full border-secondary/20 bg-secondary/10 px-2 text-[10px] font-medium text-secondary"
                  >
                    {t("Timeline.current")}
                  </Badge>
                )}
              </div>

              {!isUpcoming && item.at && (
                <p className="mt-1 text-[10px] text-gray-400">
                  {formatDate(item.at)}
                </p>
              )}

              {item.note && !isUpcoming && (
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className="rounded-md border border-gray-100 bg-gray-50 px-2 py-1 text-xs font-normal text-gray-500 shadow-none"
                  >
                    {item.note}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

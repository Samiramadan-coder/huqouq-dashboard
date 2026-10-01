"use client";

import {
  Star,
  CircleCheck,
  ChevronRight,
  TriangleAlert,
  BriefcaseBusiness,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
// import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import type { Activity as ClientActivity } from "@/types/clients";

export default function ActivitySummary({
  activity,
  className,
}: {
  activity: ClientActivity;
  className?: string;
}) {
  const t = useTranslations("Clients.Activity");

  const stats = [
    {
      key: "CasesPosted",
      value: activity.cases_posted,
      icon: BriefcaseBusiness,
      color: "text-[#21466A]",
    },
    {
      key: "CasesHired",
      value: activity.cases_hired,
      icon: ChevronRight,
      color: "text-[#C9A450]",
    },
    {
      key: "CasesRejected",
      value: activity.cases_rejected,
      icon: TriangleAlert,
      color: "text-[#FF4055]",
    },
    {
      key: "DisputedCases",
      value: activity.disputes_involved,
      icon: TriangleAlert,
      color: "text-[#FF4055]",
    },
    {
      key: "RejectionRate",
      value: activity.rejection_rate,
      icon: CircleCheck,
      color: "text-[#FF4055]",
    },
    {
      key: "ReviewsGiven",
      value: activity.reviews_given,
      icon: Star,
      color: "text-[#C9A450]",
    },
  ] as const;

  return (
    <section className={cn("w-full space-y-3 text-start", className)}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {t("Title")}
      </h2>

      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
        {stats.map(({ key, value, icon: Icon, color }) => (
          <Card
            key={key}
            className="gap-0 rounded-2xl border border-gray-100 bg-gray-50 py-0 shadow-none"
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                <Icon className={cn("size-3.5", color)} />
              </div>

              <div className="min-w-0">
                <p className="text-lg font-bold leading-5 text-primary">
                  <bdi>{value}</bdi>
                </p>

                <p className="mt-1 text-[11px] leading-4 text-gray-400">
                  {t(key)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* <Card className="mt-5 gap-0 rounded-2xl border border-gray-100 bg-gray-50 py-0 shadow-none">
        <CardContent className="space-y-2 px-4 py-3">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-gray-600">
              {t("ResponseRate")}
            </span>

            <span className="font-bold text-green-600">
              <bdi>{activity.responseRate}%</bdi>
            </span>
          </div>

          <Progress
            value={activity.responseRate}
            aria-label={t("ResponseRate")}
            className="h-2 bg-gray-200 [&>div]:rounded-full [&>div]:bg-green-600"
          />
        </CardContent>
      </Card> */}
    </section>
  );
}

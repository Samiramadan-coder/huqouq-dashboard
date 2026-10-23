import {
  Star,
  CircleCheck,
  ChevronRight,
  TriangleAlert,
  BriefcaseBusiness,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useFormatter, useTranslations } from "next-intl";
import ActivityGrid from "../people-directory/activity-grid";
import type { Activity as ClientActivity } from "@/types/clients";

export default function ActivitySummary({
  activity,
}: {
  activity: ClientActivity;
}) {
  const t = useTranslations("Clients.Activity");
  const format = useFormatter();

  // rejection_rate is a 0–100 percentage.
  const rejectionRate = Math.min(100, Math.max(0, activity.rejection_rate));
  const formattedRate = format.number(rejectionRate / 100, {
    style: "percent",
    maximumFractionDigits: 1,
  });

  return (
    <ActivityGrid
      title={t("Title")}
      stats={[
        {
          key: "CasesPosted",
          label: t("CasesPosted"),
          value: activity.cases_posted,
          icon: BriefcaseBusiness,
          color: "text-[#21466A]",
        },
        {
          key: "CasesHired",
          label: t("CasesHired"),
          value: activity.cases_hired,
          icon: ChevronRight,
          color: "text-[#C9A450]",
        },
        {
          key: "CasesRejected",
          label: t("CasesRejected"),
          value: activity.cases_rejected,
          icon: TriangleAlert,
          color: "text-[#FF4055]",
        },
        {
          key: "DisputedCases",
          label: t("DisputedCases"),
          value: activity.disputes_involved,
          icon: TriangleAlert,
          color: "text-[#FF4055]",
        },
        {
          key: "ConsultationsBooked",
          label: t("ConsultationsBooked"),
          value: activity.consultations_booked,
          icon: ChevronRight,
          color: "text-[#21466A]",
        },
        {
          key: "ConsultationsCompleted",
          label: t("ConsultationsCompleted"),
          value: activity.consultations_completed,
          icon: CircleCheck,
          color: "text-[#C9A450]",
        },
        {
          key: "RejectionRate",
          label: t("RejectionRate"),
          value: formattedRate,
          icon: CircleCheck,
          color: "text-[#FF4055]",
        },
        {
          key: "ReviewsGiven",
          label: t("ReviewsGiven"),
          value: activity.reviews_given,
          icon: Star,
          color: "text-[#C9A450]",
        },
      ]}
    >
      <div className="mt-5 space-y-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-gray-600">
            {t("RejectionRate")}
          </span>

          <span className="font-bold text-red-600">
            <bdi>{formattedRate}</bdi>
          </span>
        </div>

        <Progress
          value={rejectionRate}
          aria-label={t("RejectionRate")}
          aria-valuetext={formattedRate}
          className="h-2 bg-gray-200 [&>div]:rounded-full [&>div]:bg-red-500"
        />
      </div>
    </ActivityGrid>
  );
}

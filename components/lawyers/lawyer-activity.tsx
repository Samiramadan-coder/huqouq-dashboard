import {
  Star,
  Clock3,
  CircleCheck,
  ChevronRight,
  TriangleAlert,
  BriefcaseBusiness,
} from "lucide-react";

import { useFormatter, useTranslations } from "next-intl";
import ActivityGrid from "../people-directory/activity-grid";
import type { Activity as LawyerActivity } from "@/types/lawyers";

export default function ActivitySummary({
  activity,
}: {
  activity: LawyerActivity;
}) {
  const t = useTranslations("Lawyers.Activity");
  const format = useFormatter();

  return (
    <ActivityGrid
      title={t("Title")}
      stats={[
        {
          key: "CasesHandled",
          label: t("CasesHandled"),
          value: activity.cases_handled,
          icon: BriefcaseBusiness,
          color: "text-[#21466A]",
        },
        {
          key: "OffersSubmitted",
          label: t("OffersSubmitted"),
          value: activity.offers_submitted,
          icon: ChevronRight,
          color: "text-[#C9A450]",
        },
        {
          key: "AverageRating",
          label: t("AverageRating"),
          value: activity.rating
            ? format.number(activity.rating, { maximumFractionDigits: 1 })
            : "-",
          icon: Star,
          color: "fill-current text-[#C9A450]",
        },
        {
          key: "ActiveOffers",
          label: t("ActiveOffers"),
          value: activity.active_offers,
          icon: Clock3,
          color: "text-[#387CFF]",
        },
        {
          key: "Reviews",
          label: t("Reviews"),
          value: activity.reviews_count,
          icon: CircleCheck,
          color: "text-[#B044FF]",
        },
        {
          key: "DisputesInvolved",
          label: t("DisputesInvolved"),
          value: activity.disputes_involved,
          icon: TriangleAlert,
          color: "text-[#FF762B]",
        },
      ]}
    />
  );
}

"use client";

import { useTranslations } from "next-intl";
import LawyerHistory from "./lawyer-history";
import ActivitySummary from "./lawyer-activity";
import { getLawyerDetails } from "@/lib/lawyers";
import LawyerStatusBadge from "./lawyer-status-badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LawyerProfileDetails from "./lawyer-profile-details";
import DetailsSheet from "../people-directory/details-sheet";

export default function LawyerDetails({
  lawyerId,
  name,
}: {
  lawyerId: number;
  name: string;
}) {
  const t = useTranslations("Lawyers");

  return (
    <DetailsSheet
      name={name}
      load={() => getLawyerDetails(lawyerId)}
      labels={{
        view: t("actions.view"),
        profileTab: t("Profile.tab"),
        activityTab: t("Activity.tab"),
        historyTab: t("History.tab"),
        sendMessage: t("actions.sendMessage"),
        suspend: t("actions.suspend"),
        viewHistory: t("actions.viewHistory"),
      }}
      renderHeader={({ lawyer }) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-white">
              {lawyer.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-gray-800 font-semibold text-[13px]">
              {lawyer.name}
            </p>
            <div className="text-[11px] text-gray-400 truncate mt-1">
              <LawyerStatusBadge
                profileStatus={lawyer.profile_status}
                label={lawyer.status_label}
              />{" "}
              {lawyer.account_type_label}
            </div>
          </div>
        </div>
      )}
      renderProfile={({ lawyer }) => <LawyerProfileDetails lawyer={lawyer} />}
      renderActivity={({ activity }) => <ActivitySummary activity={activity} />}
      renderHistory={({ history }) => <LawyerHistory history={history} />}
    />
  );
}

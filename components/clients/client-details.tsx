"use client";

import { useTranslations } from "next-intl";
import ClientHistory from "./client-history";
import ActivitySummary from "./client-activity";
import { getClientDetails } from "@/lib/clients";
import ClientStatusBadge from "./client-status-badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ClientProfileDetails from "./client-profile-details";
import DetailsSheet from "../people-directory/details-sheet";

export default function ClientDetails({
  clientId,
  name,
}: {
  clientId: number;
  name: string;
}) {
  const t = useTranslations("Clients");

  return (
    <DetailsSheet
      name={name}
      load={() => getClientDetails(clientId)}
      labels={{
        view: t("actions.view"),
        profileTab: t("Profile.tab"),
        activityTab: t("Activity.tab"),
        historyTab: t("History.tab"),
        sendMessage: t("actions.sendMessage"),
        suspend: t("actions.suspend"),
        viewHistory: t("actions.viewHistory"),
      }}
      renderHeader={({ client }) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary text-white">
              {client.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-gray-800 font-semibold text-[13px]">
              {client.name}
            </p>
            <div className="text-[11px] text-gray-400 truncate mt-1 flex items-center gap-2">
              <ClientStatusBadge
                status={client.status}
                label={client.status_label}
              />
              <span>{client.city}</span>
            </div>
          </div>
        </div>
      )}
      renderProfile={({ client }) => <ClientProfileDetails client={client} />}
      renderActivity={({ activity }) => <ActivitySummary activity={activity} />}
      renderHistory={({ history }) => <ClientHistory history={history} />}
    />
  );
}

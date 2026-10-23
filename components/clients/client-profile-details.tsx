import { CalendarDays, MapPin } from "lucide-react";
import { ClientDetailsView } from "@/types/clients";
import ClientStatusBadge from "./client-status-badge";
import { useFormatter, useTranslations } from "next-intl";
import { DATE_FORMAT } from "../people-directory/format";
import {
  ContactRows,
  InfoRow,
  ProfileSection,
} from "../people-directory/profile-section";

export default function ClientProfileDetails({
  client,
}: {
  client: ClientDetailsView;
}) {
  const t = useTranslations("Clients.Profile");
  const tCommon = useTranslations("PeopleDirectory");
  const format = useFormatter();

  return (
    <div className="w-full space-y-6 text-start">
      <ProfileSection title={t("ContactInfo")}>
        <dl className="divide-y divide-gray-100/60">
          <ContactRows
            email={client.email}
            phone={client.phone}
            labels={{
              email: t("Email"),
              phone: t("Phone"),
              notAvailable: tCommon("notAvailable"),
            }}
          />

          <InfoRow label={t("Location")}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin
                aria-hidden="true"
                className="size-3 shrink-0 text-gray-400"
              />
              {client.city || tCommon("notAvailable")}
            </span>
          </InfoRow>

          <InfoRow label={t("Nationality")}>
            {client.country || tCommon("notAvailable")}
          </InfoRow>

          <InfoRow label={t("Joined")}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                aria-hidden="true"
                className="size-3 shrink-0 text-gray-400"
              />
              {format.dateTime(new Date(client.joined_at), DATE_FORMAT)}
            </span>
          </InfoRow>

          {client.last_active_at && (
            <InfoRow label={t("LastActivity")}>
              {format.dateTime(new Date(client.last_active_at), DATE_FORMAT)}
            </InfoRow>
          )}

          <InfoRow label={t("Status")}>
            <ClientStatusBadge
              status={client.status}
              label={client.status_label}
            />
          </InfoRow>
        </dl>
      </ProfileSection>
    </div>
  );
}

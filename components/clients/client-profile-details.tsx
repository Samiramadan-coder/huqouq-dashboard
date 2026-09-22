"use client";

import { type ReactNode } from "react";
import { Client } from "@/types/clients";
import { useTranslations } from "next-intl";
import { cn, formatDate } from "@/lib/utils";
import { CalendarDays, MapPin } from "lucide-react";
import { ProfileStatusLabel } from "./data-preview";
import { Card, CardContent } from "@/components/ui/card";

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {title}
      </h2>

      <Card className="gap-0 rounded-2xl border-0 bg-gray-50 py-0 shadow-none">
        <CardContent className="p-4">{children}</CardContent>
      </Card>
    </section>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start sm:gap-3">
      <dt className="text-[11px] font-bold uppercase leading-5 text-gray-400">
        {label}
      </dt>

      <dd className="min-w-0 wrap-break-word text-[13px] leading-5 text-gray-700">
        {children}
      </dd>
    </div>
  );
}

export default function ClientProfileDetails({ client }: { client: Client }) {
  const t = useTranslations("Clients.Profile");
  console.log(client);

  return (
    <div className={cn("w-full space-y-6 text-start")}>
      <ProfileSection title={t("ContactInfo")}>
        <dl className="divide-y divide-gray-100/60">
          <InfoRow label={t("Email")}>
            <a
              href={`mailto:${client.email}`}
              className="text-primary hover:underline"
            >
              <bdi dir="ltr">{client.email || "NotAvailable"}</bdi>
            </a>
          </InfoRow>

          <InfoRow label={t("Phone")}>
            <a href={`tel:${client.phone}`} className="hover:underline">
              <bdi dir="ltr">{client.phone}</bdi>
            </a>
          </InfoRow>

          <InfoRow label={t("Location")}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin
                aria-hidden="true"
                className="size-3 shrink-0 text-gray-400"
              />
              {client.city}
            </span>
          </InfoRow>

          <InfoRow label={t("Nationality")}>{client.country}</InfoRow>

          <InfoRow label={t("Joined")}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                aria-hidden="true"
                className="size-3 shrink-0 text-gray-400"
              />
              {formatDate(client.joined_at)}
            </span>
          </InfoRow>

          {client.last_active_at && (
            <InfoRow label={t("LastActivity")}>
              {formatDate(client.last_active_at)}
            </InfoRow>
          )}

          <InfoRow label={t("Status")}>
            <ProfileStatusLabel
              status={client.status}
              statusLabel={client.status_label}
            />
          </InfoRow>
        </dl>
      </ProfileSection>
    </div>
  );
}

"use client";

import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  Globe,
  GraduationCap,
  MapPin,
} from "lucide-react";

import { Lawyer } from "@/types/lawyers";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Fragment, type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useFormatter, useTranslations } from "next-intl";

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h2>

      <Card className="gap-0 rounded-2xl border-0 bg-[#FAFBFC] py-0 shadow-none">
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

export default function LawyerProfileDetails({ lawyer }: { lawyer: Lawyer }) {
  const t = useTranslations("Lawyers.Profile");
  const format = useFormatter();

  return (
    <div className={cn("w-full space-y-6 text-start")}>
      <ProfileSection title={t("ProfessionalInfo")}>
        <dl className="divide-y divide-gray-100/60">
          <InfoRow label={t("Headline")}>{t("Data.Headline")}</InfoRow>

          <InfoRow label={t("Email")}>
            <a
              href={`mailto:${lawyer.email}`}
              className="text-[#173D63] hover:underline"
            >
              <bdi dir="ltr">{lawyer.email || "NotAvailable"}</bdi>
            </a>
          </InfoRow>

          <InfoRow label={t("Phone")}>
            <a href={`tel:${lawyer.phone}`} className="hover:underline">
              <bdi dir="ltr">{lawyer.phone}</bdi>
            </a>
          </InfoRow>

          <InfoRow label={t("Location")}>
            <span className="inline-flex items-center gap-1.5">
              <MapPin
                aria-hidden="true"
                className="size-3 shrink-0 text-gray-400"
              />
              {t("Data.Location")}
            </span>
          </InfoRow>

          <InfoRow label={t("Experience")}>
            {/* {t("YearsExperience", { count: "NotAvailable" })} */}
            NotAvailable
          </InfoRow>

          <InfoRow label={t("ConsultationFee")}>
            {/* {t("FeePerHour", { amount: "NotAvailable" })} */}
            NotAvailable
          </InfoRow>

          <InfoRow label={t("Joined")}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                aria-hidden="true"
                className="size-3 shrink-0 text-gray-400"
              />
              {formatDate(lawyer.joined_at)}
            </span>
          </InfoRow>
        </dl>
      </ProfileSection>

      {lawyer.specializations.length > 0 && (
        <ProfileSection title={t("SpecializationsServices")}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <h3 className="text-[11px] text-slate-400">
                {t("PrimarySpecializations")}
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {lawyer.specializations.map((spec) => (
                  <Badge
                    key={spec.id}
                    variant="secondary"
                    className="rounded-sm border-0 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {spec.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ProfileSection>
      )}

      {/* <ProfileSection title={t("LanguagesBio")}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Globe
              aria-hidden="true"
              className="size-3.5 shrink-0 text-slate-400"
            />

            {lawyer.languages.map((language) => (
              <Badge
                key={language}
                variant="secondary"
                className="rounded-sm border-0 bg-[#F5F0E6] px-2 py-0.5 text-[11px] font-medium text-secondary hover:bg-[#F5F0E6]"
              >
                {language}
              </Badge>
            ))}
          </div>

          <p className="text-[13px] leading-relaxed text-slate-600">
            {lawyer.bio}
          </p>
        </div>
      </ProfileSection> */}

      {/* <ProfileSection title={t("Education")}>
        {lawyer.education.map((education, index) => (
          <Fragment key={education.id}>
            {index > 0 && <Separator className="my-3 bg-slate-100" />}

            <div className="flex items-start gap-2">
              <GraduationCap
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-[#173D63]"
              />

              <div className="min-w-0 space-y-0.5">
                <h3 className="text-[13px] font-semibold text-slate-800">
                  {t(`Data.${education.degree}`)}
                </h3>

                <p className="text-[11px] leading-5 text-slate-500">
                  {t(`Data.${education.institution}`)}
                  {" · "}
                  {education.year}
                </p>
              </div>
            </div>
          </Fragment>
        ))}
      </ProfileSection> */}

      {/* <ProfileSection title={t("Experience")}>
        {lawyer.experience.map((experience, index) => (
          <Fragment key={experience.id}>
            {index > 0 && <Separator className="my-3 bg-slate-100" />}

            <div className="flex items-start gap-2">
              <BriefcaseBusiness
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-[#173D63]"
              />

              <div className="min-w-0 space-y-0.5">
                <h3 className="text-[13px] font-semibold text-slate-800">
                  {t(`Data.${experience.role}`)}
                </h3>

                <p className="text-[11px] leading-5 text-slate-500">
                  {t(`Data.${experience.company}`)}
                  {" · "}
                  {t("YearRange", {
                    start: String(experience.startYear),
                    end:
                      experience.endYear === null
                        ? t("Present")
                        : String(experience.endYear),
                  })}
                </p>
              </div>
            </div>
          </Fragment>
        ))}
      </ProfileSection> */}

      {/* <ProfileSection title={t("BarCertificate")}>
        <dl className="divide-y divide-slate-100/60">
          <InfoRow label={t("BarNumber")}>
            <bdi dir="ltr" className="font-mono text-xs">
              {lawyer.barNumber}
            </bdi>
          </InfoRow>

          <InfoRow label={t("IssuingBody")}>{t("Data.IssuingBody")}</InfoRow>

          <InfoRow label={t("ExpiryDate")}>
            <span className="inline-flex items-center gap-1.5">
              <Award
                aria-hidden="true"
                className="size-3 shrink-0 text-[#C29A44]"
              />
              {formatDate(lawyer.certificateExpiry)}
            </span>
          </InfoRow>
        </dl>
      </ProfileSection> */}
    </div>
  );
}

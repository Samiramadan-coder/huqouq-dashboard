import {
  BriefcaseBusiness,
  CalendarDays,
  Globe,
  GraduationCap,
  MapPin,
} from "lucide-react";

import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { LawyerDetailsView } from "@/types/lawyers";
import { Separator } from "@/components/ui/separator";
import { useFormatter, useTranslations } from "next-intl";
import { DATE_FORMAT } from "../people-directory/format";
import {
  ContactRows,
  InfoRow,
  ProfileSection,
} from "../people-directory/profile-section";

export default function LawyerProfileDetails({
  lawyer,
}: {
  lawyer: LawyerDetailsView;
}) {
  const t = useTranslations("Lawyers.Profile");
  const tCommon = useTranslations("PeopleDirectory");
  const format = useFormatter();
  const { profile } = lawyer;
  const location = [lawyer.city, lawyer.country].filter(Boolean).join(", ");

  return (
    <div className="w-full space-y-6 text-start">
      <ProfileSection title={t("ProfessionalInfo")}>
        <dl className="divide-y divide-gray-100/60">
          <ContactRows
            email={lawyer.email}
            phone={lawyer.phone}
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
              {location || tCommon("notAvailable")}
            </span>
          </InfoRow>

          <InfoRow label={t("Experience")}>
            {t("YearsExperience", { count: profile.years_of_experience })}
          </InfoRow>

          <InfoRow label={t("Joined")}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                aria-hidden="true"
                className="size-3 shrink-0 text-gray-400"
              />
              {format.dateTime(new Date(lawyer.joined_at), DATE_FORMAT)}
            </span>
          </InfoRow>
        </dl>
      </ProfileSection>

      {lawyer.specializations.length > 0 && (
        <ProfileSection title={t("SpecializationsServices")}>
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
        </ProfileSection>
      )}

      <ProfileSection title={t("LanguagesBio")}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Globe
              aria-hidden="true"
              className="size-3.5 shrink-0 text-slate-400"
            />

            {profile.languages.length
              ? profile.languages.map((language) => (
                  <Badge
                    key={language}
                    variant="secondary"
                    className="rounded-sm border-0 bg-[#F5F0E6] px-2 py-0.5 text-[11px] font-medium text-secondary hover:bg-[#F5F0E6]"
                  >
                    {language}
                  </Badge>
                ))
              : tCommon("notAvailable")}
          </div>

          {profile.bio && (
            <p className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-line wrap-break-word">
              {profile.bio}
            </p>
          )}
        </div>
      </ProfileSection>

      <ProfileSection title={t("Education")}>
        {profile.education.length ? (
          profile.education.map((education, index) => (
            <Fragment key={education.id}>
              {index > 0 && <Separator className="my-3 bg-slate-100" />}

              <div className="flex items-start gap-2">
                <GraduationCap
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-[#173D63]"
                />

                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-[13px] font-semibold text-slate-800">
                    {education.degree}
                  </h3>

                  <p className="text-[11px] leading-5 text-slate-500">
                    {education.description}
                  </p>
                </div>
              </div>
            </Fragment>
          ))
        ) : (
          <p className="text-[13px] text-gray-400">
            {tCommon("notAvailable")}
          </p>
        )}
      </ProfileSection>

      <ProfileSection title={t("Experience")}>
        {profile.experience.length ? (
          profile.experience.map((experience, index) => (
            <Fragment key={experience.id}>
              {index > 0 && <Separator className="my-3 bg-slate-100" />}

              <div className="flex items-start gap-2">
                <BriefcaseBusiness
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-[#173D63]"
                />

                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-[13px] font-semibold text-slate-800">
                    {experience.title}
                  </h3>

                  <p className="text-[11px] leading-5 text-slate-500">
                    {experience.organization}
                    {" · "}
                    {t("YearRange", {
                      start: String(experience.start_year),
                      end:
                        experience.end_year === null
                          ? t("Present")
                          : String(experience.end_year),
                    })}
                  </p>
                </div>
              </div>
            </Fragment>
          ))
        ) : (
          <p className="text-[13px] text-gray-400">
            {tCommon("notAvailable")}
          </p>
        )}
      </ProfileSection>

      <ProfileSection title={t("BarCertificate")}>
        <dl className="divide-y divide-slate-100/60">
          <InfoRow label={t("BarNumber")}>
            {profile.bar_number ? (
              <bdi dir="ltr" className="font-mono text-xs">
                {profile.bar_number}
              </bdi>
            ) : (
              tCommon("notAvailable")
            )}
          </InfoRow>
        </dl>
      </ProfileSection>
    </div>
  );
}

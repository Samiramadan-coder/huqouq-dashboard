import { useFormatter, useTranslations } from "next-intl";
import { Mail, Phone, ShieldCheck, Star } from "lucide-react";
import { DATE_FORMAT } from "@/types/case-monitoring";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LegalServiceDetails } from "@/types/legal-services-montoring";

type Parties = LegalServiceDetails["parties"];

function PartyCard({
  role,
  party,
  fallbackClassName,
  subtitle,
  children,
}: {
  role: string;
  party: Parties["client"] | NonNullable<Parties["lawyer"]>;
  fallbackClassName: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Parties");
  const format = useFormatter();

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {role}
      </h3>

      <div className="mt-3 flex items-center gap-3">
        <Avatar className="size-11">
          {party.photo_url && (
            <AvatarImage src={party.photo_url} alt={party.name} />
          )}
          <AvatarFallback
            className={`${fallbackClassName} text-base font-semibold text-white`}
          >
            {party.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-gray-900">
            {party.name}
          </p>
          {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 text-[13px] text-gray-700">
        {party.contact_visible ? (
          <>
            <li className="flex items-center gap-2">
              <Mail aria-hidden className="size-3.5 shrink-0 text-gray-400" />
              <span className="sr-only">{t("email")}</span>
              <a
                href={`mailto:${party.email}`}
                className="truncate hover:underline"
              >
                {party.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone aria-hidden className="size-3.5 shrink-0 text-gray-400" />
              <span className="sr-only">{t("phone")}</span>
              <a
                href={`tel:${party.phone}`}
                dir="ltr"
                className="hover:underline"
              >
                {party.phone}
              </a>
            </li>
          </>
        ) : (
          <li className="text-gray-400">{t("contactHidden")}</li>
        )}
        {children}
      </ul>

      <p className="mt-4 text-[11px] text-gray-400">
        {t("memberSince", {
          date: format.dateTime(new Date(party.member_since), DATE_FORMAT),
        })}
      </p>
    </section>
  );
}

export default function PartiesContent({ parties }: { parties: Parties }) {
  const t = useTranslations("LegalServicesMonitoring.Details.Parties");
  const format = useFormatter();
  const { client, lawyer } = parties;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <PartyCard
        role={t("client")}
        party={client}
        fallbackClassName="bg-primary"
      />

      {lawyer ? (
        <PartyCard
          role={t("lawyer")}
          party={lawyer}
          fallbackClassName="bg-blue-600"
          subtitle={lawyer.specialization}
        >
          <li className="flex items-center gap-2">
            <Star
              aria-hidden
              className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
            />
            <span className="sr-only">{t("rating")}</span>
            {format.number(lawyer.rating, { maximumFractionDigits: 1 })}
            <span className="text-gray-400">
              ({t("reviews", { count: lawyer.reviews_count })})
            </span>
          </li>
          {lawyer.verified && (
            <li className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck aria-hidden className="size-3.5 shrink-0" />
              {t("verified")}
            </li>
          )}
        </PartyCard>
      ) : (
        <section className="rounded-xl border border-dashed border-gray-200 bg-white p-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {t("lawyer")}
          </h3>
          <p className="mt-3 text-[13px] text-gray-400">{t("noLawyer")}</p>
        </section>
      )}
    </div>
  );
}

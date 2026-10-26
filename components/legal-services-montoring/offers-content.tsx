import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { formatMoney } from "@/types/case-monitoring";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DATE_TIME_FORMAT,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

// The API doesn't send a currency for legal services; fees are always in AED.
const CURRENCY = "AED";

export default function OffersContent({
  offers,
}: {
  offers: LegalServiceDetails["offers"];
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Offers");
  const format = useFormatter();

  if (!offers.length) {
    return <p className="text-[13px] text-gray-400">{t("noOffers")}</p>;
  }

  return (
    <ul className="space-y-3">
      {offers.map((offer) => (
        <li
          key={offer.id}
          className={cn(
            "rounded-xl border bg-white p-5",
            offer.accepted
              ? "border-secondary/60 bg-secondary/5"
              : "border-gray-200",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-9">
                {offer.lawyer.photo_url && (
                  <AvatarImage
                    src={offer.lawyer.photo_url}
                    alt={offer.lawyer.name}
                  />
                )}
                <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                  {offer.lawyer.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-gray-800">
                  {offer.lawyer.name}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Star
                    aria-hidden
                    className="size-3 fill-amber-400 text-amber-400"
                  />
                  <span className="sr-only">{t("rating")}</span>
                  {format.number(offer.lawyer.rating, {
                    maximumFractionDigits: 1,
                  })}
                  {offer.lawyer.specialization &&
                    ` · ${offer.lawyer.specialization}`}
                </p>
              </div>
            </div>

            <div className="text-end shrink-0">
              <p className="text-[15px] font-bold text-primary">
                {formatMoney(format, offer.fee, CURRENCY)}
              </p>
              <p className="text-[11px] text-gray-500">
                {t("delivery", { time: offer.delivery_time_label })}
              </p>
            </div>
          </div>

          {offer.message && (
            <p className="mt-4 whitespace-pre-line text-[13px] text-gray-600">
              {offer.message}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-[11px] text-gray-400">
              {format.dateTime(new Date(offer.created_at), DATE_TIME_FORMAT)}
            </p>

            {offer.status !== "pending" && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  offer.accepted
                    ? "bg-secondary/15 text-secondary-foreground"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {offer.accepted && (
                  <CircleCheck aria-hidden className="size-3" />
                )}
                {offer.status_label}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

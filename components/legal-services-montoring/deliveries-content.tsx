import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { Section } from "./section";
import { useFormatter, useTranslations } from "next-intl";
import { formatFileSize } from "@/types/case-monitoring";
import {
  DATE_TIME_FORMAT,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

type Delivery = LegalServiceDetails["deliveries"][number];

// Picks a tone for the client's response; unknown types stay neutral.
function getResponseTone(type: string) {
  if (type.includes("revision")) {
    return {
      box: "border-orange-200 bg-orange-50",
      title: "text-orange-700",
      body: "text-orange-800",
    };
  }
  if (type.includes("approv") || type.includes("accept")) {
    return {
      box: "border-green-200 bg-green-50",
      title: "text-green-700",
      body: "text-green-800",
    };
  }
  return {
    box: "border-gray-200 bg-gray-50",
    title: "text-gray-700",
    body: "text-gray-700",
  };
}

export default function DeliveriesContent({
  deliveries,
}: {
  deliveries: Delivery[];
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Deliveries");
  const format = useFormatter();

  if (!deliveries.length) {
    return <p className="text-[13px] text-gray-400">{t("noDeliveries")}</p>;
  }

  // Splits a duration in minutes into "3d 21h"-style parts.
  const formatDuration = (minutes: number) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    if (days) return t("durationDays", { days, hours });
    if (hours) return t("durationHours", { hours, minutes: mins });
    return t("durationMinutes", { minutes: mins });
  };

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => {
        const { response } = delivery;
        const tone = response && getResponseTone(response.type);

        return (
          <Section
            key={delivery.round}
            title={t("round", { round: delivery.round })}
            action={
              <span className="text-[11px] text-gray-400">
                {t("deliveredIn", {
                  duration: formatDuration(delivery.took_minutes),
                })}
              </span>
            }
          >
            <p className="text-[11px] text-gray-400">
              {format.dateTime(
                new Date(delivery.delivered_at),
                DATE_TIME_FORMAT,
              )}
            </p>

            {delivery.files.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {delivery.files.map((file) => (
                  <li key={file.id}>
                    {/* Downloads through the app's proxy route, which adds the
                        HTTP-only token on the server. */}
                    <a
                      href={`/api/legal-service-files/${file.id}`}
                      download={file.name}
                      aria-label={t("download", { name: file.name })}
                      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-1.5 text-[13px] text-gray-800 hover:bg-gray-100"
                    >
                      <FileText
                        aria-hidden
                        className="size-3.5 shrink-0 text-gray-500"
                      />
                      <span className="truncate">{file.name}</span>
                      <span className="shrink-0 text-gray-400">
                        {formatFileSize(file.size_bytes, format)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {delivery.note && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {t("lawyerNote")}
                </p>
                <p className="mt-1 whitespace-pre-line text-[13px] text-gray-700">
                  {delivery.note}
                </p>
              </div>
            )}

            {response && tone && (
              <div className={cn("mt-4 rounded-lg border p-4", tone.box)}>
                <div className="flex items-center justify-between gap-4">
                  <p className={cn("text-[13px] font-semibold", tone.title)}>
                    {t.has(`responseTypes.${response.type}`)
                      ? t(`responseTypes.${response.type}`)
                      : response.type}
                  </p>
                  <p className={cn("text-[11px] shrink-0", tone.title)}>
                    {format.dateTime(new Date(response.at), DATE_TIME_FORMAT)}
                  </p>
                </div>
                {response.note && (
                  <p
                    className={cn(
                      "mt-2 whitespace-pre-line text-[13px]",
                      tone.body,
                    )}
                  >
                    “{response.note}”
                  </p>
                )}
              </div>
            )}
          </Section>
        );
      })}
    </div>
  );
}

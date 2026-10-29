import {
  Ban,
  Circle,
  RotateCcw,
  CircleCheck,
  CalendarCheck,
} from "lucide-react";
import { DATE_FORMAT } from "@/lib/format";
import { useTranslations } from "next-intl";
import { useAppFormatter } from "@/hooks/use-app-formatter";
import { Section } from "../legal-services-montoring/section";
import {
  ConsultationDetailsType,
  TIME_FORMAT,
  TIME_ZONE,
} from "@/types/consultation-monitoring";

type TimelineEntry = NonNullable<ConsultationDetailsType["timeline"]>[number];

const entryStyles: Record<
  TimelineEntry["key"],
  { Icon: typeof Circle; className: string }
> = {
  booked: { Icon: CalendarCheck, className: "bg-gray-100 text-gray-600" },
  cancelled: { Icon: Ban, className: "bg-red-50 text-red-600" },
  refund: { Icon: RotateCcw, className: "bg-amber-50 text-amber-700" },
  completed: {
    Icon: CircleCheck,
    className: "bg-emerald-50 text-emerald-700",
  },
};

// Keys the dashboard doesn't know yet still render, with a neutral icon.
const fallbackStyle = { Icon: Circle, className: "bg-gray-100 text-gray-500" };

export default function TimelineContent({
  timeline,
}: {
  timeline: TimelineEntry[];
}) {
  const t = useTranslations("ConsultationMonitoring.Details.Timeline");
  const format = useAppFormatter();

  return (
    <Section title={t("title")}>
      {timeline.length ? (
        <ol>
          {timeline.map((entry, index) => {
            const at = new Date(entry.at);
            const { Icon, className } = entryStyles[entry.key] ?? fallbackStyle;
            const isLast = index === timeline.length - 1;

            return (
              <li
                key={`${entry.key}-${entry.at}-${index}`}
                className="relative flex gap-3 pb-5 last:pb-0"
              >
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-8 bottom-0 inset-s-3.75 w-px bg-gray-200"
                  />
                )}

                <span
                  aria-hidden
                  className={`relative grid size-8 shrink-0 place-content-center rounded-full ${className}`}
                >
                  <Icon className="size-3.5" />
                </span>

                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800">
                        {entry.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {t("by", { actor: entry.actor })}
                      </p>
                    </div>
                    <time
                      dateTime={entry.at}
                      className="shrink-0 text-[11px] text-gray-400"
                    >
                      {format.dateTime(at, {
                        ...DATE_FORMAT,
                        timeZone: TIME_ZONE,
                      })}
                      {" · "}
                      {format.dateTime(at, TIME_FORMAT)}
                    </time>
                  </div>

                  {entry.note && (
                    <p className="mt-2.5 whitespace-pre-line rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] text-gray-700">
                      {entry.note}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-[13px] text-gray-400">{t("noTimeline")}</p>
      )}
    </Section>
  );
}

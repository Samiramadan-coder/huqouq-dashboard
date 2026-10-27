import {
  Circle,
  Upload,
  Wallet,
  Timer,
  Banknote,
  RotateCcw,
  UserCheck,
  CircleCheck,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./section";
import { DATE_TIME_FORMAT } from "@/lib/format";
import { useFormatter, useNow, useTranslations } from "next-intl";
import { LegalServiceDetails } from "@/types/legal-services-montoring";

type TimelineEntry = LegalServiceDetails["timeline"][number];

const entryStyles: Record<
  TimelineEntry["key"],
  { Icon: typeof Circle; className: string }
> = {
  submitted: { Icon: ClipboardList, className: "bg-gray-100 text-gray-600" },
  approved: { Icon: ShieldCheck, className: "bg-blue-50 text-blue-700" },
  paid: { Icon: Wallet, className: "bg-emerald-50 text-emerald-700" },
  delivered: { Icon: Upload, className: "bg-amber-50 text-amber-700" },
  revision: { Icon: RotateCcw, className: "bg-orange-50 text-orange-700" },
  client_approved: {
    Icon: CircleCheck,
    className: "bg-green-50 text-green-700",
  },
  admin_approved: { Icon: ShieldCheck, className: "bg-blue-50 text-blue-700" },
  approve_on_behalf: {
    Icon: UserCheck,
    className: "bg-violet-50 text-violet-700",
  },
  payout_scheduled: {
    Icon: Banknote,
    className: "bg-emerald-50 text-emerald-700",
  },
};

// Keys the API may add later still render, with a neutral icon.
const fallbackStyle = { Icon: Circle, className: "bg-gray-100 text-gray-500" };

export default function TimelineContent({
  timeline,
}: {
  timeline: TimelineEntry[];
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Timeline");
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });

  return (
    <Section title={t("title")}>
      {timeline.length ? (
        <ol>
          {timeline.map((entry, index) => {
            const at = new Date(entry.at);
            // Entries dated in the future haven't happened yet.
            const scheduled = at > now;
            const { Icon, className } = scheduled
              ? { Icon: Timer, className: "" }
              : (entryStyles[entry.key] ?? fallbackStyle);
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
                  className={cn(
                    "relative grid size-8 shrink-0 place-content-center rounded-full",
                    scheduled
                      ? "border border-dashed border-gray-300 bg-white text-gray-400"
                      : className,
                  )}
                >
                  <Icon className="size-3.5" />
                </span>

                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "flex flex-wrap items-center gap-2 text-[13px] font-semibold",
                          scheduled ? "text-gray-400" : "text-gray-800",
                        )}
                      >
                        {entry.label}
                        {scheduled && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {t("scheduled")}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {t("by", { actor: entry.actor })}
                      </p>
                    </div>
                    <time
                      dateTime={entry.at}
                      className="shrink-0 text-[11px] text-gray-400"
                    >
                      {format.dateTime(at, DATE_TIME_FORMAT)}
                    </time>
                  </div>

                  {entry.note && (
                    <p
                      className={cn(
                        "mt-2.5 whitespace-pre-line rounded-lg bg-gray-50 px-3 py-2.5 text-[13px]",
                        scheduled ? "text-gray-400" : "text-gray-700",
                      )}
                    >
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

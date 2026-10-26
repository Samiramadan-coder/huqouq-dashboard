import { cn } from "@/lib/utils";
import { Section } from "./section";
import { useFormatter, useTranslations } from "next-intl";
import {
  DATE_TIME_FORMAT,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

type Activity = LegalServiceDetails["activity"][number];

const categoryClassNames: Record<Activity["category"], string> = {
  admin: "bg-primary text-white",
  status: "bg-blue-50 text-blue-700",
  system: "bg-gray-100 text-gray-600",
};

export default function ActivityContent({
  activity,
}: {
  activity: Activity[];
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Activity");
  const format = useFormatter();

  return (
    <Section
      title={t("title")}
      action={
        <span className="text-[11px] text-gray-400">
          {t("entries", { count: activity.length })}
        </span>
      }
    >
      {activity.length ? (
        <ol className="divide-y divide-gray-100">
          {activity.map((entry, index) => (
            <li
              key={`${entry.at}-${index}`}
              className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              <span
                className={cn(
                  "mt-0.5 w-16 shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-bold uppercase tracking-wider",
                  categoryClassNames[entry.category],
                )}
              >
                {t(`categories.${entry.category}`)}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-gray-800">{entry.label}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {entry.actor} ·{" "}
                  {format.dateTime(new Date(entry.at), DATE_TIME_FORMAT)}
                </p>
                {entry.note && (
                  <p className="mt-1.5 whitespace-pre-line text-[12px] text-gray-600">
                    {entry.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[13px] text-gray-400">{t("noActivity")}</p>
      )}
    </Section>
  );
}

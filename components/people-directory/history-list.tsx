"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useFormatter, useTranslations } from "next-intl";
import { DATE_FORMAT } from "./format";

type HistoryType = "case" | "offer" | "consultation";

type HistoryEntry<Type extends HistoryType> = {
  type: Type;
  at: string;
  detail: string;
  status: string;
  status_label: string;
  title: string;
};

// Chronological list of cases / offers / consultations in the details sheets.
export default function HistoryList<Type extends HistoryType>({
  title,
  history,
  typeClassNames,
  positiveStatus,
}: {
  title: string;
  history: HistoryEntry<Type>[];
  typeClassNames: Record<Type, string>;
  // Status highlighted in green, e.g. "accepted" offers.
  positiveStatus: string;
}) {
  const format = useFormatter();
  const t = useTranslations("PeopleDirectory");

  return (
    <section className="w-full space-y-3 text-start">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h2>

      {history.length ? (
        <ol className="space-y-2">
          {history.map((item, index) => (
            <li key={`${item.type}-${item.at}-${index}`}>
              <Card className="gap-0 rounded-2xl ring-0! border border-gray-200 bg-gray-50/80 py-0 shadow-none">
                <CardContent className="flex flex-wrap items-start gap-2 px-4 py-3 sm:flex-nowrap">
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-0.5 shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      typeClassNames[item.type],
                    )}
                  >
                    {t(`historyTypes.${item.type as HistoryType}`)}
                  </Badge>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13px] font-semibold leading-5 text-gray-800">
                      {item.title}
                    </h3>

                    <p className="mt-0.5 text-[11px] leading-4 text-gray-500 wrap-break-word">
                      {item.detail}
                    </p>
                  </div>

                  <div className="ms-auto shrink-0 text-end">
                    <p
                      className={cn(
                        "text-[11px] font-semibold leading-5",
                        item.status === positiveStatus
                          ? "text-green-600"
                          : "text-gray-400",
                      )}
                    >
                      {item.status_label}
                    </p>

                    <time
                      dateTime={item.at}
                      className="block text-[10px] leading-4 text-gray-400"
                    >
                      {format.dateTime(new Date(item.at), DATE_FORMAT)}
                    </time>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[13px] text-gray-400">{t("noHistory")}</p>
      )}
    </section>
  );
}

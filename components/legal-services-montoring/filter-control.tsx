"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Counts, monitoringTabs } from "@/types/legal-services-montoring";

export default function FilterControl({ counts }: { counts: Counts }) {
  const t = useTranslations("LegalServicesMonitoring.Tabs");

  const [{ tab }, setFilters] = useQueryStates(
    {
      tab: parseAsStringLiteral(monitoringTabs).withDefault("all"),
      // Reset to the first page whenever the tab changes.
      page: parseAsString,
    },
    { history: "push", shallow: false },
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <Tabs
        value={tab}
        onValueChange={(value) =>
          setFilters({
            tab: monitoringTabs.find((s) => s === value) ?? "all",
            page: null,
          })
        }
      >
        <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200 flex-wrap">
          {monitoringTabs.map((statusKey) => {
            const isActive = statusKey === tab;

            return (
              <TabsTrigger
                key={statusKey}
                value={statusKey}
                className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {t(statusKey)}{" "}
                <span
                  className={cn(
                    "min-w-4.5 h-4.5 px-1 text-[11px] grid place-content-center font-bold rounded-full bg-gray-100 text-gray-600",
                    isActive && "bg-white/20 text-white",
                  )}
                >
                  {counts[statusKey]}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

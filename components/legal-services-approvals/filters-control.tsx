"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Counts, reviewTabs } from "@/types/legal-services-approvals";

export function FilterControl({ counts }: { counts: Counts }) {
  const t = useTranslations("LegalServicesApprovals");

  const [{ tab }, setFilters] = useQueryStates(
    {
      tab: parseAsStringLiteral(reviewTabs).withDefault("pending_review"),
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
            tab: reviewTabs.find((s) => s === value) ?? "pending_review",
            page: null,
          })
        }
      >
        <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200">
          {reviewTabs.map((statusKey) => {
            const isActive = statusKey === tab;

            return (
              <TabsTrigger
                key={statusKey}
                value={statusKey}
                className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {t(statusKey)}{" "}
                {statusKey === "pending_review" && (
                  <span
                    className={cn(
                      "size-4.5 text-[11px] grid place-content-center font-bold rounded-full bg-amber-100 text-amber-700",
                      isActive && "bg-white/20 text-white",
                    )}
                  >
                    {counts[statusKey]}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}

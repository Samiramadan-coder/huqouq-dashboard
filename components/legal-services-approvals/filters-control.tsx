"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Counts } from "@/types/legal-services-approvals";

const statuses: (keyof Counts)[] = ["pending_review", "approved", "rejected"];

export function FilterControl({ counts }: { counts: Counts }) {
  const t = useTranslations("LegalServicesApprovals");

  const [{ tab }, setFilters] = useQueryStates({
    tab: parseAsString.withDefault("pending_review").withOptions({
      history: "push",
      shallow: false,
    }),
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <Tabs value={tab} onValueChange={(value) => setFilters({ tab: value })}>
        <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200">
          {statuses.map((statusKey) => {
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

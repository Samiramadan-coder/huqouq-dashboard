"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Counts } from "@/types/case-monitoring";
import { parseAsString, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Field } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search, Triangle, TriangleAlert } from "lucide-react";

const statuses: (keyof Counts)[] = [
  "all_active",
  "needs_attention",
  "in_progress",
  "pending_fees",
  "closed",
  "pending_closure",
];

export function FilterControl({ counts }: { counts: Counts }) {
  const t = useTranslations("CaseMonitoring");

  const [{ tab, q }, setFilters] = useQueryStates({
    tab: parseAsString.withDefault("all_active").withOptions({
      history: "push",
      shallow: false,
    }),
    q: parseAsString.withDefault("").withOptions({
      history: "push",
      shallow: false,
    }),
  });

  return (
    <>
      <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200">
        <TriangleAlert className="text-amber-600 shrink-0 size-4" />
        <div className="text-[13px] text-amber-800">
          <span className="font-semibold">
            {counts.needs_attention} {t("attentionNotice")}
          </span>{" "}
          {t("attentionNoticeDescription")}
        </div>
      </div>

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
                  {statusKey === "needs_attention" && (
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

        <div className="relative w-full max-w-80">
          <Field>
            <InputGroup className="bg-white h-8.5 border border-gray-200">
              <InputGroupInput
                value={q}
                onChange={(e) =>
                  setFilters({
                    q: e.target.value,
                  })
                }
                placeholder={t("searchPlaceholder")}
                className="min-w-50 placeholder:text-gray-400 placeholder:text-[13px]"
              />
              <InputGroupAddon align="inline-start">
                <Search className="text-gray-400 size-4" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
      </div>
    </>
  );
}

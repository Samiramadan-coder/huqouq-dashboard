"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Counts, monitoringTabs } from "@/types/case-monitoring";
import {
  debounce,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Field } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search, TriangleAlert } from "lucide-react";

const SEARCH_DEBOUNCE_MS = 400;

export function FilterControl({ counts }: { counts: Counts }) {
  const t = useTranslations("CaseMonitoring");

  const [{ tab, q }, setFilters] = useQueryStates(
    {
      tab: parseAsStringLiteral(monitoringTabs).withDefault("all_active"),
      q: parseAsString.withDefault(""),
      // Reset to the first page whenever a filter changes.
      page: parseAsString,
    },
    { history: "push", shallow: false },
  );

  return (
    <>
      <div
        role="status"
        className="flex items-start gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200"
      >
        <TriangleAlert className="text-amber-600 shrink-0 size-4" />
        <div className="text-[13px] text-amber-800">
          <span className="font-semibold">
            {counts.needs_attention} {t("attentionNotice")}
          </span>{" "}
          {t("attentionNoticeDescription")}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Tabs
          value={tab}
          onValueChange={(value) =>
            setFilters({
              tab: monitoringTabs.find((s) => s === value) ?? "all_active",
              page: null,
            })
          }
        >
          <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200">
            {monitoringTabs.map((statusKey) => {
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
                type="search"
                value={q}
                aria-label={t("searchPlaceholder")}
                onChange={(e) =>
                  setFilters(
                    { q: e.target.value, page: null },
                    {
                      history: "replace",
                      limitUrlUpdates: e.target.value
                        ? debounce(SEARCH_DEBOUNCE_MS)
                        : undefined,
                    },
                  )
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

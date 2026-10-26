"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Field } from "../ui/field";
import { useTranslations } from "next-intl";
import QuerySelect from "../reusable/query-select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  debounce,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Counts,
  Filters,
  monitoringTabs,
} from "@/types/legal-services-montoring";

const SEARCH_DEBOUNCE_MS = 400;

export default function FilterControl({
  counts,
  filters,
}: {
  counts: Counts;
  filters: Filters;
}) {
  const t = useTranslations("LegalServicesMonitoring");

  const [{ tab, q, lawyer_id, service_type, urgency }, setFilters] =
    useQueryStates(
      {
        tab: parseAsStringLiteral(monitoringTabs).withDefault("all"),
        q: parseAsString.withDefault(""),
        lawyer_id: parseAsString.withDefault(""),
        service_type: parseAsString.withDefault(""),
        urgency: parseAsString.withDefault(""),
        // Reset to the first page whenever a filter changes.
        page: parseAsString,
      },
      { history: "push", shallow: false },
    );

  // "" clears the param, so an empty selection drops it from the URL.
  const setFilter =
    (key: "lawyer_id" | "service_type" | "urgency") => (value: string) =>
      setFilters({ [key]: value || null, page: null });

  return (
    <div className="space-y-5">
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
          {filters.tabs.map(({ value: statusKey, label }) => {
            const isActive = statusKey === tab;

            return (
              <TabsTrigger
                key={statusKey}
                value={statusKey}
                className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {label}{" "}
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

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-80">
          <Field>
            <InputGroup className="bg-white h-8.5 border border-gray-200">
              <InputGroupInput
                type="search"
                value={q}
                aria-label={t("Filters.searchPlaceholder")}
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
                placeholder={t("Filters.searchPlaceholder")}
                className="min-w-50 placeholder:text-gray-400 placeholder:text-[13px]"
              />
              <InputGroupAddon align="inline-start">
                <Search className="text-gray-400 size-4" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        <QuerySelect
          label={t("Filters.allServiceTypes")}
          placeholder={t("Filters.allServiceTypes")}
          className="w-full max-w-48"
          value={service_type}
          onChange={setFilter("service_type")}
          options={[
            { value: "", label: t("Filters.allServiceTypes") },
            ...filters.service_types,
          ]}
        />

        <QuerySelect
          label={t("Filters.allLawyers")}
          placeholder={t("Filters.allLawyers")}
          className="w-full max-w-48"
          value={lawyer_id}
          onChange={setFilter("lawyer_id")}
          options={[
            { value: "", label: t("Filters.allLawyers") },
            ...filters.lawyers.map((lawyer) => ({
              value: String(lawyer.id),
              label: lawyer.name,
            })),
          ]}
        />

        <QuerySelect
          label={t("Filters.allUrgencies")}
          placeholder={t("Filters.allUrgencies")}
          className="w-full max-w-48"
          value={urgency}
          onChange={setFilter("urgency")}
          options={[
            { value: "", label: t("Filters.allUrgencies") },
            ...filters.urgencies,
          ]}
        />
      </div>
    </div>
  );
}

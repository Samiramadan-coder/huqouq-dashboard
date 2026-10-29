"use client";

import { useAppFormatter } from "@/hooks/use-app-formatter";
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
  FiltersType,
  consultationTabs,
} from "@/types/consultation-monitoring";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Field } from "../ui/field";
import QuerySelect from "../reusable/query-select";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const SEARCH_DEBOUNCE_MS = 400;

export default function Filters({
  counts,
  filters,
}: {
  counts: Counts;
  filters: FiltersType;
}) {
  const t = useTranslations("ConsultationMonitoring");
  const format = useAppFormatter();

  const [{ tab, q, type, lawyer_id, client_id, sort }, setFilters] =
    useQueryStates(
      {
        tab: parseAsStringLiteral(consultationTabs).withDefault("all"),
        q: parseAsString.withDefault(""),
        type: parseAsString.withDefault(""),
        lawyer_id: parseAsString.withDefault(""),
        client_id: parseAsString.withDefault(""),
        sort: parseAsString.withDefault(""),
        page: parseAsString,
      },
      { history: "push", shallow: false },
    );

  // "" clears the param, so an empty selection drops it from the URL.
  const setFilter =
    (key: "type" | "lawyer_id" | "client_id" | "sort") => (value: string) =>
      setFilters({ [key]: value || null, page: null });

  return (
    <div className="space-y-5">
      <Tabs
        value={tab}
        onValueChange={(value) =>
          setFilters({
            tab: consultationTabs.find((s) => s === value) ?? "all",
            page: null,
          })
        }
      >
        <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200 flex-wrap">
          {filters.tabs.map(({ value: tabKey, label }) => {
            const isActive = tabKey === tab;

            return (
              <TabsTrigger
                key={tabKey}
                value={tabKey}
                className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {label}{" "}
                <span
                  className={cn(
                    "min-w-4.5 h-4.5 px-1 text-[11px] grid place-content-center font-bold rounded-full bg-gray-100 text-gray-600",
                    isActive && "bg-white/20 text-white",
                  )}
                >
                  {format.number(counts[tabKey])}
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
          label={t("Filters.allTypes")}
          placeholder={t("Filters.allTypes")}
          className="w-full max-w-40"
          value={type}
          onChange={setFilter("type")}
          options={[
            { value: "", label: t("Filters.allTypes") },
            ...filters.types,
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
          label={t("Filters.allClients")}
          placeholder={t("Filters.allClients")}
          className="w-full max-w-48"
          value={client_id}
          onChange={setFilter("client_id")}
          options={[
            { value: "", label: t("Filters.allClients") },
            ...filters.clients.map((client) => ({
              value: String(client.id),
              label: client.name,
            })),
          ]}
        />

        {/* No "all" option: the first sort is the API's default order. */}
        <QuerySelect
          label={t("Filters.sort")}
          placeholder={t("Filters.sort")}
          className="w-full max-w-44"
          value={sort || (filters.sorts[0]?.value ?? "")}
          onChange={setFilter("sort")}
          options={filters.sorts}
        />
      </div>
    </div>
  );
}

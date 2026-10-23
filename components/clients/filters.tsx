"use client";

import {
  debounce,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { useTranslations } from "next-intl";
import QuerySearch from "../reusable/query-search";
import QuerySelect from "../reusable/query-select";
import { clientStatusFilters } from "@/types/clients";

const SEARCH_DEBOUNCE_MS = 400;

export default function Filters() {
  const t = useTranslations("Clients.filters");

  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      status: parseAsStringLiteral(clientStatusFilters),
      // Reset to the first page whenever a filter changes.
      page: parseAsString,
    },
    { history: "push", shallow: false },
  );

  return (
    <div className="flex items-center gap-2">
      <QuerySearch
        value={filters.q}
        onChange={(value) =>
          setFilters(
            { q: value, page: null },
            {
              history: "replace",
              limitUrlUpdates: value ? debounce(SEARCH_DEBOUNCE_MS) : undefined,
            },
          )
        }
        placeholder={t("searchPlaceholder")}
        className="max-w-sm"
      />

      <QuerySelect
        label={t("allClients")}
        value={filters.status ?? ""}
        onChange={(value) =>
          setFilters({
            status: clientStatusFilters.find((s) => s === value) ?? null,
            page: null,
          })
        }
        placeholder={t("allClients")}
        className="max-w-xs"
        options={[
          { value: "", label: t("allClients") },
          { value: "active", label: t("activeClients") },
          { value: "inactive", label: t("inactiveClients") },
        ]}
      />
    </div>
  );
}

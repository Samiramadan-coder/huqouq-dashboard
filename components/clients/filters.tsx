"use client";

import { useTranslations } from "next-intl";
import QuerySearch from "../reusable/query-search";
import QuerySelect from "../reusable/query-select";
import { useQueryStates, parseAsString } from "nuqs";

export default function Filters() {
  const t = useTranslations("Clients.filters");

  const [filters, setFilters] = useQueryStates({
    q: parseAsString.withDefault("").withOptions({
      history: "push",
      shallow: false,
    }),
    status: parseAsString.withDefault("").withOptions({
      history: "push",
      shallow: false,
    }),
  });

  return (
    <div className="flex items-center gap-2">
      <QuerySearch
        value={filters.q}
        onChange={(value) => setFilters({ q: value })}
        placeholder={t("searchPlaceholder")}
        className="max-w-sm"
      />

      <QuerySelect
        value={filters.status}
        onChange={(value) => setFilters({ status: value })}
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

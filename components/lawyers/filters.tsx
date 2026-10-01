"use client";

import { useTranslations } from "next-intl";
import QuerySearch from "../reusable/query-search";
import QuerySelect from "../reusable/query-select";
import { parseAsString, useQueryStates } from "nuqs";
import { useReferenceData } from "@/providers/reference-data.provider";

export default function Filters() {
  const t = useTranslations("Lawyers.filters");
  const { referenceData } = useReferenceData();

  const [filters, setFilters] = useQueryStates({
    q: parseAsString.withDefault("").withOptions({
      history: "push",
      shallow: false,
    }),

    status: parseAsString.withDefault("").withOptions({
      history: "push",
      shallow: false,
    }),

    specialization: parseAsString.withDefault("").withOptions({
      history: "push",
      shallow: false,
    }),
  });

  return (
    <div className="flex items-center gap-2">
      <QuerySearch
        placeholder={t("searchPlaceholder")}
        className="max-w-sm"
        value={filters.q}
        onChange={(value) => setFilters({ q: value })}
      />

      <QuerySelect
        value={filters.status}
        onChange={(value) => setFilters({ status: value })}
        placeholder={t("allStatus")}
        className="max-w-xs"
        options={[
          { label: t("allStatus"), value: "" },
          { label: t("approved"), value: "approved" },
          { label: t("pending"), value: "pending" },
          { label: t("rejected"), value: "rejected" },
          { label: t("incomplete"), value: "incomplete" },
        ]}
      />

      <QuerySelect
        value={filters.specialization}
        onChange={(value) => setFilters({ specialization: value })}
        placeholder={t("allSpecializations")}
        className="max-w-xs"
        options={
          referenceData?.specializations.map((spec) => ({
            label: spec.name,
            value: String(spec.id),
          })) || []
        }
      />
    </div>
  );
}

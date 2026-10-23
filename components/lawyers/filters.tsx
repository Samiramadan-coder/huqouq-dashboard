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
import { lawyerStatusFilters } from "@/types/lawyers";
import { useReferenceData } from "@/providers/reference-data.provider";

const SEARCH_DEBOUNCE_MS = 400;

export default function Filters() {
  const t = useTranslations("Lawyers.filters");
  const { referenceData } = useReferenceData();

  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      status: parseAsStringLiteral(lawyerStatusFilters),
      specialization: parseAsString.withDefault(""),
      // Reset to the first page whenever a filter changes.
      page: parseAsString,
    },
    { history: "push", shallow: false },
  );

  return (
    <div className="flex items-center gap-2">
      <QuerySearch
        placeholder={t("searchPlaceholder")}
        className="max-w-sm"
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
      />

      <QuerySelect
        label={t("allStatus")}
        value={filters.status ?? ""}
        onChange={(value) =>
          setFilters({
            status: lawyerStatusFilters.find((s) => s === value) ?? null,
            page: null,
          })
        }
        placeholder={t("allStatus")}
        className="max-w-xs"
        options={[
          { label: t("allStatus"), value: "" },
          ...lawyerStatusFilters.map((status) => ({
            label: t(status),
            value: status,
          })),
        ]}
      />

      {referenceData && (
        <QuerySelect
          label={t("allSpecializations")}
          value={filters.specialization}
          onChange={(value) =>
            setFilters({ specialization: value || null, page: null })
          }
          placeholder={t("allSpecializations")}
          className="max-w-xs"
          options={[
            { label: t("allSpecializations"), value: "" },
            ...referenceData.specializations.map((spec) => ({
              label: spec.name,
              value: String(spec.id),
            })),
          ]}
        />
      )}
    </div>
  );
}

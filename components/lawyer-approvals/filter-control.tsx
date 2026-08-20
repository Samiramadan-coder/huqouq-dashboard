"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Field } from "../ui/field";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

const statuses = ["pending", "approved", "rejected"] as const;

type FilterControlProps = {
  counts: {
    pending: number;
    approved: number;
    rejected: number;
  };
};

export function FilterControl({ counts }: FilterControlProps) {
  const t = useTranslations("LawyerApprovals");

  const [{ status, q }, setFilters] = useQueryStates({
    status: parseAsStringLiteral(statuses).withDefault("pending").withOptions({
      history: "push",
      shallow: false,
    }),
    q: parseAsString.withDefault("").withOptions({
      history: "push",
      shallow: false,
    }),
  });

  const tabs = [
    {
      value: "pending" as const,
      label: t("pendingReview"),
      count: counts.pending,
    },
    {
      value: "approved" as const,
      label: t("approved"),
      count: counts.approved,
    },
    {
      value: "rejected" as const,
      label: t("rejected"),
      count: counts.rejected,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-xl border bg-white p-1">
        {tabs.map((tab) => {
          const isActive = status === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                setFilters({
                  status: tab.value,
                })
              }
              className={[
                "cursor-pointer flex h-9 items-center gap-2 rounded-lg px-4 text-sm transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted",
              ].join(" ")}
            >
              {tab.label}

              <span
                className={[
                  "flex size-5 items-center justify-center rounded-full text-xs",
                  tab.value === "pending"
                    ? isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                    : tab.value === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600",
                ].join(" ")}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-80">
          <Field>
            <InputGroup className="bg-white h-10">
              <InputGroupInput
                value={q}
                onChange={(e) =>
                  setFilters({
                    q: e.target.value,
                  })
                }
                placeholder={t("searchPlaceholder")}
                className="min-w-50"
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        {status === "pending" && (
          <div className="shrink-0 rounded-sm border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-600">
            {t("applicationsAwaitingReview", {
              count: counts.pending,
            })}
          </div>
        )}

        {status === "approved" && (
          <div className="shrink-0 rounded-sm border border-emerald-400 bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
            {t("applicationsApproved", {
              count: counts.approved,
            })}
          </div>
        )}

        {status === "rejected" && (
          <div className="shrink-0 rounded-sm border border-red-400 bg-red-50 px-3 py-2 text-xs text-red-600">
            {t("applicationsRejected", {
              count: counts.rejected,
            })}
          </div>
        )}
      </div>
    </div>
  );
}

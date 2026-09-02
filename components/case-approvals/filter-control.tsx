"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Field } from "../ui/field";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Counts } from "@/types/case-approvals";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useReferenceData } from "@/providers/reference-data.provider";

const statuses = ["pending_review", "approved", "rejected"] as const;

export function FilterControl({ counts }: { counts: Counts }) {
  const { referenceData } = useReferenceData();
  const t = useTranslations("CaseApprovals");

  const [{ status, q, specialization_id, urgency }, setFilters] =
    useQueryStates({
      status: parseAsStringLiteral(statuses)
        .withDefault("pending_review")
        .withOptions({
          history: "push",
          shallow: false,
        }),
      q: parseAsString.withDefault("").withOptions({
        history: "push",
        shallow: false,
      }),
      specialization_id: parseAsString.withDefault("").withOptions({
        history: "push",
        shallow: false,
      }),
      urgency: parseAsString.withDefault("").withOptions({
        history: "push",
        shallow: false,
      }),
    });

  const tabs = [
    {
      value: "pending_review" as const,
      label: t("pendingReview"),
      count: counts.pending_review,
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
                  tab.value === "pending_review"
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

      <div className="flex items-center gap-4">
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

        <Select
          value={specialization_id}
          onValueChange={(value) => setFilters({ specialization_id: value })}
        >
          <SelectTrigger className="w-full max-w-48 min-h-10 bg-white">
            <SelectValue placeholder={t("Filters.allCategories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {referenceData?.specializations.map((spec) => (
                <SelectItem key={spec.id} value={String(spec.id)}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={urgency}
          onValueChange={(value) => setFilters({ urgency: value })}
        >
          <SelectTrigger className="w-full max-w-48 min-h-10 bg-white">
            <SelectValue placeholder={t("Filters.allUrgency")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {["urgent", "standard", "very_urgent"].map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {t(`Filters.${spec}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

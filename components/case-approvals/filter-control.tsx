"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Field } from "../ui/field";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Counts } from "@/types/case-approvals";
import { parseAsString, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useReferenceData } from "@/providers/reference-data.provider";

const statuses: (keyof Counts)[] = [
  "pending_review",
  "published",
  "in_progress",
  "pending_fees",
  "closed",
  "pending_closure",
  "rejected",
];

export function FilterControl({ counts }: { counts: Counts }) {
  const { referenceData } = useReferenceData();
  const t = useTranslations("CaseApprovals");

  const [{ status, q, specialization_id, urgency }, setFilters] =
    useQueryStates({
      status: parseAsString.withDefault("pending_review").withOptions({
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

  return (
    <div className="space-y-5">
      <Tabs
        value={status}
        onValueChange={(value) => setFilters({ status: value })}
      >
        <TabsList className="h-auto! bg-white gap-2 p-2 rounded-lg">
          {statuses.map((statusKey) => {
            return (
              <TabsTrigger
                key={statusKey}
                value={statusKey}
                className="px-4 h-9 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {t(statusKey)}{" "}
                <span className="size-4.5 text-white text-[11px] grid place-content-center font-bold rounded-full bg-secondary">
                  {counts[statusKey]}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

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

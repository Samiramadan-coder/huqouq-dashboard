"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Field } from "../ui/field";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Counts } from "@/types/lawyer-approvals";
import { parseAsString, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const statuses: (keyof Counts)[] = ["pending", "approved", "rejected"];

export function FilterControl({ counts }: { counts: Counts }) {
  const t = useTranslations("LawyerApprovals");

  const [{ status, q }, setFilters] = useQueryStates({
    status: parseAsString.withDefault("pending").withOptions({
      history: "push",
      shallow: false,
    }),
    q: parseAsString.withDefault("").withOptions({
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

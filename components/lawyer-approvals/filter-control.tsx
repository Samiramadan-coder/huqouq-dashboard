"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Field } from "../ui/field";
import { CircleCheck, CircleX, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Counts } from "@/types/lawyer-approvals";
import { parseAsString, useQueryStates } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";

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
        <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200">
          {statuses.map((statusKey) => {
            const isActive = statusKey === status;

            return (
              <TabsTrigger
                key={statusKey}
                value={statusKey}
                className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {t(statusKey)}{" "}
                <span
                  className={cn(
                    "size-4.5 text-white text-[11px] grid place-content-center font-bold rounded-full",
                    statusKey === "pending" && "bg-amber-100 text-amber-700",
                    statusKey === "approved" && "bg-green-200 text-green-700",
                    statusKey === "rejected" && "bg-red-100 text-red-600",
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

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-80">
          <Field>
            <InputGroup className="bg-white h-8.5 border border-gray-200">
              <InputGroupInput
                value={q}
                onChange={(e) =>
                  setFilters({
                    q: e.target.value,
                  })
                }
                placeholder={t("searchPlaceholder")}
                className="min-w-50 placeholder:text-gray-400 placeholder:text-[13px]"
              />
              <InputGroupAddon align="inline-start">
                <Search className="text-gray-400 size-4" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        {status === "pending" && (
          <div className="shrink-0 rounded-sm border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-600">
            <span className="text-amber-700 font-semibold">
              {counts.pending}
            </span>{" "}
            {t("applicationsAwaitingReview")}
          </div>
        )}

        {status === "approved" && (
          <div className="shrink-0 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-600 flex items-center gap-1">
            <CircleCheck className="text-emerald-400 size-3.5" />
            <span className="text-emerald-700 font-semibold">
              {counts.approved}
            </span>{" "}
            <span className="text-emerald-700 font-semibold">
              {t("applicationsApproved1")}
            </span>{" "}
            {t("applicationsApproved2")}
          </div>
        )}

        {status === "rejected" && (
          <div className="shrink-0 rounded-sm border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600 flex items-center gap-1">
            <CircleX className="text-red-400 size-3.5" />
            <span className="text-red-700 font-semibold">
              {counts.rejected}
            </span>{" "}
            <span className="text-red-700 font-semibold">
              {t("applicationsRejected1")}
            </span>{" "}
            {t("applicationsRejected2")}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function PayoutTabs() {
  const t = useTranslations("Payouts.tabs");

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString
      .withDefault("by-lawyer")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value)}>
      <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200">
        <TabsTrigger
          key="by-lawyer"
          value="by-lawyer"
          className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          {t("byLawyer")}
        </TabsTrigger>

        <TabsTrigger
          key="all-transactions"
          value="all-transactions"
          className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
        >
          {t("allTransactions")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

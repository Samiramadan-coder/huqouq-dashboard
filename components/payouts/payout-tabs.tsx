"use client";

import { useTranslations } from "next-intl";
import { payoutTabs } from "@/types/payouts";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const tabLabelKeys = {
  "by-lawyer": "byLawyer",
  "all-transactions": "allTransactions",
} as const;

export default function PayoutTabs() {
  const t = useTranslations("Payouts.tabs");

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(payoutTabs)
      .withDefault("by-lawyer")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <Tabs
      value={tab}
      onValueChange={(value) =>
        setTab(payoutTabs.find((item) => item === value) ?? "by-lawyer")
      }
    >
      <TabsList className="h-auto! bg-white gap-0 p-1 rounded-xl border border-gray-200">
        {payoutTabs.map((value) => (
          <TabsTrigger
            key={value}
            value={value}
            className="px-4 h-9 text-[13px] font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {t(tabLabelKeys[value])}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

import type { Metadata } from "next";
import { http } from "@/lib/http";
import Stats from "@/components/payouts/stats";
import { getTranslations } from "next-intl/server";
import PageTitle from "@/components/payouts/page-title";
import PayoutTabs from "@/components/payouts/payout-tabs";
import { maskIban } from "@/components/payouts/format";
import ByLawyerDataPreview from "@/components/payouts/by-lawyer-data-preview";
import PayoutDetailsMissing from "@/components/payouts/payout-details-missing";
import AllTransactionsDataPreview from "@/components/payouts/all-transactions-data-preview";
import {
  payoutTabs,
  type ByLawyerRow,
  type PayoutsResponse,
  type TabType,
  type TransactionsResponse,
} from "@/types/payouts";

type SearchParams = {
  tab?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("payouts") };
}

// Falls back to the default tab when the URL holds an unknown value.
function parseTab(tab?: string): TabType {
  return payoutTabs.find((value) => value === tab) ?? "by-lawyer";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const tab = parseTab((await searchParams).tab);

  // The summary always comes from the payouts endpoint; transactions are only
  // fetched for their tab, in parallel rather than one after the other.
  const [{ data }, transactions] = await Promise.all([
    http.get<PayoutsResponse>("/api/admin/payouts", {
      next: { tags: ["by-lawyer-data"] },
    }),
    tab === "all-transactions"
      ? http.get<TransactionsResponse>("/api/admin/payouts/transactions")
      : null,
  ]);

  // Allowlist of row fields sent to the browser: full bank details never
  // leave the server with the page, only a masked IBAN.
  const rows: ByLawyerRow[] = data.data.map((row) => ({
    lawyer: row.lawyer,
    pending: row.pending,
    ready: row.ready,
    ls_pending: row.ls_pending,
    ls_ready: row.ls_ready,
    total_paid: row.total_paid,
    can_process_payout: row.can_process_payout,
    payout_details_missing: row.payout_details_missing,
    masked_iban: maskIban(row.iban),
  }));

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <PageTitle />

      <Stats stats={data.summary} />

      <PayoutTabs />

      {transactions ? (
        <AllTransactionsDataPreview transactions={transactions.data.data} />
      ) : (
        <ByLawyerDataPreview data={rows} currency={data.summary.currency} />
      )}

      {data.payout_details_missing && <PayoutDetailsMissing />}
    </div>
  );
}

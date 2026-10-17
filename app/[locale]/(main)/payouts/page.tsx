import { http } from "@/lib/http";
import type { ByLawyerData, Summary } from "@/types/payouts";
import Stats from "@/components/payouts/stats";
import PageTitle from "@/components/payouts/page-title";
import PayoutTabs from "@/components/payouts/payout-tabs";
import ByLawyerDataPreview from "@/components/payouts/by-lawyer-data-preview";
import PayoutDetailsMissing from "@/components/payouts/payout-details-missing";
import AllTransactionsDataPreview from "@/components/payouts/all-transactions-data-preview";

type SearchParams = {
  tab: "by-lawyer" | "all-transactions";
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab } = await searchParams;

  const { data } = await http.get<{
    summary: Summary;
    payout_details_missing: boolean;
    data: ByLawyerData[];
  }>("/api/admin/payouts");

  console.log(data);
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <PageTitle />

      <Stats stats={data.summary} />

      <PayoutTabs />

      {(!tab || tab === "by-lawyer") && <ByLawyerDataPreview data={data.data} />}

      {tab === "all-transactions" && <AllTransactionsDataPreview />}

      {data.payout_details_missing && <PayoutDetailsMissing />}
    </div>
  );
}

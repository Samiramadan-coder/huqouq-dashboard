import {
  Attention as AttentionType,
  Summary,
  Counts,
  LegalService,
} from "@/types/legal-services-montoring";
import { Metadata } from "next";
import { http } from "@/lib/http";
import Stats from "@/components/legal-services-montoring/stats";
import Attention from "@/components/legal-services-montoring/attention";
import FilterControl from "@/components/legal-services-montoring/filter-control";
import { Pagination } from "@/types/shared";
import DataPreview from "@/components/legal-services-montoring/data-preview";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Legal Services Monitoring",
  };
}

export default async function Page() {
  const { data } = await http.get<{
    summary: Summary;
    attention: AttentionType;
    counts: Counts;
    meta: Pagination;
    data: LegalService[];
  }>("/api/admin/legal-services-monitoring");

  console.log(data);
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <p className="text-[13px] text-gray-500">
        Track every accepted legal service from payment to payout. Services that
        need an admin are pinned to the top.
      </p>

      <Stats summary={data.summary} />

      <Attention attention={data.attention} />

      <FilterControl counts={data.counts} />

      <DataPreview legalServices={data.data} pagination={data.meta} />
    </div>
  );
}

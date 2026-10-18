import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import Stats from "@/components/case-monitoring/stats";
import { CaseMonitoring, Counts } from "@/types/case-monitoring";
import DataPreview from "@/components/case-monitoring/data-preview";
import { FilterControl } from "@/components/case-monitoring/filters-control";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  tab?: string;
  q?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("caseMonitoring") };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab, q } = await searchParams;
  const { data } = await http.get<{
    counts: Counts;
    data: CaseMonitoring[];
    meta: Pagination;
  }>("/api/admin/case-monitoring", {
    params: {
      tab: tab || "",
      q: q || "",
    },
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Stats counts={data.counts} />
      <FilterControl counts={data.counts} />
      <DataPreview cases={data.data} pagination={data.meta} />
    </div>
  );
}

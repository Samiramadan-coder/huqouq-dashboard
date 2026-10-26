import {
  Attention as AttentionType,
  Summary,
  Counts,
  LegalService,
  Filters,
  MonitoringTab,
  monitoringTabs,
} from "@/types/legal-services-montoring";
import { Metadata } from "next";
import { http } from "@/lib/http";
import Stats from "@/components/legal-services-montoring/stats";
import Attention from "@/components/legal-services-montoring/attention";
import FilterControl from "@/components/legal-services-montoring/filter-control";
import { Pagination } from "@/types/shared";
import DataPreview from "@/components/legal-services-montoring/data-preview";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  tab?: string;
  q?: string;
  lawyer_id?: string;
  service_type?: string;
  urgency?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("legalServicesMonitoring") };
}

// Unknown tab values are dropped instead of being forwarded to the API.
function parseTab(tab?: string): MonitoringTab | undefined {
  return monitoringTabs.find((value) => value === tab);
}

// Falls back to the first page when the URL holds an invalid page number.
function parsePage(page?: string): number {
  const value = Number(page);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab, q, lawyer_id, service_type, urgency, page } = await searchParams;
  const t = await getTranslations("LegalServicesMonitoring");

  const { data } = await http.get<{
    summary: Summary;
    attention: AttentionType;
    counts: Counts;
    meta: Pagination;
    data: LegalService[];
    filters: Filters;
  }>("/api/admin/legal-services-monitoring", {
    params: {
      // An empty tab keeps the API's default (all).
      tab: parseTab(tab) ?? "",
      q: q || "",
      lawyer_id: lawyer_id || "",
      service_type: service_type || "",
      urgency: urgency || "",
      page: parsePage(page),
    },
  });

  console.log(data);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <p className="text-[13px] text-gray-500">{t("description")}</p>

      <Stats summary={data.summary} />

      <Attention attention={data.attention} />

      <FilterControl counts={data.counts} filters={data.filters} />

      <DataPreview legalServices={data.data} pagination={data.meta} />
    </div>
  );
}

import type { Metadata } from "next";
import { http } from "@/lib/http";
import Stats from "@/components/case-monitoring/stats";
import {
  CaseMonitoringResponse,
  MonitoringTab,
  monitoringTabs,
} from "@/types/case-monitoring";
import DataPreview from "@/components/case-monitoring/data-preview";
import { FilterControl } from "@/components/case-monitoring/filters-control";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  tab?: string;
  q?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("caseMonitoring") };
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
  const { tab, q, page } = await searchParams;

  const { data } = await http.get<CaseMonitoringResponse>(
    "/api/admin/case-monitoring",
    {
      params: {
        // An empty tab keeps the API's default (all active).
        tab: parseTab(tab) ?? "",
        q: q || "",
        page: parsePage(page),
      },
    },
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Stats counts={data.counts} />
      <FilterControl counts={data.counts} />
      <DataPreview cases={data.data} pagination={data.meta} />
    </div>
  );
}

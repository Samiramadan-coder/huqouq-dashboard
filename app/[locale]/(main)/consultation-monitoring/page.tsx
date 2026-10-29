import {
  Consultation,
  ConsultationTab,
  Counts,
  FiltersType,
  SummaryType,
  consultationTabs,
} from "@/types/consultation-monitoring";

import { Metadata } from "next";
import { http } from "@/lib/http";
import { Link } from "@/i18n/navigation";
import { Pagination } from "@/types/shared";
import { getTranslations } from "next-intl/server";
import Summary from "@/components/consultation-monitoring/summary";
import Filters from "@/components/consultation-monitoring/filters";
import DataPreview from "@/components/consultation-monitoring/data-preview";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("consultationMonitoring") };
}

type SearchParams = {
  tab?: string;
  q?: string;
  type?: string;
  lawyer_id?: string;
  client_id?: string;
  sort?: string;
  page?: string;
};

// Unknown tab values are dropped instead of being forwarded to the API.
function parseTab(tab?: string): ConsultationTab | undefined {
  return consultationTabs.find((value) => value === tab);
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
  const { tab, q, type, lawyer_id, client_id, sort, page } = await searchParams;
  const t = await getTranslations("ConsultationMonitoring");

  const { data } = await http.get<{
    data: Consultation[];
    filters: FiltersType;
    summary: SummaryType;
    counts: Counts;
    meta: Pagination;
  }>("/api/admin/consultations", {
    params: {
      tab: parseTab(tab) ?? "",
      q: q || "",
      type: type || "",
      lawyer_id: lawyer_id || "",
      client_id: client_id || "",
      sort: sort || "",
      page: parsePage(page),
    },
    next: {
      tags: ["consultation-monitoring"],
    },
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <p className="text-[13px] text-gray-500 max-w-2xl">{t("description")}</p>

      <Summary summary={data.summary} />

      <Filters counts={data.counts} filters={data.filters} />

      <DataPreview data={data.data} pagination={data.meta} />

      <p className="text-[11.5px] text-gray-400">
        {t.rich("settingsNote", {
          link: (chunks) => (
            <Link className="underline hover:text-gray-600" href="/settings">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  );
}

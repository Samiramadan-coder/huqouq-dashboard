import type { Metadata } from "next";
import { http } from "@/lib/http";
import Stats from "@/components/lawyers/stats";
import Filters from "@/components/lawyers/filters";
import { getTranslations } from "next-intl/server";
import DataPreview from "@/components/lawyers/data-preview";
import { LawyersResponse, lawyerStatusFilters } from "@/types/lawyers";

type SearchParams = {
  page?: string;
  q?: string;
  status?: string;
  specialization?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("lawyers") };
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
  const { page, q, status, specialization } = await searchParams;

  const { data } = await http.get<LawyersResponse>("/api/admin/lawyers", {
    params: {
      page: parsePage(page),
      q: q ?? "",
      // Unknown values are dropped instead of being forwarded to the API.
      status: lawyerStatusFilters.find((value) => value === status) ?? "",
      specialization:
        specialization && /^\d+$/.test(specialization) ? specialization : "",
    },
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats counts={data.counts} />
      <Filters />
      <DataPreview lawyers={data.data} pagination={data.meta} />
    </div>
  );
}

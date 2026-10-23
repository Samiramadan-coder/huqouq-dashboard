import type { Metadata } from "next";
import { http } from "@/lib/http";
import Stats from "@/components/clients/stats";
import Filters from "@/components/clients/filters";
import { getTranslations } from "next-intl/server";
import DataPreview from "@/components/clients/data-preview";
import { ClientsResponse, clientStatusFilters } from "@/types/clients";

type SearchParams = {
  page?: string;
  q?: string;
  status?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("clients") };
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
  const { page, q, status } = await searchParams;

  const { data } = await http.get<ClientsResponse>("/api/admin/clients", {
    params: {
      page: parsePage(page),
      q: q ?? "",
      // Unknown values are dropped instead of being forwarded to the API.
      status: clientStatusFilters.find((value) => value === status) ?? "",
    },
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats counts={data.counts} />
      <Filters />
      <DataPreview clients={data.data} pagination={data.meta} />
    </div>
  );
}

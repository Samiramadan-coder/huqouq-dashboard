import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import Stats from "@/components/clients/stats";
import { Counts, Client } from "@/types/clients";
import Filters from "@/components/clients/filters";
import DataPreview from "@/components/clients/data-preview";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  page?: string;
  q?: string;
  status?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("clients") };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, status } = await searchParams;

  const { data } = await http.get<{
    counts: Counts;
    data: Client[];
    meta: Pagination;
  }>("/api/admin/clients", {
    params: {
      page: page ?? "1",
      q: q ?? "",
      status: status ?? "",
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

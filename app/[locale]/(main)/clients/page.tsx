import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import Stats from "@/components/clients/stats";
import { Counts, Client } from "@/types/clients";
import Filters from "@/components/clients/filters";
import DataPreview from "@/components/clients/data-preview";
import { Suspense } from "react";
import { LoaderPinwheel } from "lucide-react";

type SearchParams = {
  page?: string;
};

async function GetListOfClients({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const { data, ok } = await http.get<{
    counts: Counts;
    data: Client[];
    meta: Pagination;
  }>("/api/admin/clients", {
    params: {
      page: page ?? "1",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch clients data");
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats counts={data.counts} />
      <Filters />
      <DataPreview clients={data.data} pagination={data.meta} />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-4">
          <LoaderPinwheel className="animate-spin text-secondary" />
        </div>
      }
    >
      <GetListOfClients searchParams={searchParams} />
    </Suspense>
  );
}

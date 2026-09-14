import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { LoaderPinwheel } from "lucide-react";
import Stats from "@/components/lawyers/stats";
import { Counts, Lawyer } from "@/types/lawyers";
import Filters from "@/components/lawyers/filters";
import DataPreview from "@/components/lawyers/data-preview";

type SearchParams = {
  page?: string;
};

async function GetListOfLawyers({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const { data, ok } = await http.get<{
    counts: Counts;
    data: Lawyer[];
    meta: Pagination;
  }>("/api/admin/lawyers", {
    params: {
      page: page ?? "1",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyers data");
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats counts={data.counts} />
      <Filters />
      <DataPreview lawyers={data.data} pagination={data.meta} />
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
      <GetListOfLawyers searchParams={searchParams} />;
    </Suspense>
  );
}

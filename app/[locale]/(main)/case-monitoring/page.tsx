import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { LoaderPinwheel } from "lucide-react";
import { CaseMonitoring, Counts } from "@/types/case-monitoring";
import DataPreview from "@/components/case-monitoring/data-preview";
import { FilterControl } from "@/components/case-monitoring/filters-control";

type SearchParams = {
  tab?: string;
};

async function ListOfCases({ searchParams }: { searchParams: SearchParams }) {
  const { data, ok } = await http.get<{
    counts: Counts;
    data: CaseMonitoring[];
    meta: Pagination;
  }>("/api/admin/case-monitoring", {
    params: {
      tab: searchParams.tab || "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch data");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <FilterControl counts={data.counts} />
      <DataPreview cases={data.data} pagination={data.meta} />
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
      <ListOfCases searchParams={await searchParams} />
    </Suspense>
  );
}

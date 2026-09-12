import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import { CaseMonitoring, Counts } from "@/types/case-monitoring";
import { FilterControl } from "@/components/case-monitoring/filters-control";
import DataPreview from "@/components/case-monitoring/data-preview";

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

  console.log(data.data);
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
      fallback={<Spinner className="h-10 w-10 text-primary m-4 sm:m-4" />}
    >
      <ListOfCases searchParams={await searchParams} />
    </Suspense>
  );
}

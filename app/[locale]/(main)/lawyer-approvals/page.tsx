import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { LoaderPinwheel } from "lucide-react";
import { Counts, Lawyer } from "@/types/lawyer-approvals";
import DataPreview from "@/components/lawyer-approvals/data-preview";
import { FilterControl } from "@/components/lawyer-approvals/filter-control";

type SearchParams = {
  status?: keyof Counts;
  q?: string;
};

async function LawyersList({ searchParams }: { searchParams: SearchParams }) {
  const { data, ok } = await http.get<{
    data: Lawyer[];
    counts: Counts;
    meta: Pagination;
  }>("/api/admin/lawyer-approvals", {
    params: {
      status: searchParams.status ?? "pending",
      q: searchParams.q ?? "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyer approvals");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <FilterControl counts={data.counts} />
      <DataPreview
        lawyers={data.data}
        pagination={data.meta}
        tableStatus={searchParams.status ?? "pending"}
      />
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
      <LawyersList searchParams={await searchParams} />
    </Suspense>
  );
}

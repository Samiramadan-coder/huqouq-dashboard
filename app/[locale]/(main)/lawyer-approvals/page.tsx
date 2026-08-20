import { Suspense } from "react";
import { http } from "@/lib/http";
import { Spinner } from "@/components/ui/spinner";
import { Counts, Lawyer } from "@/types/lawyer-approvals";
import DataPreview from "@/components/lawyer-approvals/data-preview";
import { FilterControl } from "@/components/lawyer-approvals/filter-control";

type SearchParams = {
  status?: "pending" | "approved" | "rejected";
  q?: string;
};

async function LawyersList({ searchParams }: { searchParams: SearchParams }) {
  const { data, ok } = await http.get<{
    data: Lawyer[];
    counts: Counts;
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
      <DataPreview lawyers={data.data} />
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
      <LawyersList searchParams={await searchParams} />
    </Suspense>
  );
}

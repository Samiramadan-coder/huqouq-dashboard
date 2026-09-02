import { Suspense } from "react";
import { http } from "@/lib/http";
import { Spinner } from "@/components/ui/spinner";
import { CaseDetails, Counts } from "@/types/case-approvals";
import { FilterControl } from "@/components/case-approvals/filter-control";
import DataPreview from "@/components/case-approvals/data-preview";

type SearchParams = {
  status?: "pending_review" | "approved" | "rejected";
  q?: string;
  specialization_id?: string;
  urgency?: string;
};

async function CasesList({ searchParams }: { searchParams: SearchParams }) {
  const { data, ok } = await http.get<{
    data: CaseDetails[];
    counts: Counts;
  }>("/api/admin/case-approvals", {
    params: {
      status: searchParams.status ?? "pending_review",
      q: searchParams.q ?? "",
      specialization_id: searchParams.specialization_id ?? "",
      urgency: searchParams.urgency ?? "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyer approvals");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <FilterControl counts={data.counts} />
      <DataPreview cases={data.data} />
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
      <CasesList searchParams={await searchParams} />
    </Suspense>
  );
}

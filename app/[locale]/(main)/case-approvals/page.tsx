import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import { CaseDetails, Counts } from "@/types/case-approvals";
import DataPreview from "@/components/case-approvals/data-preview";
import { FilterControl } from "@/components/case-approvals/filter-control";

type SearchParams = {
  status?: "pending_review" | "approved" | "rejected";
  q?: string;
  specialization_id?: string;
  urgency?: string;
  page?: string;
};

async function CasesList({ searchParams }: { searchParams: SearchParams }) {
  const { page, q, specialization_id, status, urgency } = searchParams;

  const { data, ok } = await http.get<{
    data: CaseDetails[];
    counts: Counts;
    meta: Pagination;
  }>("/api/admin/case-approvals", {
    params: {
      specialization_id: specialization_id ?? "",
      status: status ?? "pending_review",
      urgency: urgency ?? "",
      page: page ?? "1",
      q: q ?? "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyer approvals");
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
      fallback={<Spinner className="h-10 w-10 text-primary m-4 sm:m-4" />}
    >
      <CasesList searchParams={await searchParams} />
    </Suspense>
  );
}

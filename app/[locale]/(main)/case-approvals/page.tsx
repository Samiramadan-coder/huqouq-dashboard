import {
  Case,
  CaseStatus,
  Counts,
  UrgencyCounts,
} from "@/types/case-approvals";
import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { LoaderPinwheel } from "lucide-react";
import DataPreview from "@/components/case-approvals/data-preview";
import { FilterControl } from "@/components/case-approvals/filter-control";

type SearchParams = {
  status?: CaseStatus;
  q?: string;
  specialization_id?: string;
  urgency?: string;
  page?: string;
};

async function CasesList({ searchParams }: { searchParams: SearchParams }) {
  const { page, q, specialization_id, status, urgency } = searchParams;

  const { data, ok } = await http.get<{
    data: Case[];
    counts: Counts;
    urgency_counts: UrgencyCounts;
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
      <FilterControl counts={data.counts} urgencyCounts={data.urgency_counts} />

      <DataPreview
        cases={data.data}
        pagination={data.meta}
        tableStatus={status ?? "pending_review"}
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
      <CasesList searchParams={await searchParams} />
    </Suspense>
  );
}

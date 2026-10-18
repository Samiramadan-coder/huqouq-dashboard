import type { Metadata } from "next";
import {
  Case,
  CaseStatus,
  Counts,
  UrgencyCounts,
} from "@/types/case-approvals";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import DataPreview from "@/components/case-approvals/data-preview";
import { FilterControl } from "@/components/case-approvals/filter-control";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  status?: CaseStatus;
  q?: string;
  specialization_id?: string;
  urgency?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("caseApprovals") };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, specialization_id, status, urgency } = await searchParams;

  const { data } = await http.get<{
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

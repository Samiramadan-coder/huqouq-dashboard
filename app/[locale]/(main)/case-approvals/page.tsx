import type { Metadata } from "next";
import {
  CaseApprovalsResponse,
  ReviewStatus,
  reviewStatuses,
  urgencies,
} from "@/types/case-approvals";
import { http } from "@/lib/http";
import DataPreview from "@/components/case-approvals/data-preview";
import { FilterControl } from "@/components/case-approvals/filter-control";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  status?: string;
  q?: string;
  specialization_id?: string;
  urgency?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("caseApprovals") };
}

// Falls back to the default tab when the URL holds an unknown status.
function parseStatus(status?: string): ReviewStatus {
  return reviewStatuses.find((value) => value === status) ?? "pending_review";
}

// Unknown urgency values are dropped instead of being forwarded to the API.
function parseUrgency(urgency?: string): string {
  return urgencies.find((value) => value === urgency) ?? "";
}

// Only numeric specialization ids are forwarded to the API.
function parseSpecializationId(id?: string): string {
  return id && /^\d+$/.test(id) ? id : "";
}

// Falls back to the first page when the URL holds an invalid page number.
function parsePage(page?: string): number {
  const value = Number(page);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, specialization_id, status, urgency } = await searchParams;
  const tableStatus = parseStatus(status);

  const { data } = await http.get<CaseApprovalsResponse>(
    "/api/admin/case-approvals",
    {
      params: {
        specialization_id: parseSpecializationId(specialization_id),
        status: tableStatus,
        urgency: parseUrgency(urgency),
        page: parsePage(page),
        q: q ?? "",
      },
    },
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <FilterControl counts={data.counts} urgencyCounts={data.urgency_counts} />

      <DataPreview
        cases={data.data}
        pagination={data.meta}
        tableStatus={tableStatus}
      />
    </div>
  );
}

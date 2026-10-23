import type { Metadata } from "next";
import { http } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import {
  ApprovalStatus,
  approvalStatuses,
  LawyerApprovalsResponse,
} from "@/types/lawyer-approvals";
import DataPreview from "@/components/lawyer-approvals/data-preview";
import { FilterControl } from "@/components/lawyer-approvals/filter-control";

type SearchParams = {
  status?: string;
  q?: string;
  page?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("lawyerApprovals") };
}

// Falls back to the default tab when the URL holds an unknown status.
function parseStatus(status?: string): ApprovalStatus {
  return approvalStatuses.find((value) => value === status) ?? "pending";
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
  const { status, q, page } = await searchParams;
  const tableStatus = parseStatus(status);

  const { data } = await http.get<LawyerApprovalsResponse>(
    "/api/admin/lawyer-approvals",
    {
      params: {
        status: tableStatus,
        page: parsePage(page),
        q: q ?? "",
      },
    },
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <FilterControl counts={data.counts} />

      <DataPreview
        lawyers={data.data}
        pagination={data.meta}
        tableStatus={tableStatus}
      />
    </div>
  );
}

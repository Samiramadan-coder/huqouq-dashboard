import type { Metadata } from "next";
import { http } from "@/lib/http";
import {
  LegalServicesApprovalsResponse,
  ReviewTab,
  reviewTabs,
} from "@/types/legal-services-approvals";
import Stats from "@/components/legal-services-approvals/stats";
import { FilterControl } from "@/components/legal-services-approvals/filters-control";
import DataPreview from "@/components/legal-services-approvals/data-preview";
import { getTranslations } from "next-intl/server";

type SearchParams = {
  page?: string;
  tab?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("legalServicesApprovals") };
}

// Unknown tab values are dropped instead of being forwarded to the API.
function parseTab(tab?: string): ReviewTab | undefined {
  return reviewTabs.find((value) => value === tab);
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
  const { page, tab } = await searchParams;
  const validTab = parseTab(tab);

  const { data } = await http.get<LegalServicesApprovalsResponse>(
    "/api/admin/legal-service-approvals",
    {
      params: {
        page: parsePage(page),
        // An empty tab keeps the API's default (pending review).
        tab: validTab ?? "",
      },
      next: {
        tags: ["legal-services-approvals"],
      },
    },
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Stats counts={data.counts} urgentCount={data.urgent_count} />
      <FilterControl counts={data.counts} />
      <DataPreview
        services={data.data}
        pagination={data.meta}
        tab={validTab ?? "pending_review"}
      />
    </div>
  );
}

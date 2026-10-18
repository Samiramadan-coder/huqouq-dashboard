import { http } from "@/lib/http";
import { Counts, LegalService } from "@/types/legal-services-approvals";
import { Pagination } from "@/types/shared";
import Stats from "@/components/legal-services-approvals/stats";
import { FilterControl } from "@/components/legal-services-approvals/filters-control";
import DataPreview from "@/components/legal-services-approvals/data-preview";

type SearchParams = {
  page?: string;
  tab?: keyof Counts;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, tab } = await searchParams;

  const { data } = await http.get<{
    counts: Counts;
    meta: Pagination;
    urgent_count: number;
    data: LegalService[];
  }>("/api/admin/legal-service-approvals", {
    params: {
      page: page || "1",
      tab: tab || "",
    },
    next: {
      tags: ["legal-services-approvals"],
    },
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Stats counts={data.counts} urgentCount={data.urgent_count} />
      <FilterControl counts={data.counts} />
      <DataPreview
        services={data.data}
        pagination={data.meta}
        tab={tab || "pending_review"}
      />
    </div>
  );
}

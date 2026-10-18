import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Counts, Lawyer } from "@/types/lawyer-approvals";
import DataPreview from "@/components/lawyer-approvals/data-preview";
import { FilterControl } from "@/components/lawyer-approvals/filter-control";

type SearchParams = {
  status?: keyof Counts;
  q?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, q } = await searchParams;

  const { data } = await http.get<{
    data: Lawyer[];
    counts: Counts;
    meta: Pagination;
  }>("/api/admin/lawyer-approvals", {
    params: {
      status: status ?? "pending",
      q: q ?? "",
    },
  });

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <FilterControl counts={data.counts} />

      <DataPreview
        lawyers={data.data}
        pagination={data.meta}
        tableStatus={status ?? "pending"}
      />
    </div>
  );
}

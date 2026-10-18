import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import Stats from "@/components/lawyers/stats";
import { Counts, Lawyer } from "@/types/lawyers";
import Filters from "@/components/lawyers/filters";
import DataPreview from "@/components/lawyers/data-preview";

type SearchParams = {
  page?: string;
  q?: string;
  status?: string;
  specialization?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, q, status, specialization } = await searchParams;

  const { data } = await http.get<{
    counts: Counts;
    data: Lawyer[];
    meta: Pagination;
  }>("/api/admin/lawyers", {
    params: {
      page: page ?? "1",
      q: q ?? "",
      status: status ?? "",
      specialization: specialization ?? "",
    },
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats counts={data.counts} />
      <Filters />
      <DataPreview lawyers={data.data} pagination={data.meta} />
    </div>
  );
}

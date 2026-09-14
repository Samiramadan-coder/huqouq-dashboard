import { http } from "@/lib/http";
import { Counts, Lawyer } from "@/types/lawyers";
import Stats from "@/components/lawyers/stats";
import Filters from "@/components/lawyers/filters";
import DataPreview from "@/components/lawyers/data-preview";
import { Pagination } from "@/types/shared";

export default async function Page() {
  const { data, ok } = await http.get<{
    counts: Counts;
    data: Lawyer[];
    meta: Pagination;
  }>("/api/admin/lawyers");

  if (!ok) {
    throw new Error("Failed to fetch lawyers data");
  }

  console.log(data);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats counts={data.counts} />
      <Filters />
      <DataPreview lawyers={data.data} pagination={data.meta} />
    </div>
  );
}

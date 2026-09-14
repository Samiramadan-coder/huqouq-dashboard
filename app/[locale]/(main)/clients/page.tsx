import DataPreview from "@/components/clients/data-preview";
import Filters from "@/components/clients/filters";
import Stats from "@/components/clients/stats";
import { http } from "@/lib/http";
import { Counts } from "@/types/clients";

export default async function Page() {
  const { data, ok } = await http.get<{
    counts: Counts;
  }>("/api/admin/clients");

  if (!ok) {
    throw new Error("Failed to fetch lawyers data");
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats counts={data.counts} />
      <Filters />
      <DataPreview clients={[]} />
    </div>
  );
}

import DataPreview from "@/components/clients/data-preview";
import Filters from "@/components/clients/filters";
import Stats from "@/components/clients/stats";

export default function Page() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats />

      <Filters />

      <DataPreview clients={[]} />
    </div>
  );
}

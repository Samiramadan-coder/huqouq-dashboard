import DataPreview from "@/components/lawyers/data-preview";
import Filters from "@/components/lawyers/filters";
import Stats from "@/components/lawyers/stats";

export default function Page() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats />

      <Filters />

      <DataPreview lawyers={[]} />
    </div>
  );
}

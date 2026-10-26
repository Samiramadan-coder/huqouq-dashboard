import { cn } from "@/lib/utils";
import { MonitoringTab } from "@/types/legal-services-montoring";

const statusClassNames: Record<MonitoringTab, string> = {
  all: "bg-gray-50 text-gray-700 border-gray-200",
  has_offers: "bg-violet-50 text-violet-700 border-violet-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-amber-50 text-amber-700 border-amber-200",
  revision: "bg-orange-50 text-orange-700 border-orange-200",
  dispute: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

// Status pill; the label text carries the meaning, color only reinforces it.
export default function StatusBadge({
  status,
  label,
}: {
  status: MonitoringTab;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        statusClassNames[status],
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

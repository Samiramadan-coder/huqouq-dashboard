import { cn } from "@/lib/utils";
import { ConsultationStatus } from "@/types/consultation-monitoring";

const statusClassNames: Record<ConsultationStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  live: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  needs_new_time: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
};

// Status pill; the label text carries the meaning, color only reinforces it.
export default function StatusBadge({
  status,
  label,
  className,
}: {
  status: ConsultationStatus;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        // Statuses the dashboard doesn't know yet fall back to neutral.
        statusClassNames[status] ?? "bg-gray-50 text-gray-700 border-gray-200",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ClientStatus } from "@/types/clients";

const toneClassNames: Record<ClientStatus, string> = {
  active: "bg-emerald-50 text-emerald-800 border-emerald-100",
  inactive: "bg-amber-50 text-amber-800 border-amber-100",
};

// Client status badge; the label text carries the meaning, color only reinforces it.
export default function ClientStatusBadge({
  status,
  label,
}: {
  status: ClientStatus;
  label: string;
}) {
  return (
    <Badge
      className={cn(
        "text-[11px] font-normal px-3 py-2.5",
        toneClassNames[status] ?? "bg-primary/5 text-primary border-primary/20",
      )}
    >
      {label}
    </Badge>
  );
}

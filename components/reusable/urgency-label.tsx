import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TriangleAlert, Zap } from "lucide-react";

export default function UrgencyBadge({
  urgency,
  urgency_label,
}: {
  urgency: string;
  urgency_label: string;
}) {
  return (
    <Badge
      className={cn(
        "h-6 text-[11px] border",
        urgency === "urgent" && "bg-amber-50 text-amber-700 border-amber-200",
        urgency === "very_urgent" &&
          "bg-destructive/10 text-destructive border-destructive/60",
        urgency === "standard" &&
          "bg-background text-primary/60 border-primary/20",
      )}
    >
      {urgency === "urgent" && <TriangleAlert />}
      {urgency === "very_urgent" && <Zap />}
      {urgency_label}
    </Badge>
  );
}

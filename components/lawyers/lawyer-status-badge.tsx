import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { ProfileStatus } from "@/types/lawyers";

const toneClassNames: Record<ProfileStatus, string> = {
  approved: "bg-emerald-50 text-emerald-800 border-emerald-100",
  incomplete: "bg-amber-50 text-amber-800 border-amber-100",
  needs_fix: "bg-destructive/10 text-amber-800 border-amber-100",
  in_review: "bg-primary/5 text-primary border-primary/20",
};

// Lawyer status badge; the label text carries the meaning, color only reinforces it.
export default function LawyerStatusBadge({
  profileStatus,
  label,
}: {
  profileStatus: ProfileStatus;
  label: string;
}) {
  return (
    <Badge
      className={cn(
        "text-[11px] font-normal px-3 py-2.5",
        toneClassNames[profileStatus] ?? toneClassNames.in_review,
      )}
    >
      {label}
    </Badge>
  );
}

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { LegalServiceStatus } from "@/types/legal-services-approvals";

const tones = {
  // Used in the list table.
  strong: {
    base: "text-xs py-3 px-3 font-normal",
    pending_review: "bg-amber-100 text-amber-800 border-amber-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  },
  // Used in the details sheet.
  soft: {
    base: "text-[11px] py-2.5 px-3",
    pending_review: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    in_progress: "bg-gray-50 text-gray-700 border-gray-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  },
} satisfies Record<string, Record<LegalServiceStatus | "base", string>>;

// Status badge; the label text carries the meaning, color only reinforces it.
export default function ServiceStatusBadge({
  status,
  label,
  tone = "soft",
}: {
  status: LegalServiceStatus;
  label: string;
  tone?: keyof typeof tones;
}) {
  return (
    <Badge className={cn(tones[tone].base, tones[tone][status])}>{label}</Badge>
  );
}

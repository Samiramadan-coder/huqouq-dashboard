import { useTranslations } from "next-intl";
import { Counts } from "@/types/legal-services-approvals";
import { CircleCheck, CircleX, Clock, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export default function Stats({
  counts,
  urgentCount,
}: {
  counts: Counts;
  urgentCount: number;
}) {
  const t = useTranslations("LegalServicesApprovals");

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-50">
            <Clock className="size-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">
              {t("pending_review")}
            </p>
            <p className="text-[22px] font-bold leading-tight text-amber-800">
              {counts.pending_review}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50">
            <CircleCheck className="size-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">
              {t("approved")}
            </p>
            <p className="text-[22px] font-bold leading-tight text-emerald-700">
              {counts.approved}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-red-50">
            <CircleX className="size-4 text-red-500" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">
              {t("rejected")}
            </p>
            <p className="text-[22px] font-bold leading-tight text-orange-700">
              {counts.rejected}
            </p>
          </div>
        </div>
      </div>

      {urgentCount > 0 && (
        <Alert className="bg-orange-50 border-orange-200 ">
          <TriangleAlert className="text-orange-800!" />
          <AlertDescription className="text-orange-800">
            {urgentCount} {t("legal_services_approvals_stats_alert")}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

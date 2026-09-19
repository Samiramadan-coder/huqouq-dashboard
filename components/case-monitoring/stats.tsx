import { Counts } from "@/types/case-monitoring";
import { Activity, Briefcase, Clock, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Stats({ counts }: { counts: Counts }) {
  const t = useTranslations("CaseMonitoring");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
        <Briefcase className="size-4 text-primary/40" />
        <div>
          <p className="text-[11px] text-gray-400 font-medium">
            {t("all_active")}
          </p>
          <p className="text-[22px] font-bold leading-tight text-primary">
            {counts.all_active}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
        <Activity className="size-4 text-emerald-700" />
        <div>
          <p className="text-[11px] text-gray-400 font-medium">
            {t("in_progress")}
          </p>
          <p className="text-[22px] font-bold leading-tight text-emerald-700">
            {counts.in_progress}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
        <Clock className="size-4 text-orange-400" />
        <div>
          <p className="text-[11px] text-gray-400 font-medium">
            {t("pending_closure")}
          </p>
          <p className="text-[22px] font-bold leading-tight text-orange-700">
            {counts.pending_closure}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
        <TriangleAlert className="size-4 text-orange-400" />
        <div>
          <p className="text-[11px] text-gray-400 font-medium">
            {t("needs_attention")}
          </p>
          <p className="text-[22px] font-bold leading-tight text-orange-700">
            {counts.needs_attention}
          </p>
        </div>
      </div>
    </div>
  );
}

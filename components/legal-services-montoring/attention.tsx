import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Attention as AttentionType } from "@/types/legal-services-montoring";

export default function Attention({ attention }: { attention: AttentionType }) {
  const t = useTranslations("LegalServicesMonitoring.Attention");

  if (attention.total === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4 flex items-start gap-3">
      <TriangleAlert className="text-amber-600 shrink-0 size-4 mt-0.5" />
      <div className="space-y-3 min-w-0">
        <p className="text-sm font-semibold text-amber-900">
          {t("title", { count: attention.total })}
        </p>
        <div className="flex flex-wrap gap-2">
          {attention.by_flag.map(({ value, label, count }) => (
            <span
              key={value}
              className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs text-amber-900"
            >
              <span className="font-semibold">{count}</span> · {label}
            </span>
          ))}
        </div>
        <p className="text-xs text-amber-800">{t("description")}</p>
      </div>
    </div>
  );
}

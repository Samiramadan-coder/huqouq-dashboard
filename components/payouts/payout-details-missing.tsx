import { TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function PayoutDetailsMissing() {
  const t = await getTranslations("Payouts.payoutDetailsMissing");

  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
      <TriangleAlert className="text-amber-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-[13px] font-semibold text-amber-800">
          {t("title")}
        </p>
        <p className="text-[12px] text-amber-700 mt-0.5">
          {t("description")}
        </p>
      </div>
    </div>
  );
}

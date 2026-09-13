import { formatDate } from "@/lib/utils";
import { CaseMonitoring } from "@/types/case-monitoring";
import { Banknote, MapPin, Paperclip } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function DetailsContent({
  caseItem,
}: {
  caseItem: CaseMonitoring;
}) {
  const t = await getTranslations("CaseMonitoring");

  const lastActivity = [
    caseItem.closed_at,
    caseItem.fee_paid_at,
    caseItem.closure_requested_at,
    caseItem.hired_at,
    caseItem.reviewed_at,
    caseItem.payment?.paid_at,
    caseItem.created_at,
  ]
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  return (
    <>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <DetailItem
          label={t("Details.caseId")}
          value={`#case-${caseItem.id}`}
        />
        <DetailItem
          label={t("Details.category")}
          value={caseItem.specialization.name}
        />
        <DetailItem
          label={t("Details.posted")}
          value={formatDate(caseItem.created_at)}
        />
        <DetailItem
          label={t("Details.hiredDate")}
          value={caseItem.hired_at ? formatDate(caseItem.hired_at) : "-"}
        />
        <DetailItem
          label={t("Details.location")}
          icon={<MapPin className="size-3.5 text-gray-400" />}
          value={caseItem.city}
        />
        <DetailItem
          label={t("Details.budget")}
          icon={<Banknote className="size-3.5 text-gray-400" />}
          value={
            caseItem.budget_disclosed
              ? `${caseItem.currency} ${caseItem.budget_min} - ${caseItem.budget_max}`
              : t("Details.notDisclosed")
          }
        />
        <DetailItem
          label={t("Table.agreedPrice")}
          value={
            caseItem.payment
              ? `${caseItem.payment.currency} ${caseItem.payment.agreed_amount}`
              : "-"
          }
        />
        <DetailItem
          label={t("Table.lastActivity")}
          value={lastActivity ? timeAgo(lastActivity) : "-"}
        />
      </div>

      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {t("Details.description")}
        </p>
        <p className="p-3 rounded-lg bg-gray-50 text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
          {caseItem.description}
        </p>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {t("Details.attachedDocuments")}
        </p>
        {caseItem.documents_count > 0 ? (
          <div className="flex items-center gap-2 text-[13px] text-gray-700">
            <Paperclip className="size-3.5 text-gray-400" />
            {t("Details.documentsAttached", {
              count: caseItem.documents_count,
            })}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400">
            {t("Details.noDocuments")}
          </p>
        )}
      </div>
    </>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-gray-800">
        {icon}
        {value}
      </div>
    </div>
  );
}

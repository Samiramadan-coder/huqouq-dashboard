import {
  CaseMonitoring,
  DATE_FORMAT,
  formatMoney,
  getLastActivity,
} from "@/types/case-monitoring";
import { Banknote, MapPin, Paperclip } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";

export default async function DetailsContent({
  caseItem,
}: {
  caseItem: CaseMonitoring;
}) {
  const t = await getTranslations("CaseMonitoring");
  const format = await getFormatter();
  const lastActivity = getLastActivity(caseItem);

  return (
    <>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
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
          value={format.dateTime(new Date(caseItem.created_at), DATE_FORMAT)}
        />
        <DetailItem
          label={t("Details.hiredDate")}
          value={
            caseItem.hired_at
              ? format.dateTime(new Date(caseItem.hired_at), DATE_FORMAT)
              : "-"
          }
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
              ? `${formatMoney(format, caseItem.budget_min, caseItem.currency)} - ${formatMoney(format, caseItem.budget_max, caseItem.currency)}`
              : t("Details.notDisclosed")
          }
        />
        <DetailItem
          label={t("Table.agreedPrice")}
          value={
            caseItem.payment
              ? formatMoney(
                  format,
                  caseItem.payment.agreed_amount,
                  caseItem.payment.currency,
                )
              : "-"
          }
        />
        <DetailItem
          label={t("Table.lastActivity")}
          value={lastActivity ? format.relativeTime(lastActivity) : "-"}
        />
      </dl>

      <div>
        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {t("Details.description")}
        </h3>
        <p className="p-4 rounded-lg bg-gray-50 text-[13px] text-gray-700 leading-relaxed whitespace-pre-line wrap-break-word">
          {caseItem.description}
        </p>
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
          {t("Details.attachedDocuments")}
        </h3>
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
      <dt className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </dt>
      <dd className="flex items-center gap-1.5 text-[13px] font-medium text-gray-700">
        {icon}
        {value}
      </dd>
    </div>
  );
}

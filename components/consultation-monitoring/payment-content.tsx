import { useAppFormatter } from "@/hooks/use-app-formatter";
import { DATE_FORMAT, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Fields, Section } from "../legal-services-montoring/section";
import {
  ConsultationDetailsType,
  TIME_FORMAT,
  TIME_ZONE,
} from "@/types/consultation-monitoring";

// The API doesn't send a currency for consultations; fees are always in AED.
const CURRENCY = "AED";

const payoutClassNames: Record<
  ConsultationDetailsType["payout"]["status"],
  string
> = {
  not_started: "text-amber-700",
  ready: "text-blue-700",
  paid: "text-emerald-700",
};

export default function PaymentContent({
  payment,
  payout,
}: {
  payment: ConsultationDetailsType["payment"];
  payout: ConsultationDetailsType["payout"];
}) {
  const t = useTranslations("ConsultationMonitoring.Details.Payment");
  const format = useAppFormatter();
  const locale = useLocale();

  const money = (amount: number) => formatMoney(amount, CURRENCY, locale);
  // "19 Oct 2026 · 13:00" in UAE time, like the rest of the sheet.
  const formatDateTime = (date: string) =>
    `${format.dateTime(new Date(date), { ...DATE_FORMAT, timeZone: TIME_ZONE })} · ${format.dateTime(new Date(date), TIME_FORMAT)}`;

  return (
    <>
      <Section title={t("payment")}>
        {payment ? (
          <Fields
            fields={[
              {
                label: t("amountPaid"),
                value: (
                  <span className="text-[15px] font-bold text-primary">
                    {money(payment.amount)}
                  </span>
                ),
              },
              {
                label: t("paymentDate"),
                value: formatDateTime(payment.paid_at),
              },
              {
                label: t("reference"),
                value: <span className="font-mono">{payment.reference}</span>,
              },
              { label: t("method"), value: payment.method ?? "-" },
            ]}
          />
        ) : (
          <p className="text-[13px] text-gray-400">{t("noPayment")}</p>
        )}
      </Section>

      {payment && (
        <Section title={t("feeBreakdown")}>
          <dl className="divide-y divide-gray-100 text-[13px]">
            <div className="flex items-center justify-between gap-4 pb-2.5">
              <dt className="text-gray-600">{t("consultationFee")}</dt>
              <dd className="text-gray-800">{money(payment.amount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-gray-600">
                {t("platformFee", {
                  percentage: format.number(payment.fee_percentage, {
                    maximumFractionDigits: 2,
                  }),
                })}
              </dt>
              <dd className="text-gray-800">{money(payment.platform_fee)}</dd>
            </div>
            {payment.refund_amount > 0 && (
              <div className="flex items-center justify-between gap-4 py-2.5">
                <dt className="text-gray-600">
                  {payment.refunded_at
                    ? t("refundedOn", {
                        date: formatDateTime(payment.refunded_at),
                      })
                    : t("refunded")}
                </dt>
                <dd className="text-red-600">
                  -{money(payment.refund_amount)}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 pt-2.5">
              <dt className="text-gray-600">{t("lawyerEarning")}</dt>
              <dd className="font-bold text-primary">
                {money(payment.lawyer_amount)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[11px] text-gray-400">{t("feeNote")}</p>
        </Section>
      )}

      <Section title={t("payout")}>
        <p
          className={cn(
            "text-[14px] font-semibold",
            payoutClassNames[payout.status] ?? "text-gray-800",
          )}
        >
          {payout.label}
        </p>
        {payout.detail && (
          <p className="mt-1 text-[12px] text-gray-500">{payout.detail}</p>
        )}
      </Section>
    </>
  );
}

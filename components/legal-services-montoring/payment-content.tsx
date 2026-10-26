import { cn } from "@/lib/utils";
import { Fields, Section } from "./section";
import { useFormatter, useTranslations } from "next-intl";
import { formatMoney } from "@/types/case-monitoring";
import {
  DATE_TIME_FORMAT,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

// The API doesn't send a currency for legal services; fees are always in AED.
const CURRENCY = "AED";

type Payment = NonNullable<LegalServiceDetails["payment"]>;

const escrowClassNames: Record<string, string> = {
  held: "bg-amber-50 text-amber-700 border-amber-200",
  released: "bg-green-50 text-green-700 border-green-200",
  refunded: "bg-red-50 text-red-700 border-red-200",
};

const payoutDescriptionKeys = {
  not_started: "notStarted",
  ready: "ready",
  paid: "paid",
} as const satisfies Record<Payment["payout"]["status"], string>;

export default function PaymentContent({
  payment,
}: {
  payment: LegalServiceDetails["payment"];
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Payment");
  const format = useFormatter();

  if (!payment) {
    return <p className="text-[13px] text-gray-400">{t("noPayment")}</p>;
  }

  const money = (amount: number) => formatMoney(format, amount, CURRENCY);
  const formatDateTime = (date: string | null) =>
    date ? format.dateTime(new Date(date), DATE_TIME_FORMAT) : "-";

  const breakdown = [
    { label: t("agreedFee"), value: money(payment.amount) },
    {
      label: t("platformFee", {
        percentage: format.number(payment.fee_percentage, {
          maximumFractionDigits: 2,
        }),
      }),
      value: money(payment.platform_fee),
    },
    ...(payment.refunded_amount > 0
      ? [
          {
            label: t("refunded", {
              date: formatDateTime(payment.refunded_at),
            }),
            value: `-${money(payment.refunded_amount)}`,
          },
        ]
      : []),
  ];

  const { payout } = payment;

  return (
    <div className="space-y-4">
      <Section
        title={t("payment")}
        action={
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              escrowClassNames[payment.escrow] ??
                "bg-gray-50 text-gray-700 border-gray-200",
            )}
          >
            {payment.escrow_label}
          </span>
        }
      >
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
            { label: t("paymentDate"), value: formatDateTime(payment.paid_at) },
            {
              label: t("reference"),
              value: <span className="font-mono">{payment.reference}</span>,
            },
            { label: t("method"), value: t(`providers.${payment.provider}`) },
          ]}
        />
      </Section>

      <Section title={t("feeBreakdown")}>
        <dl className="divide-y divide-gray-100 text-[13px]">
          {breakdown.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 py-2.5 first:pt-0"
            >
              <dt className="text-gray-600">{label}</dt>
              <dd className="text-gray-800">{value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-gray-600">{t("lawyerPayout")}</dt>
            <dd className="font-bold text-primary">
              {money(payment.lawyer_amount)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-[11px] text-gray-400">{t("feeNote")}</p>
      </Section>

      <Section title={t("payout")}>
        <p className="text-[14px] font-semibold text-gray-800">
          {payout.label}
        </p>
        <p className="mt-1 text-[12px] text-gray-500">
          {t(`payoutDescription.${payoutDescriptionKeys[payout.status]}`, {
            date: formatDateTime(payout.paid_at ?? payout.ready_at),
            reference: payout.reference ?? "-",
          })}
        </p>
      </Section>
    </div>
  );
}

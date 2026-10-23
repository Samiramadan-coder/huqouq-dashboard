import BankDetails from "./bank-details";
import { formatMoney } from "./format";
import LawyerAvatar from "./lawyer-avatar";
import { TriangleAlert } from "lucide-react";
import ConfirmPayout from "./confirm-payout";
import { TableCell, TableRow } from "../ui/table";
import type { ByLawyerRow } from "@/types/payouts";
import { getFormatter, getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";

export default async function ByLawyerDataPreview({
  data,
  currency,
}: {
  data: ByLawyerRow[];
  currency: string;
}) {
  const t = await getTranslations("Payouts.byLawyer");
  const format = await getFormatter();
  const money = (value: number) => formatMoney(format, value, currency);

  const columns: DataTableColumn[] = [
    { label: t("lawyer") },
    { label: t("pending") },
    { label: t("readyForPayout") },
    { label: t("lsPending") },
    { label: t("lsReady") },
    { label: t("totalPaid") },
    { label: t("bankDetails") },
    { label: t("action") },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("lawyers")}
      rowsCount={data.length}
    >
      {data.length > 0 ? (
        data.map((row) => (
          <TableRow key={row.lawyer.id} className="border-gray-100">
            <TableCell className="px-5 py-3">
              <div className="flex items-center gap-3">
                <LawyerAvatar lawyer={row.lawyer} />
                <span className="text-[13px] text-gray-800">
                  {row.lawyer.name}
                </span>
                {row.payout_details_missing && (
                  <>
                    <TriangleAlert
                      aria-hidden
                      className="size-3.5 text-amber-500"
                    />
                    <span className="sr-only">
                      {t("payoutDetailsMissing")}
                    </span>
                  </>
                )}
              </div>
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] text-orange-600">
              <bdi>{money(row.pending)}</bdi>
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] font-semibold text-secondary">
              <bdi>{money(row.ready)}</bdi>
            </TableCell>

            <TableCell className="px-5 py-3">
              <div>
                <p className="text-[10px] text-gray-400">{t("legalSvc")}</p>
                <p className="text-[13px] text-orange-600">
                  <bdi>{money(row.ls_pending)}</bdi>
                </p>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <div>
                <p className="text-[10px] text-gray-400">{t("legalSvc")}</p>
                <p className="text-[13px] font-semibold text-secondary">
                  <bdi>{money(row.ls_ready)}</bdi>
                </p>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] text-gray-400">
              <bdi>{money(row.total_paid)}</bdi>
            </TableCell>

            <TableCell className="px-5 py-3">
              {row.masked_iban ? (
                <BankDetails
                  lawyerId={row.lawyer.id}
                  lawyerName={row.lawyer.name}
                  maskedIban={row.masked_iban}
                />
              ) : (
                <span className="text-destructive text-xs font-semibold">
                  {t("notProvided")}
                </span>
              )}
            </TableCell>

            <TableCell className="px-5 py-3">
              <ConfirmPayout
                lawyer={row.lawyer}
                amount={money(row.ready)}
                maskedIban={row.masked_iban}
                canProcess={row.can_process_payout}
              />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            className="px-5 py-3 text-gray-400 text-[13px]"
            colSpan={columns.length}
          >
            {t("noDataAvailable")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

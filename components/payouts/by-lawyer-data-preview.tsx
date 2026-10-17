import { getTranslations } from "next-intl/server";
import { Download, TriangleAlert } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { Button } from "../ui/button";
import BankDetails from "./bank-details";
import LawyerAvatar from "./lawyer-avatar";
import type { ByLawyerData } from "@/types/payouts";

export default async function ByLawyerDataPreview({
  data,
}: {
  data: ByLawyerData[];
}) {
  const t = await getTranslations("Payouts.byLawyer");

  const formatAmount = (value: number) =>
    t("amount", { value: value.toLocaleString("en-US") });

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
    <DataTable columns={columns} countUnit={t("lawyers")} rowsCount={data.length}>
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
                  <TriangleAlert
                    className="size-3.5 text-amber-500"
                    aria-label={t("payoutDetailsMissing")}
                  />
                )}
              </div>
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] text-orange-600">
              {formatAmount(row.pending)}
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] font-semibold text-secondary">
              {formatAmount(row.ready)}
            </TableCell>

            <TableCell className="px-5 py-3">
              <LegalServiceAmount
                value={row.ls_pending}
                label={t("legalSvc")}
                formatted={formatAmount(row.ls_pending)}
                className="text-orange-600"
              />
            </TableCell>

            <TableCell className="px-5 py-3">
              <LegalServiceAmount
                value={row.ls_ready}
                label={t("legalSvc")}
                formatted={formatAmount(row.ls_ready)}
                className="font-semibold text-secondary"
              />
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] text-gray-400">
              {formatAmount(row.total_paid)}
            </TableCell>

            <TableCell className="px-5 py-3">
              {row.iban ? (
                <BankDetails iban={row.iban} accountName={row.account_name} />
              ) : (
                <span className="text-[13px] text-gray-300">—</span>
              )}
            </TableCell>

            <TableCell className="px-5 py-3">
              <Button
                size="sm"
                disabled={!row.can_process_payout}
                className="bg-primary text-white text-[12px] font-semibold"
              >
                <Download className="size-3.5" />
                {t("processPayout")}
              </Button>
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

function LegalServiceAmount({
  value,
  label,
  formatted,
  className,
}: {
  value: number;
  label: string;
  formatted: string;
  className: string;
}) {
  if (!value) return <span className="text-[13px] text-gray-300">—</span>;

  return (
    <div>
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className={`text-[13px] ${className}`}>{formatted}</p>
    </div>
  );
}

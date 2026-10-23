import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import LawyerAvatar from "./lawyer-avatar";
import { TableCell, TableRow } from "../ui/table";
import { DATE_FORMAT, formatMoney } from "./format";
import { getFormatter, getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import type { AllTransactionsData, TransactionStatus } from "@/types/payouts";

const empty = <span className="text-[13px] text-gray-300">—</span>;

const statusClassNames: Record<TransactionStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  ready: "bg-secondary/20 text-[#8a6d1f]",
  paid: "bg-green-100 text-green-700",
};

export default async function AllTransactionsDataPreview({
  transactions,
}: {
  transactions: AllTransactionsData[];
}) {
  const t = await getTranslations("Payouts.allTransactions");
  const format = await getFormatter();
  const date = (value: string) => (
    <time dateTime={value}>{format.dateTime(new Date(value), DATE_FORMAT)}</time>
  );

  const columns: DataTableColumn[] = [
    { label: t("date") },
    { label: t("lawyer") },
    { label: t("type") },
    { label: t("client") },
    { label: t("amount") },
    { label: t("status") },
    { label: t("becomesReadyOn") },
    { label: t("paidDate") },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("transactions")}
      rowsCount={transactions.length}
    >
      {transactions.length > 0 ? (
        transactions.map((row) => (
          <TableRow key={row.id} className="border-gray-100">
            <TableCell className="px-5 py-3 text-[13px] text-gray-600">
              {date(row.date)}
            </TableCell>

            <TableCell className="px-5 py-3">
              <div className="flex items-center gap-2">
                <LawyerAvatar lawyer={row.lawyer} />
                <span className="text-[13px] text-gray-800">
                  {row.lawyer.name}
                </span>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <TypeBadge row={row} />
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] text-gray-600">
              {row.client.first_name}
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] font-semibold text-gray-900">
              <bdi>{formatMoney(format, row.amount, row.currency)}</bdi>
            </TableCell>

            <TableCell className="px-5 py-3">
              <Badge
                className={cn(
                  "text-[11px] font-medium rounded-full",
                  statusClassNames[row.status],
                )}
              >
                {row.status_label}
              </Badge>
            </TableCell>

            <TableCell className="px-5 py-3 text-[13px] text-orange-600">
              {row.status === "pending" && row.becomes_ready_on
                ? date(row.becomes_ready_on)
                : empty}
            </TableCell>

            <TableCell className="px-5 py-3">
              {row.paid_date ? (
                <div>
                  <p className="text-[13px] text-green-700">
                    {date(row.paid_date)}
                  </p>
                  {row.paid_reference && (
                    <p className="font-mono text-[10px] text-gray-400 mt-0.5 break-all">
                      {row.paid_reference}
                    </p>
                  )}
                </div>
              ) : (
                empty
              )}
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

function TypeBadge({ row }: { row: AllTransactionsData }) {
  const type = row.type.toLowerCase();
  const isLegalService = type.includes("legal");

  const className = isLegalService
    ? "bg-purple-50 text-purple-700"
    : type.includes("emergency")
      ? "bg-red-50 text-red-700"
      : "bg-blue-50 text-blue-700";

  const label =
    isLegalService && row.service_type_label
      ? `${row.type_label} · ${row.service_type_label}`
      : row.type_label;

  return (
    <Badge className={cn("text-[11px] font-normal rounded-full", className)}>
      {label}
    </Badge>
  );
}

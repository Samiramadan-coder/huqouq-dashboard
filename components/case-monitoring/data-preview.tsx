import { cn } from "@/lib/utils";
import CaseDetails from "./case-details";
import { Pagination } from "@/types/shared";
import { TriangleAlert } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import CaseStatusLabel from "../reusable/case-status-label";
import { getFormatter, getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import {
  CaseMonitoring,
  DATE_FORMAT,
  formatMoney,
  getLastActivity,
} from "@/types/case-monitoring";

export default async function DataPreview({
  cases,
  pagination,
}: {
  cases: CaseMonitoring[];
  pagination: Pagination;
}) {
  const t = await getTranslations("CaseMonitoring");
  const format = await getFormatter();

  const columns: DataTableColumn[] = [
    { label: t("Table.case") },
    { label: t("Table.client") },
    { label: t("Table.lawyer") },
    { label: t("Table.status") },
    { label: t("Table.hired") },
    { label: t("Table.lastActivity") },
    { label: t("Table.agreedPrice") },
    { label: t("Table.actions") },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("Table.client")}
      rowsCount={cases.length}
      pagination={pagination}
    >
      {cases.length ? (
        cases.map((caseItem) => {
          const lastActivity = getLastActivity(caseItem);
          const needsAttention = caseItem.attention_flags.length > 0;

          return (
            <TableRow
              key={caseItem.id}
              className={cn(
                "border-gray-100",
                needsAttention && "bg-amber-50/30",
              )}
            >
              <TableCell className="px-5 py-3">
                <div className="flex items-start gap-4">
                  {needsAttention && (
                    <>
                      <TriangleAlert
                        aria-hidden
                        className="text-amber-600 size-3"
                      />
                      <span className="sr-only">{t("needs_attention")}</span>
                    </>
                  )}

                  <div>
                    <p className="font-medium text-gray-800 truncate leading-snug text-[13px]">
                      {caseItem.title}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {caseItem.specialization.name}
                    </p>
                    {caseItem.attention_flags.map((flag) => (
                      <p
                        key={flag.value}
                        className="text-[10px] text-amber-600 mt-0.5"
                      >
                        {flag.label}
                      </p>
                    ))}
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-white">
                      {caseItem.client.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="whitespace-nowrap text-gray-700 font-medium text-[11px]">
                    {caseItem.client.name}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-secondary text-white">
                      {caseItem.hired_lawyer.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="whitespace-nowrap text-gray-700 font-medium text-[11px]">
                    {caseItem.hired_lawyer.name}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-5 py-3">
                <CaseStatusLabel status={caseItem.status} />
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-500 text-[13px]">
                  {caseItem.hired_at
                    ? format.dateTime(new Date(caseItem.hired_at), DATE_FORMAT)
                    : "-"}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-500 text-[13px]">
                  {lastActivity ? format.relativeTime(lastActivity) : "-"}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-700 text-[13px]">
                  {formatMoney(
                    format,
                    caseItem.accepted_offer.amount,
                    caseItem.currency,
                  )}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <CaseDetails caseItem={caseItem} />
              </TableCell>
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="text-center py-4 text-sm text-gray-500"
          >
            {t("Table.noCases")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

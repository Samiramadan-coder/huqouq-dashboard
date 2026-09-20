import CaseDetails from "./case-details";
import { Pagination } from "@/types/shared";
import { cn, formatDate, timeAgo } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CaseMonitoring } from "@/types/case-monitoring";
import CaseStatusLabel from "../reusable/case-status-label";
import { DataTable, DataTableColumn } from "../reusable/data-table";

export default async function DataPreview({
  cases,
  pagination,
}: {
  cases: CaseMonitoring[];
  pagination: Pagination;
}) {
  const t = await getTranslations("CaseMonitoring");

  const columns = (): DataTableColumn[] => [
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
      columns={columns()}
      countUnit={t("Table.client")}
      rowsCount={cases.length}
      pagination={pagination}
    >
      {cases.length ? (
        cases.map((caseItem) => {
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
            <TableRow
              key={caseItem.id}
              className={cn(
                "border-gray-100",
                caseItem.attention_flags.length > 0 && "bg-amber-50/30",
              )}
            >
              <TableCell className="px-5 py-3">
                <div className="flex items-start gap-4">
                  {caseItem.attention_flags.length > 0 && (
                    <TriangleAlert className="text-amber-600 size-3" />
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
                  {formatDate(caseItem.hired_at || "")}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-500 text-[13px]">
                  {timeAgo(lastActivity)}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-700 text-[13px]">
                  {caseItem.currency} {caseItem.accepted_offer.amount}
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
            colSpan={columns().length}
            className="text-center py-4 text-sm text-gray-500"
          >
            {t("Table.noCases")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

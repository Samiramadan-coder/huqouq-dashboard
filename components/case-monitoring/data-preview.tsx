import Image from "next/image";
import { Badge } from "../ui/badge";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/types/shared";
import ReViewBtn from "../reusable/review-btn";
import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import UrgencyBadge from "../reusable/urgency-label";
import { Case, CaseStatus } from "@/types/case-approvals";
import CaseStatusLabel from "../reusable/case-status-label";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { CaseMonitoring } from "@/types/case-monitoring";

export default async function DataPreview({
  cases,
  pagination,
}: {
  cases: CaseMonitoring[];
  pagination: Pagination;
}) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("CaseMonitoring");

  const columns = (): DataTableColumn[] => [
    { label: t("Table.case") },
    { label: t("Table.client") },
    { label: t("Table.lawyer") },
    { label: t("Table.status") },
    { label: t("Table.hired") },
    { label: t("Table.lastActivity") },
    { label: t("Table.agreedPrice") },
  ];

  return (
    <DataTable
      columns={columns()}
      countUnit={t("Table.client")}
      rowsCount={cases.length}
      pagination={pagination}
    >
      {cases.length ? (
        cases.map((caseItem) => (
          <TableRow key={caseItem.id}>
            <TableCell className="px-5 py-3">
              <div>
                <p className="font-medium text-gray-800 truncate leading-snug text-[13px]">
                  {caseItem.title}
                </p>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <p className="whitespace-nowrap text-gray-500 font-medium text-[13px]">
                {caseItem.client.name}
              </p>
            </TableCell>

            <TableCell className="px-5 py-3">
              <p className="whitespace-nowrap text-gray-500 font-medium text-[13px]">
                {caseItem.hired_lawyer.name}
              </p>
            </TableCell>

            <TableCell className="px-5 py-3">
              <CaseStatusLabel status={caseItem.status} />
            </TableCell>

            <TableCell className="px-5 py-3">
              <p className="whitespace-nowrap text-gray-500 font-medium text-[13px]">
                {formatDate(caseItem.hired_at || "")}
              </p>
            </TableCell>

            <TableCell className="px-5 py-3">-</TableCell>

            <TableCell className="px-5 py-3">
              <p className="whitespace-nowrap text-gray-700 font-medium text-[13px]">
                {tCommon("AED")} {caseItem.accepted_offer.amount}
              </p>
            </TableCell>
          </TableRow>
        ))
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

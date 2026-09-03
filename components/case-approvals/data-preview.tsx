import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/case-approvals";
import UrgencyBadge from "../reusable/urgency-label";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { Pagination } from "@/types/shared";
import PaginationTemplate from "../reusable/pagination-temlate";

export default async function DataPreview({
  cases,
  pagination,
}: {
  cases: CaseDetails[];
  pagination: Pagination;
}) {
  const t = await getTranslations("CaseApprovals");

  const columns = (): DataTableColumn[] => [
    { label: t("Table.client") },
    { label: t("Table.title") },
    { label: t("Table.category") },
    { label: t("Table.urgency") },
    { label: t("Table.submitted") },
    { label: "" },
  ];

  return (
    <>
      <DataTable
        columns={columns()}
        countUnit={t("Table.client")}
        rowsCount={cases.length}
      >
        {cases.length ? (
          cases.map((caseItem) => (
            <TableRow key={caseItem.id}>
              <TableCell className="px-5 py-3">
                <div className="flex items-center gap-2">
                  {caseItem.client.photo_url ? (
                    <div className="w-8 h-8">
                      <Image
                        src={caseItem.client.photo_url}
                        alt={caseItem.client.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full grid place-content-center font-bold">
                      {caseItem.client.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <p className="text-gray-700 text-[13px]">
                    {caseItem.client.name}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="font-semibold text-gray-800 leading-snug line-clamp-2 text-[13px]">
                  {caseItem.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {caseItem.documents_count} {t("Table.documents")}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <Badge className="text-primary bg-primary/5 border border-primary/20 text-[11px]">
                  {caseItem.specialization.name}
                </Badge>
              </TableCell>

              <TableCell className="px-5 py-3">
                <UrgencyBadge
                  urgency={caseItem.urgency}
                  urgency_label={caseItem.urgency_label}
                />
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="text-xs text-gray-400 truncate">
                  {formatDate(caseItem.created_at)}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <Link href={`/case-approvals/${caseItem.id}`}>
                  <Button
                    variant="outline"
                    className="border-amber-200 bg-white rounded-sm text-amber-600 hover:text-white hover:bg-amber-600 text-xs"
                  >
                    {t("Actions.review")}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center py-4 text-sm text-gray-500"
            >
              {t("Table.noCases")}
            </TableCell>
          </TableRow>
        )}
      </DataTable>

      <PaginationTemplate
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
      />
    </>
  );
}

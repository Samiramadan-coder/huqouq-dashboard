import Image from "next/image";
import { Badge } from "../ui/badge";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/types/shared";
import ReViewBtn from "../reusable/review-btn";
import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { CaseDetails, CaseStatus } from "@/types/case-approvals";
import UrgencyBadge from "../reusable/urgency-label";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { CircleCheck, CircleX } from "lucide-react";

export default async function DataPreview({
  cases,
  pagination,
  tableStatus,
}: {
  cases: CaseDetails[];
  pagination: Pagination;
  tableStatus: CaseStatus;
}) {
  console.log(tableStatus);
  const t = await getTranslations("CaseApprovals");

  const columns = (): DataTableColumn[] => [
    { label: t("Table.client") },
    { label: t("Table.title") },
    { label: t("Table.category") },
    { label: t("Table.urgency") },
    ...(tableStatus === "rejected"
      ? [{ label: t("Table.RejectionReason") }]
      : []),
    {
      label:
        tableStatus === "pending_review"
          ? t("Table.submitted")
          : t("Table.decisionDate"),
    },
    ...(tableStatus === "pending_review"
      ? []
      : [{ label: t("Table.ReviewedBy") }]),
    { label: "" },
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

            {tableStatus === "rejected" && (
              <TableCell className="px-5 py-3">
                <p className="text-gray-500 text-[12px] max-w-100 whitespace-normal wrap-break-word">
                  {caseItem.rejection_reason}
                </p>
              </TableCell>
            )}

            <TableCell className="px-5 py-3">
              <p className="text-xs text-gray-400 truncate">
                {formatDate(
                  tableStatus === "pending_review"
                    ? caseItem.created_at
                    : caseItem.reviewed_at || "",
                )}
              </p>
            </TableCell>

            {tableStatus !== "pending_review" && (
              <TableCell className="px-5 py-3">
                <p className="text-gray-500 text-[12px]">-</p>
              </TableCell>
            )}

            <TableCell className="px-5 py-3">
              {tableStatus === "pending_review" && (
                <Link href={`/case-approvals/${caseItem.id}`}>
                  <ReViewBtn />
                </Link>
              )}

              {tableStatus === "approved" && (
                <Badge className="bg-green-50 text-green-700 border border-green-200 text-[11px]">
                  <CircleCheck className="size-3" />
                  {t("approved")}
                </Badge>
              )}

              {tableStatus === "rejected" && (
                <Badge className="bg-red-50 text-red-600 border border-red-200 text-[11px]">
                  <CircleX className="size-3" />
                  {t("rejected")}
                </Badge>
              )}
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
  );
}

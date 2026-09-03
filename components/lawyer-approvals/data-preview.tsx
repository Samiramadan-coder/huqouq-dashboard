import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Pagination } from "@/types/shared";
import ReViewBtn from "../reusable/review-btn";
import { Lawyer, TableStatus } from "@/types/lawyer-approvals";
import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { CircleCheck, CircleX } from "lucide-react";

export default async function DataPreview({
  lawyers,
  pagination,
  tableStatus,
}: {
  lawyers: Lawyer[];
  pagination: Pagination;
  tableStatus: TableStatus;
}) {
  const t = await getTranslations("LawyerApprovals");

  const columns = (): DataTableColumn[] => [
    { label: t("Table.lawyer") },
    { label: t("Table.accountType") },
    { label: t("Table.specializations") },
    ...(tableStatus === "rejected"
      ? [{ label: t("Table.RejectionReason") }]
      : []),
    {
      label:
        tableStatus === "pending"
          ? t("Table.submitted")
          : t("Table.decisionDate"),
    },
    ...(tableStatus === "pending" ? [] : [{ label: t("Table.ReviewedBy") }]),
    { label: "" },
  ];

  return (
    <DataTable
      columns={columns()}
      countUnit={t("Table.lawyer")}
      rowsCount={lawyers.length}
      currentPage={pagination.current_page}
      totalPages={pagination.last_page}
    >
      {lawyers.length ? (
        lawyers.map((lawyer) => (
          <TableRow key={lawyer.id}>
            <TableCell className="px-5 py-3">
              <div>
                <div></div>
                <div>
                  <p className="text-gray-800 font-semibold text-[13px]">
                    {lawyer.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {lawyer.email}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <Badge className="bg-background text-primary border border-primary/10 text-[11px]">
                {lawyer.lawyer_profile.account_type}
              </Badge>
            </TableCell>

            <TableCell className="px-5 py-3">
              <div className="space-x-1">
                {lawyer.lawyer_profile.specializations.map((spec) => (
                  <Badge
                    key={spec.id}
                    className="bg-background text-primary border border-primary/10 text-[11px]"
                  >
                    {spec.name}
                  </Badge>
                ))}
              </div>
            </TableCell>

            {tableStatus === "rejected" && (
              <TableCell className="px-5 py-3">
                <p className="text-gray-500 text-[12px] max-w-100 whitespace-normal wrap-break-word">
                  {lawyer.lawyer_profile.rejection_reason}
                </p>
              </TableCell>
            )}

            <TableCell className="px-5 py-3">
              <p className="text-xs text-gray-400 truncate">
                {formatDate(
                  lawyer.lawyer_profile.profile_status === "in_review"
                    ? lawyer.lawyer_profile.submitted_at
                    : lawyer.lawyer_profile.reviewed_at || "",
                )}
              </p>
            </TableCell>

            {tableStatus !== "pending" && (
              <TableCell className="px-5 py-3">
                <p className="text-gray-500 text-[12px]">-</p>
              </TableCell>
            )}

            <TableCell className="px-5 py-3">
              {tableStatus === "pending" && (
                <Link href={`/lawyer-approvals/${lawyer.id}`}>
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
            colSpan={5}
            className="text-center py-4 text-sm text-gray-500"
          >
            {t("Table.noApplications")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

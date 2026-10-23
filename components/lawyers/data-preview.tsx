import { Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Lawyer } from "@/types/lawyers";
import { Pagination } from "@/types/shared";
import LawyerDetails from "./lawyer-details";
import { TableCell, TableRow } from "../ui/table";
import LawyerStatusBadge from "./lawyer-status-badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getFormatter, getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { DATE_FORMAT, maskPhone } from "../people-directory/format";

export default async function DataPreview({
  lawyers,
  pagination,
}: {
  lawyers: Lawyer[];
  pagination: Pagination;
}) {
  const t = await getTranslations("Lawyers.table");
  const format = await getFormatter();

  const columns: DataTableColumn[] = [
    { label: t("lawyer") },
    { label: t("emailPhone") },
    { label: t("status") },
    { label: t("specializations") },
    { label: t("rating") },
    { label: t("cases") },
    { label: t("joined") },
    { label: t("actions") },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("lawyers")}
      rowsCount={pagination.total}
      pagination={pagination}
    >
      {lawyers.length > 0 ? (
        lawyers.map((lawyer) => (
          <TableRow key={lawyer.id} className="border-gray-100">
            <TableCell className="px-5 py-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-white">
                    {lawyer.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-800 font-semibold text-[13px]">
                    {lawyer.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {lawyer.account_type_label}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <p className="text-gray-600 text-[13px]">
                <bdi dir="ltr">{lawyer.email || "-"}</bdi>
              </p>
              {/* Full number is only shown in the details sheet. */}
              <p className="text-[11px] text-gray-400 mt-1">
                <bdi dir="ltr">{maskPhone(lawyer.phone) || "-"}</bdi>
              </p>
            </TableCell>

            <TableCell className="px-5 py-3">
              <LawyerStatusBadge
                profileStatus={lawyer.profile_status}
                label={lawyer.status_label}
              />
            </TableCell>

            <TableCell className="px-5 py-3">
              <div className="flex items-center gap-1">
                {lawyer.specializations.map((spec) => (
                  <Badge
                    key={spec.id}
                    className="bg-primary/6 text-primary text-[10px] font-medium rounded"
                  >
                    {spec.name}
                  </Badge>
                ))}
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <div
                className="flex items-center gap-1"
                aria-label={
                  lawyer.rating
                    ? t("ratingSummary", {
                        rating: format.number(lawyer.rating),
                        count: lawyer.reviews_count,
                      })
                    : t("noReviews")
                }
              >
                <Star
                  aria-hidden
                  className="size-3 fill-secondary text-secondary"
                />
                <span className="text-gray-700 font-semibold text-[13px]">
                  {lawyer.rating ? format.number(lawyer.rating) : "-"}
                </span>
                <span className="text-gray-400 text-[11px]">
                  ({lawyer.reviews_count})
                </span>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <span className="text-gray-600 font-semibold text-[13px]">
                {lawyer.cases_count}
              </span>
            </TableCell>

            <TableCell className="px-5 py-3">
              <span className="text-gray-400 text-[12px]">
                {format.dateTime(new Date(lawyer.joined_at), DATE_FORMAT)}
              </span>
            </TableCell>

            <TableCell className="px-5 py-3">
              <LawyerDetails lawyerId={lawyer.id} name={lawyer.name} />
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

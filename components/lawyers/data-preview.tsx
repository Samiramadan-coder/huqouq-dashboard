import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";

import { Lawyer } from "@/types/lawyers";
import { Pagination } from "@/types/shared";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default async function DataPreview({
  lawyers,
  pagination,
}: {
  lawyers: Lawyer[];
  pagination: Pagination;
}) {
  const t = await getTranslations("Lawyers.table");

  const columns: DataTableColumn[] = [
    { label: t("lawyer") },
    { label: t("emailPhone") },
    { label: t("status") },
    { label: t("specializations") },
    { label: t("rating") },
    { label: t("cases") },
    { label: t("joined") },
    { label: "" },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("lawyers")}
      rowsCount={pagination.total}
      pagination={pagination}
    >
      {lawyers.length > 0 ? (
        lawyers.map((lawyer, index) => (
          <TableRow key={index} className="border-gray-100">
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
              <p className="text-gray-600 text-[13px]">{lawyer.email}</p>
              <p className="text-[11px] text-gray-400 mt-1">{lawyer.phone}</p>
            </TableCell>

            <TableCell className="px-5 py-3">
              <ProfileStatusLabel
                profileStatus={lawyer.profile_status}
                profileStatusLabel={lawyer.status_label}
              />
            </TableCell>

            <TableCell className="px-5 py-3">
              <div className="flex items-center gap-1">
                {lawyer.specializations.map((spec, i) => (
                  <Badge
                    key={i}
                    className="bg-primary/6 text-primary text-[10px] font-medium rounded"
                  >
                    {spec.name}
                  </Badge>
                ))}
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-secondary text-secondary" />
                <span className="text-gray-700 font-semibold text-[13px]">
                  {lawyer.rating || "-"}
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
                {formatDate(lawyer.joined_at)}
              </span>
            </TableCell>

            <TableCell className="px-5 py-3">-</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            className="px-5 py-3 text-gray-400 text-[13px]"
            colSpan={8}
          >
            {t("noDataAvailable")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

function ProfileStatusLabel({
  profileStatus,
  profileStatusLabel,
}: {
  profileStatus: Lawyer["profile_status"];
  profileStatusLabel: string;
}) {
  switch (profileStatus) {
    case "approved":
      return (
        <Badge className="text-[11px] font-normal bg-emerald-50 text-emerald-800 border-emerald-100 px-3 py-2.5">
          {profileStatusLabel}
        </Badge>
      );

    case "incomplete":
      return (
        <Badge className="text-[11px] font-normal bg-amber-50 text-amber-800 border-amber-100 px-3 py-2.5">
          {profileStatusLabel}
        </Badge>
      );

    case "needs_fix":
      return (
        <Badge className="text-[11px] font-normal bg-destructive/10 text-amber-800 border-amber-100 px-3 py-2.5">
          {profileStatusLabel}
        </Badge>
      );

    default:
      return (
        <Badge className="text-[11px] font-normal bg-primary/5 text-primary border-primary/20 px-3 py-2.5">
          {profileStatusLabel}
        </Badge>
      );
  }
}

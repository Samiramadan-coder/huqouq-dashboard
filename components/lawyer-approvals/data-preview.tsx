import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Lawyer } from "@/types/lawyer-approvals";
import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { Link } from "@/i18n/navigation";

export default async function DataPreview({ lawyers }: { lawyers: Lawyer[] }) {
  const t = await getTranslations("LawyerApprovals");

  const columns = (): DataTableColumn[] => [
    { label: t("Table.lawyer") },
    { label: t("Table.accountType") },
    { label: t("Table.specializations") },
    { label: t("Table.submitted") },
    { label: "" },
  ];

  return (
    <DataTable
      columns={columns()}
      countUnit={t("Table.lawyer")}
      rowsCount={lawyers.length}
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
            <TableCell className="px-5 py-3">
              <p className="text-xs text-gray-400 truncate">
                {formatDate(lawyer.lawyer_profile.submitted_at)}
              </p>
            </TableCell>
            <TableCell className="px-5 py-3">
              <Link href={`/lawyer-approvals/${lawyer.id}`}>
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

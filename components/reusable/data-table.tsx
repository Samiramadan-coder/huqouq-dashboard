import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import { Pagination } from "@/types/shared";
import PaginationTemplate from "./pagination-template";

export type DataTableColumn = {
  label: string;
  className?: string;
};

interface DataTableProps {
  columns: DataTableColumn[];
  rowsCount: number;
  countUnit: string;
  children: React.ReactNode;
  onCheckboxChange?: (checked: boolean) => void;
  pagination?: Pagination;
}

export function DataTable({
  columns,
  rowsCount,
  countUnit,
  children,
  onCheckboxChange,
  pagination,
}: DataTableProps) {
  const t = useTranslations("Common");

  return (
    <div className="w-full min-w-0 border border-border rounded-lg overflow-hidden">
      <Table className="[&_thead_th:first-child]:w-8 [&_thead_th:first-child]:px-3 [&_tbody_td:first-child]:w-8 [&_tbody_td:first-child]:px-3">
        <TableHeader>
          <TableRow>
            {onCheckboxChange && (
              <TableHead className="w-8 px-3 py-4">
                <Checkbox onCheckedChange={onCheckboxChange} />
              </TableHead>
            )}

            {columns.map((column) => (
              <TableHead
                key={column.label}
                className={cn(
                  "px-5 py-3 uppercase text-[11px] font-semibold text-gray-400",
                  column.className,
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">{children}</TableBody>

        <TableFooter className="bg-white">
          <TableRow>
            <TableCell className="px-4 py-3 text-[13px] text-muted-foreground">
              {!pagination ? (
                <p>
                  {t("Showing")}{" "}
                  <span className="font-semibold text-black">{rowsCount}</span>{" "}
                  {countUnit}
                </p>
              ) : (
                <p>
                  {t("Showing")}{" "}
                  <span className="font-semibold text-black">
                    {pagination.from}
                  </span>{" "}
                  {t("To")}{" "}
                  <span className="font-semibold text-black">
                    {pagination.to}
                  </span>{" "}
                  {t("Of")}{" "}
                  <span className="font-semibold text-black">
                    {pagination.total}
                  </span>{" "}
                  {countUnit}
                </p>
              )}
            </TableCell>

            <TableCell className="px-4 py-3" colSpan={columns.length}>
              {pagination && (
                <PaginationTemplate
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                />
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

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
import { useAppFormatter } from "@/hooks/use-app-formatter";
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
  const format = useAppFormatter();

  return (
    <div className="w-full min-w-0 border border-gray-200 rounded-lg overflow-hidden">
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

        <TableFooter className="bg-white border-gray-100">
          <TableRow>
            <TableCell className="px-4 py-3 text-[11px] text-gray-400">
              {!pagination ? (
                <p>
                  {t("showingCount", {
                    count: format.number(rowsCount),
                    unit: countUnit,
                  })}
                </p>
              ) : (
                // One message per locale keeps real spaces and word order.
                <p>
                  {t("showingRange", {
                    from: format.number(pagination.from),
                    to: format.number(pagination.to),
                    total: format.number(pagination.total),
                    unit: countUnit,
                  })}
                </p>
              )}
            </TableCell>

            {/* The count cell takes the first column; spanning exactly the rest
                avoids adding a phantom column that widens the table. */}
            <TableCell
              className="px-4 py-3"
              colSpan={columns.length - (onCheckboxChange ? 0 : 1)}
            >
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

import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";

export default async function DataPreview({ lawyers }: { lawyers: [] }) {
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
    <DataTable columns={columns} countUnit={t("lawyers")} rowsCount={1}>
      {lawyers.length > 0 ? (
        lawyers.map((_, index) => (
          <TableRow key={index} className="border-gray-100">
            <TableCell className="px-5 py-3">-</TableCell>
            <TableCell className="px-5 py-3">-</TableCell>
            <TableCell className="px-5 py-3">-</TableCell>
            <TableCell className="px-5 py-3">-</TableCell>
            <TableCell className="px-5 py-3">-</TableCell>
            <TableCell className="px-5 py-3">-</TableCell>
            <TableCell className="px-5 py-3">-</TableCell>
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

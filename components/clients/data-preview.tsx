import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";

export default async function DataPreview({ clients }: { clients: [] }) {
  const t = await getTranslations("Clients.table");

  const columns: DataTableColumn[] = [
    { label: t("client") },
    { label: t("emailPhone") },
    { label: t("status") },
    { label: t("cases") },
    { label: t("consults") },
    { label: t("sos") },
    { label: t("joined") },
    { label: "" },
  ];

  return (
    <DataTable columns={columns} countUnit={t("clients")} rowsCount={1}>
      {clients.length > 0 ? (
        clients.map((_, index) => (
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

import { Client } from "@/types/clients";
import { Pagination } from "@/types/shared";
import ClientDetails from "./client-details";
import { TableCell, TableRow } from "../ui/table";
import ClientStatusBadge from "./client-status-badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getFormatter, getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { DATE_FORMAT, maskPhone } from "../people-directory/format";

export default async function DataPreview({
  clients,
  pagination,
}: {
  clients: Client[];
  pagination: Pagination;
}) {
  const t = await getTranslations("Clients");
  const format = await getFormatter();

  const columns: DataTableColumn[] = [
    { label: t("table.client") },
    { label: t("table.emailPhone") },
    { label: t("table.status") },
    { label: t("table.cases") },
    { label: t("table.consults") },
    { label: t("table.sos") },
    { label: t("table.joined") },
    { label: t("table.actions") },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("table.clients")}
      rowsCount={pagination.total}
      pagination={pagination}
    >
      {clients.length > 0 ? (
        clients.map((client) => (
          <TableRow key={client.id} className="border-gray-100">
            <TableCell className="px-5 py-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-white">
                    {client.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-800 font-semibold text-[13px]">
                    {client.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {client.status_label}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="px-5 py-3">
              <p className="text-gray-600 text-[13px]">
                <bdi dir="ltr">{client.email || "-"}</bdi>
              </p>
              {/* Full number is only shown in the details sheet. */}
              <p className="text-[11px] text-gray-400 mt-1">
                <bdi dir="ltr">{maskPhone(client.phone) || "-"}</bdi>
              </p>
            </TableCell>

            <TableCell className="px-5 py-3">
              <ClientStatusBadge
                status={client.status}
                label={client.status_label}
              />
            </TableCell>

            <TableCell className="px-5 py-3">
              <span className="text-gray-600 font-semibold text-[13px]">
                {client.cases_count}{" "}
                <span className="text-[11px] text-destructive">
                  ({t("rejectedCount", { count: client.rejected_cases_count })})
                </span>
              </span>
            </TableCell>

            <TableCell className="px-5 py-3">
              {client.consultations_count}
            </TableCell>

            <TableCell className="px-5 py-3">-</TableCell>

            <TableCell className="px-5 py-3">
              <span className="text-gray-400 text-[12px]">
                {format.dateTime(new Date(client.joined_at), DATE_FORMAT)}
              </span>
            </TableCell>

            <TableCell className="px-5 py-3">
              <ClientDetails clientId={client.id} name={client.name} />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            className="px-5 py-3 text-gray-400 text-[13px]"
            colSpan={columns.length}
          >
            {t("table.noDataAvailable")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

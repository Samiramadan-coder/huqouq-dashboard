import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";

import { Client } from "@/types/clients";
import { Pagination } from "@/types/shared";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import ClientDetails from "./client-details";

export default async function DataPreview({
  clients,
  pagination,
}: {
  clients: Client[];
  pagination: Pagination;
}) {
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
    <DataTable
      columns={columns}
      countUnit={t("clients")}
      rowsCount={pagination.total}
      pagination={pagination}
    >
      {clients.length > 0 ? (
        clients.map((client, index) => (
          <TableRow key={index} className="border-gray-100">
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
              <p className="text-gray-600 text-[13px]">{client.email}</p>
              <p className="text-[11px] text-gray-400 mt-1">{client.phone}</p>
            </TableCell>

            <TableCell className="px-5 py-3">
              <ProfileStatusLabel
                status={client.status}
                statusLabel={client.status_label}
              />
            </TableCell>

            <TableCell className="px-5 py-3">
              <span className="text-gray-600 font-semibold text-[13px]">
                {client.cases_count}{" "}
                <span className="text-[11px] text-destructive">
                  ({client.rejected_cases_count} rej)
                </span>
              </span>
            </TableCell>

            <TableCell className="px-5 py-3">-</TableCell>

            <TableCell className="px-5 py-3">-</TableCell>

            <TableCell className="px-5 py-3">
              <span className="text-gray-400 text-[12px]">
                {formatDate(client.joined_at)}
              </span>
            </TableCell>

            <TableCell className="px-5 py-3">
              <ClientDetails client={client} />
            </TableCell>
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

// Component to display the status of a client's profile with a badge.
export function ProfileStatusLabel({
  status,
  statusLabel,
}: {
  status: Client["status"];
  statusLabel: string;
}) {
  switch (status) {
    case "active":
      return (
        <Badge className="text-[11px] font-normal bg-emerald-50 text-emerald-800 border-emerald-100 px-3 py-2.5">
          {statusLabel}
        </Badge>
      );

    case "inactive":
      return (
        <Badge className="text-[11px] font-normal bg-amber-50 text-amber-800 border-amber-100 px-3 py-2.5">
          {statusLabel}
        </Badge>
      );

    default:
      return (
        <Badge className="text-[11px] font-normal bg-primary/5 text-primary border-primary/20 px-3 py-2.5">
          {statusLabel}
        </Badge>
      );
  }
}

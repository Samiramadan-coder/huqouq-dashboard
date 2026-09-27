import { Badge } from "../ui/badge";
import { cookies } from "next/headers";
import { formatDate } from "@/lib/utils";
import { Pagination } from "@/types/shared";
import ServiceDetails from "./service-details";
import { TableCell, TableRow } from "../ui/table";
import { getTranslations } from "next-intl/server";
import UrgencyBadge from "../reusable/urgency-label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Counts, LegalService } from "@/types/legal-services-approvals";
import { DataTable, DataTableColumn } from "../reusable/data-table";

export default async function DataPreview({
  services,
  pagination,
  tab,
}: {
  services: LegalService[];
  pagination: Pagination;
  tab: keyof Counts;
}) {
  const cookiesStore = await cookies();
  const t = await getTranslations("LegalServicesApprovals");

  const columns = (): DataTableColumn[] => [
    { label: t("Table.serviceType") },
    { label: t("Table.client") },
    { label: t("Table.Description") },
    { label: t("Table.urgency") },
    { label: t("Table.submitted") },
    ...(tab !== "pending_review" ? [{ label: t("Table.status") }] : []),
    { label: t("Table.actions") },
  ];

  return (
    <DataTable
      columns={columns()}
      countUnit={t("Table.client")}
      rowsCount={services.length}
      pagination={pagination}
    >
      {services.length ? (
        services.map((service) => {
          return (
            <TableRow key={service.id} className="border-gray-100">
              <TableCell className="px-5 py-3">
                <Badge className="bg-primary/5 text-primary border-primary/10 text-xs py-3 px-3">
                  {service.service_type_label}
                </Badge>
              </TableCell>

              <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-white">
                      {service.client.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="whitespace-nowrap text-gray-700 font-medium text-[11px]">
                    {service.client.name}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="truncate text-gray-600 text-[13px] max-w-80">
                  {service.description}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <UrgencyBadge
                  urgency={service.urgency}
                  urgency_label={service.urgency_label}
                />
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-500 text-[13px]">
                  {formatDate(service.submitted_at || "")}
                </p>
              </TableCell>

              {tab !== "pending_review" && (
                <TableCell className="px-5 py-3">
                  <ServiceStatus
                    status={service.status}
                    status_label={service.status_label}
                  />
                </TableCell>
              )}

              <TableCell className="px-5 py-3">
                <ServiceDetails
                  legalServiceId={service.id}
                  token={cookiesStore.get("token")?.value || ""}
                />
              </TableCell>
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns().length}
            className="text-center py-4 text-sm text-gray-500"
          >
            {t("Table.noServices")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

function ServiceStatus({
  status,
  status_label,
}: {
  status: LegalService["status"];
  status_label: string;
}) {
  switch (status) {
    case "approved":
      return (
        <Badge className="text-xs py-3 px-3 font-normal bg-green-100 text-green-800 border-green-200">
          {status_label}
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="text-xs py-3 px-3 font-normal bg-yellow-100 text-yellow-800 border-yellow-200">
          {status_label}
        </Badge>
      );

    case "rejected":
      return (
        <Badge className="text-xs py-3 px-3 font-normal bg-red-100 text-red-800 border-red-200">
          {status_label}
        </Badge>
      );

    // case "pending_review":
    //   return (
    //     <Badge className="text-xs py-3 px-3 font-normal bg-gray-100 text-gray-800 border-gray-200">
    //       {status_label}
    //     </Badge>
    //   );

    default:
      return null;
  }
}

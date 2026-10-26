import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pagination } from "@/types/shared";
import { TableCell, TableRow } from "../ui/table";
import { ArrowRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getFormatter, getTranslations } from "next-intl/server";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { DATE_FORMAT, formatMoney } from "@/types/case-monitoring";
import { LegalService, MonitoringTab } from "@/types/legal-services-montoring";

// The API doesn't send a currency for legal services; fees are always in AED.
const CURRENCY = "AED";

const statusClassNames: Record<MonitoringTab, string> = {
  all: "bg-gray-50 text-gray-700 border-gray-200",
  has_offers: "bg-violet-50 text-violet-700 border-violet-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-amber-50 text-amber-700 border-amber-200",
  revision: "bg-orange-50 text-orange-700 border-orange-200",
  dispute: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

function Person({
  name,
  photoUrl,
  fallbackClassName,
  children,
}: {
  name: string;
  photoUrl: string;
  fallbackClassName: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-5">
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback
          className={cn("text-white text-[10px]", fallbackClassName)}
        >
          {name[0]}
        </AvatarFallback>
      </Avatar>
      <p className="whitespace-nowrap text-gray-700 text-[13px]">{name}</p>
      {children}
    </div>
  );
}

export default async function DataPreview({
  legalServices,
  pagination,
}: {
  legalServices: LegalService[];
  pagination: Pagination;
}) {
  const t = await getTranslations("LegalServicesMonitoring.Table");
  const format = await getFormatter();

  const columns: DataTableColumn[] = [
    { label: t("service") },
    { label: t("clientLawyer") },
    { label: t("agreedFee") },
    { label: t("status") },
    { label: t("due") },
    { label: t("round") },
    { label: t("lastActivity") },
    { label: t("actions") },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("services")}
      rowsCount={legalServices.length}
      pagination={pagination}
    >
      {legalServices.length ? (
        legalServices.map((service) => {
          const needsAttention = service.attention.length > 0;
          const isInactive = service.attention.some(
            (attention) => attention.value === "inactive",
          );

          return (
            <TableRow
              key={service.id}
              className={cn(
                "border-gray-100",
                needsAttention &&
                  "bg-amber-50/30 shadow-[inset_3px_0_0_var(--color-amber-400)] rtl:shadow-[inset_-3px_0_0_var(--color-amber-400)]",
              )}
            >
              <TableCell className="px-5 py-3">
                <div className="max-w-80">
                  <p className="text-[11px] text-gray-400">
                    <span className="font-mono font-semibold text-gray-800">
                      {service.reference}
                    </span>
                    {" · "}
                    {service.service_type_label}
                  </p>
                  <p
                    title={service.summary}
                    className="font-medium text-gray-800 truncate leading-snug text-[13px] mt-0.5"
                  >
                    {service.summary}
                  </p>
                  {service.attention.map((attention) => (
                    <span
                      key={attention.value}
                      className="inline-flex items-center gap-1 mt-1 me-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700"
                    >
                      <TriangleAlert aria-hidden className="size-2.5" />
                      {attention.label}
                    </span>
                  ))}
                </div>
              </TableCell>

              <TableCell className="px-5 py-3">
                <div className="space-y-1.5">
                  <Person
                    name={service.client.name}
                    photoUrl={service.client.photo_url}
                    fallbackClassName="bg-primary"
                  />
                  {service.lawyer ? (
                    <Person
                      name={service.lawyer.name}
                      photoUrl={service.lawyer.photo_url}
                      fallbackClassName="bg-secondary"
                    >
                      {service.lawyer.verified && (
                        <>
                          <ShieldCheck
                            aria-hidden
                            className="size-3 text-emerald-600"
                          />
                          <span className="sr-only">{t("verified")}</span>
                        </>
                      )}
                    </Person>
                  ) : (
                    <p className="text-[11px] text-gray-400">
                      {t("offersCount", { count: service.offers_count })}
                    </p>
                  )}
                </div>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-800 text-[13px]">
                  {formatMoney(format, service.agreed_fee, CURRENCY)}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                    statusClassNames[service.status],
                  )}
                >
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-current"
                  />
                  {service.status_label}
                </span>
              </TableCell>

              <TableCell className="px-5 py-3">
                {service.delivery_deadline ? (
                  <div className="whitespace-nowrap">
                    <p className="text-gray-700 text-[13px]">
                      {format.dateTime(
                        new Date(service.delivery_deadline),
                        DATE_FORMAT,
                      )}
                    </p>
                    <p className="text-gray-500 text-[11px]">
                      {format.dateTime(new Date(service.delivery_deadline), {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-[13px]">-</p>
                )}
              </TableCell>

              <TableCell className="px-5 py-3">
                <p className="whitespace-nowrap text-gray-700 text-[13px]">
                  {service.round
                    ? t("roundNumber", { round: service.round })
                    : "-"}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <p
                  className={cn(
                    "whitespace-nowrap text-[13px]",
                    isInactive
                      ? "text-amber-700 font-semibold"
                      : "text-gray-500",
                  )}
                >
                  {service.last_activity_at
                    ? format.relativeTime(new Date(service.last_activity_at))
                    : "-"}
                </p>
              </TableCell>

              <TableCell className="px-5 py-3">
                <Button
                  variant="default"
                  className="rounded-sm text-xs"
                  aria-label={t("viewService", {
                    reference: service.reference,
                  })}
                >
                  {t("view")}
                  <ArrowRight className="size-3 rtl:rotate-180" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="text-center py-4 text-sm text-gray-500"
          >
            {t("noServices")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

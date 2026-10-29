import { getAppFormatter } from "@/lib/get-app-formatter";
import { DATE_FORMAT, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Pagination } from "@/types/shared";
import { Phone, Video } from "lucide-react";
import { TableCell, TableRow } from "../ui/table";
import { getLocale, getTranslations } from "next-intl/server";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DataTable, DataTableColumn } from "../reusable/data-table";
import { Consultation } from "@/types/consultation-monitoring";
import StatusBadge from "./status-badge";

// The API doesn't send a currency for consultations; fees are always in AED.
const CURRENCY = "AED";

// Consultations are booked in UAE time, whatever the admin's timezone.
const TIME_ZONE = "Asia/Dubai";

const TIME_FORMAT = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TIME_ZONE,
} as const satisfies Intl.DateTimeFormatOptions;

const CELL_PADDING = "px-3";

function Person({
  name,
  photoUrl,
  fallbackClassName,
}: {
  name: string;
  photoUrl: string;
  fallbackClassName: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={photoUrl} alt={name} />
        <AvatarFallback
          className={cn("text-white text-[11px]", fallbackClassName)}
        >
          {name[0]}
        </AvatarFallback>
      </Avatar>
      <p title={name} className="max-w-40 truncate text-gray-700 text-[13px]">
        {name}
      </p>
    </div>
  );
}

export default async function DataPreview({
  data,
  pagination,
}: {
  data: Consultation[];
  pagination: Pagination;
}) {
  const t = await getTranslations("ConsultationMonitoring.Table");
  const format = await getAppFormatter();
  const locale = await getLocale();

  const columns: DataTableColumn[] = [
    { label: t("reference"), className: CELL_PADDING },
    { label: t("client"), className: CELL_PADDING },
    { label: t("lawyer"), className: CELL_PADDING },
    { label: t("type"), className: CELL_PADDING },
    { label: t("dateTime"), className: CELL_PADDING },
    { label: t("duration"), className: CELL_PADDING },
    { label: t("amount"), className: CELL_PADDING },
    { label: t("status"), className: CELL_PADDING },
  ];

  return (
    <DataTable
      columns={columns}
      countUnit={t("consultations")}
      rowsCount={data.length}
      pagination={pagination}
    >
      {data.length ? (
        data.map((consultation) => {
          const TypeIcon = consultation.type === "video" ? Video : Phone;

          return (
            <TableRow key={consultation.id} className="border-gray-100">
              <TableCell className="px-3 py-3">
                <p className="font-mono font-semibold text-[12px] text-gray-800 whitespace-nowrap">
                  {consultation.reference}
                </p>
              </TableCell>

              <TableCell className="px-3 py-3">
                <Person
                  name={consultation.client.name}
                  photoUrl={consultation.client.photo_url}
                  fallbackClassName="bg-primary"
                />
              </TableCell>

              <TableCell className="px-3 py-3">
                <Person
                  name={consultation.lawyer.name}
                  photoUrl={consultation.lawyer.photo_url}
                  fallbackClassName="bg-secondary"
                />
              </TableCell>

              <TableCell className="px-3 py-3">
                <p className="flex items-center gap-1.5 whitespace-nowrap text-gray-600 text-[12px]">
                  <TypeIcon aria-hidden className="size-3.5 text-gray-400" />
                  {consultation.type_label}
                </p>
              </TableCell>

              <TableCell className="px-3 py-3">
                <div className="whitespace-nowrap">
                  <p className="text-gray-800 text-[13px]">
                    {format.dateTime(new Date(consultation.starts_at), {
                      ...DATE_FORMAT,
                      timeZone: TIME_ZONE,
                    })}
                  </p>
                  <p className="text-gray-400 text-[11px]">
                    {format.dateTime(
                      new Date(consultation.starts_at),
                      TIME_FORMAT,
                    )}
                    {" – "}
                    {format.dateTime(
                      new Date(consultation.ends_at),
                      TIME_FORMAT,
                    )}
                  </p>
                </div>
              </TableCell>

              <TableCell className="px-3 py-3">
                <p className="whitespace-nowrap text-gray-700 text-[13px]">
                  {t("minutes", {
                    minutes: format.number(consultation.duration_minutes),
                  })}
                </p>
              </TableCell>

              <TableCell className="px-3 py-3">
                <p className="whitespace-nowrap font-semibold text-gray-800 text-[13px]">
                  {formatMoney(consultation.amount, CURRENCY, locale)}
                </p>
              </TableCell>

              <TableCell className="px-3 py-3">
                <StatusBadge
                  status={consultation.status}
                  label={consultation.status_label}
                />
                {consultation.status === "cancelled" && (
                  <p className="mt-1 text-[11px] text-gray-500 whitespace-nowrap">
                    {consultation.refund_amount
                      ? t("refunded", {
                          amount: formatMoney(
                            consultation.refund_amount,
                            CURRENCY,
                            locale,
                          ),
                        })
                      : t("noRefund")}
                  </p>
                )}
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
            {t("noConsultations")}
          </TableCell>
        </TableRow>
      )}
    </DataTable>
  );
}

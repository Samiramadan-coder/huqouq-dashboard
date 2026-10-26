import { Download, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Fields, Section } from "./section";
import { useFormatter, useTranslations } from "next-intl";
import { formatFileSize } from "@/types/case-monitoring";
import {
  DATE_TIME_FORMAT,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

export default function RequestContent({
  service,
}: {
  service: LegalServiceDetails;
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Request");
  const format = useFormatter();
  const { request } = service;

  const formatDateTime = (date: string | null) =>
    date ? format.dateTime(new Date(date), DATE_TIME_FORMAT) : "-";

  const fields = [
    { label: t("serviceType"), value: service.service_type_label },
    { label: t("requested"), value: formatDateTime(request.submitted_at) },
    { label: t("approvedByAdmin"), value: formatDateTime(request.approved_at) },
    { label: t("approvingAdmin"), value: request.approved_by || "-" },
  ];

  return (
    <div className="space-y-4">
      <Section title={t("clientRequest")}>
        <p className="whitespace-pre-line text-[13px] leading-relaxed text-gray-700">
          {request.description}
        </p>

        <Fields
          fields={fields}
          className="mt-5 border-t border-gray-100 pt-5"
        />

        <p className="mt-4 text-[11px] text-gray-400">
          {t("requestedBy", { name: service.client.name })}
        </p>
      </Section>

      <Section title={t("attachedFiles", { count: request.files.length })}>
        {request.files.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {request.files.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3"
              >
                <FileText
                  aria-hidden
                  className="size-4 shrink-0 text-gray-500"
                />
                <div className="min-w-0 flex-1">
                  <p
                    title={file.name}
                    className="truncate text-[13px] text-gray-800"
                  >
                    {file.name}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {formatFileSize(file.size_bytes, format)}
                  </p>
                </div>
                {/* Downloads through the app's proxy route, which adds the
                    HTTP-only token on the server. */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400"
                  asChild
                >
                  <a
                    href={`/api/legal-service-files/${file.id}`}
                    download={file.name}
                    aria-label={t("download", { name: file.name })}
                  >
                    <Download className="size-4" />
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-gray-400">{t("noFiles")}</p>
        )}
      </Section>
    </div>
  );
}

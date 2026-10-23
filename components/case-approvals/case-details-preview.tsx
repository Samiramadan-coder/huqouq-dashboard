import {
  MapPin,
  FileText,
  Banknote,
  Paperclip,
  CalendarDays,
} from "lucide-react";
import { Badge } from "../ui/badge";
import CaseReview from "./case-review";
import { formatDate } from "@/lib/utils";
import CaseDocuments from "./case-documents";
import { Separator } from "../ui/separator";
import { CaseDetails } from "@/types/case-approvals";
import { useFormatter, useTranslations } from "next-intl";
import CaseStatusLabel from "../reusable/case-status-label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Server-rendered case details. Only the review controls and the document
// preview are client components, so the full case record stays on the server.
export default function CaseDetailsPreview({
  caseDetails,
}: {
  caseDetails: CaseDetails;
}) {
  const t = useTranslations("CaseApprovals.Details");
  const format = useFormatter();

  const details = (
    <>
      <Card className="py-0 gap-0 ring-0! border border-primary/15">
        <CardHeader className="gap-2 px-5 py-4">
          <CardTitle className="text-base font-bold">
            {caseDetails.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Badge
              variant="outline"
              className="font-normal text-[11px] bg-primary/5 border-primary/20 text-primary"
            >
              {caseDetails.specialization.name}
            </Badge>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <MapPin className="size-3.5" />
              <span>{caseDetails.city}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <CalendarDays className="size-3.5" />
              <span>
                {t("submitted", { date: formatDate(caseDetails.created_at) })}
              </span>
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-primary/15" />
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
              {t("client")}
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="size-7">
                <AvatarImage
                  src={caseDetails.client.photo_url ?? undefined}
                  alt={caseDetails.client.name}
                />
                <AvatarFallback className="bg-emerald-700 text-xs text-white">
                  {caseDetails.client.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[13px] font-semibold text-gray-800">
                  {caseDetails.client.name}
                </p>
                <p className="text-[11px] text-gray-400">{caseDetails.city}</p>
              </div>
            </div>
          </div>

          {caseDetails.budget_max > 0 && (
            <div className="px-5 py-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {t("budget")}
              </p>
              <div className="flex items-center gap-2">
                <Banknote className="size-4 text-gray-400" />
                <span className="text-[13px] font-semibold text-gray-800">
                  {format.number(caseDetails.budget_min)} -{" "}
                  {format.number(caseDetails.budget_max)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="py-0 gap-0 ring-0! border border-primary/15">
        <CardHeader className="gap-2 px-5 py-4">
          <CardTitle className="text-[13.5px] font-semibold flex items-center gap-2">
            <FileText className="size-4 text-secondary" />
            {t("caseDescription")}
          </CardTitle>
        </CardHeader>
        <Separator className="bg-primary/15" />
        <CardContent className="p-0">
          <p className="p-4 text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line wrap-break-word">
            {caseDetails.description}
          </p>
        </CardContent>
      </Card>

      <Card className="py-0 gap-0 ring-0! border border-primary/15">
        <CardHeader className="gap-2 px-5 py-4">
          <CardTitle className="text-[13.5px] font-semibold flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Paperclip className="size-4 text-secondary" />
              {t("attachedDocuments")}
            </div>
            <span className="text-[11px] text-gray-400">
              {caseDetails.documents.length} {t("files")}
            </span>
          </CardTitle>
        </CardHeader>
        <Separator className="bg-primary/15" />
        <CardContent className="p-0">
          <CaseDocuments documents={caseDetails.documents} />
        </CardContent>
      </Card>
    </>
  );

  // Only cases awaiting review can be approved or rejected.
  if (caseDetails.status !== "pending_review") {
    return (
      <div className="space-y-4 pb-20">
        <Card className="ring-0! border border-gray-200 px-5 py-4 flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-gray-600">{t("alreadyReviewed")}</p>
          <CaseStatusLabel status={caseDetails.status} />
        </Card>
        {details}
      </div>
    );
  }

  return <CaseReview caseId={caseDetails.id}>{details}</CaseReview>;
}

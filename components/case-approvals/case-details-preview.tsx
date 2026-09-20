"use client";

import {
  MapPin,
  FileText,
  Banknote,
  Paperclip,
  CalendarDays,
  X,
  TriangleAlert,
  ShieldAlert,
} from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { T } from "@/types/shared";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import ApproveBtn from "./approve-btn";
import { Spinner } from "../ui/spinner";
import { useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";
import { cn, formatDate } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { Field, FieldGroup } from "../ui/field";
import NormalFormTextarea from "../form/textarea";
import { rejectCase } from "@/lib/cases-approvals";
import { CaseDetails } from "@/types/case-approvals";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type CaseDocument = CaseDetails["documents"][number];

const rejectSchema = (t: T) =>
  z.object({
    reason: z.string().min(1, t("reason_required")),
  });

type RejectFormData = z.infer<ReturnType<typeof rejectSchema>>;

export default function CaseDetailsPreview({
  caseDetails,
}: {
  caseDetails: CaseDetails;
}) {
  const router = useRouter();
  const t = useTranslations("CaseApprovals.Details");
  const form = useRef<HTMLFormElement>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<CaseDocument | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RejectFormData>({
    defaultValues: { reason: "" },
    resolver: zodResolver(rejectSchema(t)),
  });

  const handleReject: SubmitHandler<RejectFormData> = async (data) => {
    const result = await rejectCase(caseDetails.id, data.reason);

    if (result.success) {
      toast.success(t("reject_success"));
      router.back();
    } else {
      toast.error(t("reject_failure"));
    }
  };

  const conditions = ["Condition1", "Condition2", "Condition3", "Condition4"];

  return (
    <>
      <div className="space-y-4 pb-20">
        <Card className="bg-amber-50 ring-0! border border-amber-200 rounded-xl px-5 py-4 gap-0">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert
              className="text-amber-600 size-4 shrink-0"
              aria-hidden="true"
            />
            <h3 className="text-[13px] font-semibold text-amber-800">
              {t("ReviewChecklist")}
            </h3>
            <span className="text-[11px] text-amber-600 ml-auto">
              {selectedConditions.length} / 4 {t("Confirmed")}
            </span>
          </div>

          <FieldGroup className="gap-2">
            {conditions.map((condition) => (
              <Field orientation="horizontal" key={condition}>
                <Checkbox
                  id={condition}
                  name={condition}
                  checked={selectedConditions.includes(condition)}
                  onCheckedChange={() =>
                    setSelectedConditions((prev) =>
                      prev.includes(condition)
                        ? prev.filter((c) => c !== condition)
                        : [...prev, condition],
                    )
                  }
                  className="
                    border-amber-300
                    data-[state=checked]:border-amber-500
                    data-[state=checked]:bg-amber-500
                    data-[state=checked]:text-white
                  "
                />
                <Label
                  htmlFor={condition}
                  className={cn(
                    "text-[13px] leading-relaxed transition-colors text-amber-800 font-normal",
                    selectedConditions.includes(condition) && "line-through",
                  )}
                >
                  {t(condition)}
                </Label>
              </Field>
            ))}
          </FieldGroup>
        </Card>

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
                    src={caseDetails.client.photo_url || ""}
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
                  <p className="text-[11px] text-gray-400">
                    {caseDetails.city}
                  </p>
                </div>
              </div>
            </div>

            {caseDetails.budget_max && caseDetails.budget_min && (
              <div className="px-5 py-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {t("budget")}
                </p>
                <div className="flex items-center gap-2">
                  <Banknote className="size-4 text-gray-400" />
                  <span className="text-[13px] font-semibold text-gray-800">
                    {caseDetails.budget_min} - {caseDetails.budget_max}
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
            <p className="p-4 text-[13.5px] text-gray-700 leading-relaxed whitespace-pre-line">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              {caseDetails.documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className="cursor-pointer p-3 border bg-primary/5 border-primary/10 rounded-lg flex items-center gap-4"
                >
                  <div className="p-2 bg-white rounded-lg border border-primary/15">
                    <FileText className="size-4 text-red-400" />
                  </div>

                  <div>
                    <p className="text-[12.5px] font-medium text-gray-800 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {doc.size_bytes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showRejectForm && (
          <Card className="gap-0 ring-0! border border-red-200 bg-red-50">
            <div className="flex items-center gap-2 mb-3 px-4">
              <TriangleAlert className="text-red-500 shrink-0 size-4" />
              <h3 className="text-[13.5px] font-semibold text-red-800">
                {t("rejectionReason")}
              </h3>
              <span className="text-[11px] text-red-500 ml-auto">
                {t("sentToClient")}
              </span>
            </div>

            <form
              ref={form}
              className="px-4"
              onSubmit={handleSubmit(handleReject)}
            >
              <NormalFormTextarea
                register={register}
                name="reason"
                textareaClassName="border-red-200 bg-white placeholder:text-red-300 placeholder:text-xs"
                required
                errors={errors}
                placeholder={t("placeholderRejectionReason")}
              />
            </form>
          </Card>
        )}
      </div>

      <div className="px-6 py-3 bg-white flex items-center justify-between border-t border-gray-200 space-x-4 -mx-4 sm:-mx-6">
        <div className="flex items-center space-x-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "inline-block w-2 h-2 bg-gray-300 rounded-full",
                index < selectedConditions.length && "bg-green-500",
              )}
            />
          ))}
          <span className="text-[12px] text-gray-400 hidden sm:block">
            {4 - selectedConditions.length} checklist items remaining
          </span>
        </div>

        <div className="space-x-4">
          {showRejectForm && (
            <Button
              variant="outline"
              className="bg-transparent h-11"
              onClick={() => {
                setShowRejectForm(false);
              }}
            >
              {t("cancel")}
            </Button>
          )}

          <Button
            variant="outline"
            className="bg-transparent text-red-700 border-red-200 h-11"
            onClick={() => {
              if (!showRejectForm) {
                return setShowRejectForm(true);
              }
              form.current?.requestSubmit();
            }}
          >
            {isSubmitting ? <Spinner /> : <X className="size-3" />}
            {showRejectForm ? t("confirmRejection") : t("reject")}
          </Button>

          <ApproveBtn
            caseId={caseDetails.id}
            disabled={selectedConditions.length !== 4}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
      >
        <DialogContent className="sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.name ?? t("documentPreview")}
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <iframe
              src={selectedDocument.url}
              className="w-full h-[75vh] rounded-lg border border-primary/15"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

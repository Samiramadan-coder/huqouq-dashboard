"use client";

import {
  CaseReviewResult,
  RejectFormData,
  rejectSchema,
  ReviewStatus,
} from "@/types/case-approvals";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import ApproveBtn from "./approve-btn";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { Field, FieldGroup } from "../ui/field";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { approveCase, rejectCase } from "@/lib/cases-approvals";
import { ShieldAlert, TriangleAlert, X } from "lucide-react";
import {
  type ReactNode,
  useId,
  useMemo,
  useState,
  useTransition,
} from "react";

const conditions = [
  "Condition1",
  "Condition2",
  "Condition3",
  "Condition4",
] as const;

type Condition = (typeof conditions)[number];

// Review checklist, rejection form and approve / reject controls for a case
// awaiting review. The server-rendered case details are passed in as children.
export default function CaseReview({
  caseId,
  children,
}: {
  caseId: number;
  children: ReactNode;
}) {
  const router = useRouter();
  const formId = useId();
  const t = useTranslations("CaseApprovals.Details");
  const [isPending, startTransition] = useTransition();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>(
    [],
  );

  const schema = useMemo(() => rejectSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RejectFormData>({
    defaultValues: { reason: "" },
    resolver: zodResolver(schema),
  });

  // Disables every decision control while a request or the redirect is running.
  const isBusy = isPending || isSubmitting;
  const remaining = conditions.length - selectedConditions.length;

  // Shows feedback for a decision and moves to the matching tab on success.
  function handleResult(
    result: CaseReviewResult,
    successKey: string,
    failureKey: string,
    redirectStatus: ReviewStatus,
  ) {
    if (!result.success) {
      toast.error(
        t(result.error === "forbidden" ? "actionForbidden" : failureKey),
      );
      return false;
    }

    toast.success(t(successKey));
    startTransition(() =>
      router.replace(`/case-approvals?status=${redirectStatus}`),
    );
    return true;
  }

  function handleApprove() {
    startTransition(async () => {
      try {
        const result = await approveCase(caseId);
        if (
          handleResult(result, "approve_success", "approve_failure", "published")
        ) {
          setIsApproveOpen(false);
        }
      } catch {
        toast.error(t("approve_failure"));
      }
    });
  }

  const handleReject: SubmitHandler<RejectFormData> = async ({ reason }) => {
    try {
      const result = await rejectCase(caseId, reason);
      handleResult(result, "reject_success", "reject_failure", "rejected");
    } catch {
      toast.error(t("reject_failure"));
    }
  };

  function toggleCondition(condition: Condition) {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  }

  return (
    <>
      <div className="space-y-4 pb-20">
        <Card className="bg-amber-50 ring-0! border border-amber-200 rounded-xl px-5 py-4 gap-0">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert
              className="text-amber-600 size-4 shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-[13px] font-semibold text-amber-800">
              {t("ReviewChecklist")}
            </h2>
            <span className="text-[11px] text-amber-600 ms-auto">
              {selectedConditions.length} / {conditions.length} {t("Confirmed")}
            </span>
          </div>

          <FieldGroup className="gap-2">
            {conditions.map((condition) => {
              const id = `${formId}-${condition}`;
              const checked = selectedConditions.includes(condition);

              return (
                <Field orientation="horizontal" key={condition}>
                  <Checkbox
                    id={id}
                    checked={checked}
                    disabled={isBusy}
                    onCheckedChange={() => toggleCondition(condition)}
                    className="
                      border-amber-300
                      data-[state=checked]:border-amber-500
                      data-[state=checked]:bg-amber-500
                      data-[state=checked]:text-white
                    "
                  />
                  <Label
                    htmlFor={id}
                    className={cn(
                      "text-[13px] leading-relaxed transition-colors text-amber-800 font-normal",
                      checked && "line-through",
                    )}
                  >
                    {t(condition)}
                  </Label>
                </Field>
              );
            })}
          </FieldGroup>
        </Card>

        {children}

        {showRejectForm && (
          <Card className="gap-0 ring-0! border border-red-200 bg-red-50">
            <div className="flex items-center gap-2 mb-3 px-4">
              <TriangleAlert className="text-red-500 shrink-0 size-4" />
              <h2
                id={`${formId}-reject-title`}
                className="text-[13.5px] font-semibold text-red-800"
              >
                {t("rejectionReason")}
              </h2>
              <span className="text-[11px] text-red-500 ms-auto">
                {t("sentToClient")}
              </span>
            </div>

            <form
              id={`${formId}-reject`}
              aria-labelledby={`${formId}-reject-title`}
              className="px-4"
              onSubmit={handleSubmit(handleReject)}
            >
              <NormalFormTextarea
                register={register}
                name="reason"
                textareaClassName="border-red-200 bg-white placeholder:text-red-300 placeholder:text-xs"
                required
                disabled={isBusy}
                errors={errors}
                placeholder={t("placeholderRejectionReason")}
              />
            </form>
          </Card>
        )}
      </div>

      <div className="px-6 py-3 bg-white flex items-center justify-between border-t border-gray-200 gap-4 -mx-4 sm:-mx-6">
        <div className="flex items-center gap-2">
          {conditions.map((condition, index) => (
            <span
              key={condition}
              aria-hidden
              className={cn(
                "inline-block w-2 h-2 bg-gray-300 rounded-full",
                index < selectedConditions.length && "bg-green-500",
              )}
            />
          ))}
          <span className="text-[12px] text-gray-400 hidden sm:block">
            {t("checklistItemsRemaining", { count: remaining })}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {showRejectForm && (
            <Button
              variant="outline"
              className="bg-transparent h-11"
              disabled={isBusy}
              onClick={() => setShowRejectForm(false)}
            >
              {t("cancel")}
            </Button>
          )}

          {showRejectForm ? (
            <Button
              key="confirm-reject"
              type="submit"
              form={`${formId}-reject`}
              variant="outline"
              disabled={isBusy}
              aria-busy={isSubmitting}
              className="bg-transparent text-red-700 border-red-200 h-11"
            >
              {isSubmitting ? <Spinner /> : <X className="size-3" />}
              {t("confirmRejection")}
            </Button>
          ) : (
            <Button
              key="open-reject"
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => setShowRejectForm(true)}
              className="bg-transparent text-red-700 border-red-200 h-11"
            >
              <X className="size-3" />
              {t("reject")}
            </Button>
          )}

          <ApproveBtn
            open={isApproveOpen}
            onOpenChange={setIsApproveOpen}
            onConfirm={handleApprove}
            disabled={isBusy || remaining > 0}
            isPending={isPending}
          />
        </div>
      </div>
    </>
  );
}

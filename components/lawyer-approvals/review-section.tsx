"use client";

import {
  User,
  Flag,
  Globe,
  Check,
  Package2,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  CheckCircle,
} from "lucide-react";

import {
  ItemKey,
  ReasonFormData,
  reasonSchema,
  ReviewActionResult,
  ReviewItem,
} from "@/types/lawyer-approvals";

import {
  flagSection,
  undoSection,
  approveSection,
} from "@/lib/lawyer-approvals";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { type ReactNode, useId, useMemo, useState, useTransition } from "react";

type SectionAction = "approve" | "undo";

const sectionIcons: Record<ItemKey, ReactNode> = {
  professional_info: <User className="size-4" />,
  specializations_services: <BookOpen className="size-4" />,
  languages_bio: <Globe className="size-4" />,
  education: <GraduationCap className="size-4" />,
  experience: <Package2 className="size-4" />,
  bar_certificate: <ShieldCheck className="size-4" />,
};

// A single reviewable section of the lawyer's profile. The read-only content is
// rendered on the server and passed in as children; this component owns the
// approve / flag / undo controls.
export default function ReviewSection({
  item,
  lawyerId,
  children,
}: {
  item: ReviewItem;
  lawyerId: number;
  children: ReactNode;
}) {
  const t = useTranslations("LawyerApprovals");
  const formId = useId();
  const [isFlagFormOpen, setIsFlagFormOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<SectionAction | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const schema = useMemo(() => reasonSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReasonFormData>({
    defaultValues: { reason: "" },
    resolver: zodResolver(schema),
  });

  const isBusy = isPending || isSubmitting;

  // Shows the toast for an action result, returning whether it succeeded.
  function notify(
    result: ReviewActionResult,
    successKey: string,
    failureKey: string,
  ) {
    if (result.success) {
      toast.success(t(successKey));
      return true;
    }
    toast.error(t(result.error === "forbidden" ? "actionForbidden" : failureKey));
    return false;
  }

  // Runs approve / undo inside a transition so controls stay disabled until the
  // refreshed section arrives from the server.
  function runAction(
    action: SectionAction,
    request: () => Promise<ReviewActionResult>,
    successKey: string,
    failureKey: string,
  ) {
    setPendingAction(action);
    startTransition(async () => {
      try {
        notify(await request(), successKey, failureKey);
      } catch {
        toast.error(t(failureKey));
      }
    });
  }

  // Handles the submission of the flagging form for this section.
  const onSubmit: SubmitHandler<ReasonFormData> = async ({ reason }) => {
    try {
      const result = await flagSection(lawyerId, item.item, reason);
      if (notify(result, "sectionFlagged", "sectionFlagFailed")) {
        reset();
        setIsFlagFormOpen(false);
      }
    } catch {
      toast.error(t("sectionFlagFailed"));
    }
  };

  return (
    <section
      aria-labelledby={`${formId}-title`}
      className={cn("border rounded-md overflow-hidden", {
        "border-primary/15": item.status === "pending",
        "border-green-200": item.status === "approved",
        "border-red-200": item.status === "flagged",
      })}
    >
      {/* Section Head */}
      <div
        className={cn("p-4 flex items-center justify-between ", {
          "bg-gray-50/60": item.status === "pending",
          "bg-green-50/60": item.status === "approved",
          "bg-red-50/60": item.status === "flagged",
        })}
      >
        <h2
          id={`${formId}-title`}
          className="text-[13.5px] font-semibold text-gray-800 flex items-center gap-2"
        >
          {sectionIcons[item.item]}
          {item.item_label}
        </h2>

        <div className="flex items-center gap-2">
          {item.status === "pending" ? (
            <>
              <Button
                variant="outline"
                disabled={isBusy}
                onClick={() =>
                  runAction(
                    "approve",
                    () => approveSection(lawyerId, item.item),
                    "sectionApproved",
                    "sectionApprovalFailed",
                  )
                }
                className="bg-green-50 border-green-200 text-green-700 text-[11.5px] hover:bg-green-100 hover:text-green-700"
              >
                {isPending && pendingAction === "approve" ? (
                  <Spinner className="size-3" />
                ) : (
                  <Check className="size-3" />
                )}
                {t("approveSection")}
              </Button>
              <Button
                variant="outline"
                disabled={isBusy}
                aria-expanded={isFlagFormOpen}
                aria-controls={`${formId}-form`}
                className="bg-red-50 border-red-200 text-red-700 text-[11.5px] hover:bg-red-100 hover:text-red-700"
                onClick={() => setIsFlagFormOpen((open) => !open)}
              >
                <Flag className="size-3" />
                {t("flagSection")}
              </Button>
            </>
          ) : (
            <>
              <Badge
                className={cn("text-[11.5px] py-3 px-3", {
                  "bg-green-50 text-green-700 border border-green-200":
                    item.status === "approved",
                  "bg-red-50 text-red-700 border border-red-200":
                    item.status === "flagged",
                })}
              >
                {item.status === "approved" ? (
                  <CheckCircle className="size-3" />
                ) : (
                  <Flag className="size-3" />
                )}
                {item.status === "approved" ? t("approved") : t("flagged")}
              </Badge>

              <Button
                variant="ghost"
                disabled={isBusy}
                onClick={() =>
                  runAction(
                    "undo",
                    () => undoSection(lawyerId, item.item),
                    "sectionUndoSuccess",
                    "sectionUndoFailed",
                  )
                }
                className="text-[11.5px] text-gray-400"
              >
                {isPending && pendingAction === "undo" && (
                  <Spinner className="size-3" />
                )}
                {t("undo")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div
        className={cn("p-4 border-t ", {
          "border-primary/15": item.status === "pending",
          "border-green-200": item.status === "approved",
          "border-red-200": item.status === "flagged",
        })}
      >
        {children}
      </div>

      {item.status === "flagged" && item.reason && (
        <div className="p-4 border-t border-red-200 bg-red-50">
          <p className="text-[13px] text-red-700">{item.reason}</p>
        </div>
      )}

      {item.status === "pending" && isFlagFormOpen && (
        <form
          id={`${formId}-form`}
          className="p-4 sm:p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <NormalFormTextarea
            register={register}
            name="reason"
            required
            label={t("reasonLabel")}
            placeholder={t("reasonPlaceholder")}
            textareaClassName="placeholder:text-red-300 placeholder:text-[11.5px] border-red-200"
            labelClassName="text-[11.5px] text-red-600"
            errors={errors}
            disabled={isSubmitting}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              variant="outline"
              disabled={isBusy}
              className="border border-red-200 bg-red-50 text-red-600 text-[13px]"
            >
              {isSubmitting && <Spinner className="size-3" />}
              {t("flagSection")}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

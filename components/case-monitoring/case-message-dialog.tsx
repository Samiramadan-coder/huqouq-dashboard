"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import {
  CaseMessageFormValues,
  CaseMessageResult,
  caseMessageSchema,
} from "@/types/case-monitoring";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { Flag, MessageSquare, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { flagForDisputeReview, sendCheckInMessage } from "@/lib/case-monitoring";

const variants = {
  checkIn: {
    action: sendCheckInMessage,
    labelKey: "sendCheckInMessage",
    successKey: "checkInSent",
    failureKey: "checkInFailed",
    TriggerIcon: MessageSquare,
    triggerVariant: "default",
    triggerClassName: "font-normal text-[13px] h-9 bg-secondary px-4",
  },
  dispute: {
    action: flagForDisputeReview,
    labelKey: "flagForDisputeReview",
    successKey: "disputeFlagged",
    failureKey: "disputeFlagFailed",
    TriggerIcon: Flag,
    triggerVariant: "outline",
    triggerClassName:
      "font-normal text-[13px] h-9 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4",
  },
} satisfies Record<
  string,
  {
    action: (
      values: CaseMessageFormValues,
      caseId: number,
    ) => Promise<CaseMessageResult>;
    labelKey: string;
    successKey: string;
    failureKey: string;
    TriggerIcon: typeof Flag;
    triggerVariant: "default" | "outline";
    triggerClassName: string;
  }
>;

// Dialog with a message form, used for both the check-in message and the
// dispute review flag. The dialog cannot be dismissed while sending.
export default function CaseMessageDialog({
  caseId,
  variant,
}: {
  caseId: number;
  variant: keyof typeof variants;
}) {
  const t = useTranslations("CaseMonitoring");
  const [open, setOpen] = useState(false);
  const config = variants[variant];

  const schema = useMemo(() => caseMessageSchema(t), [t]);

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CaseMessageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { body: "" },
  });

  const onSubmit: SubmitHandler<CaseMessageFormValues> = async (data) => {
    try {
      const result = await config.action(data, caseId);

      if (result.success) {
        toast.success(result.message || t(config.successKey));
        reset();
        setOpen(false);
        return;
      }

      if (result.errors?.body) {
        setError("body", { type: "server", message: result.errors.body });
        return;
      }

      toast.error(
        t(result.error === "forbidden" ? "actionForbidden" : config.failureKey),
      );
    } catch {
      toast.error(t(config.failureKey));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isSubmitting) setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={config.triggerVariant}
          className={config.triggerClassName}
        >
          <config.TriggerIcon />
          {t(config.labelKey)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle>{t(config.labelKey)}</DialogTitle>
          {variant === "checkIn" && (
            <DialogDescription className="mt-2">
              <span className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Send className="text-blue-500 shrink-0 size-4" />
                <span className="text-[12px] text-blue-700">
                  {t("checkInMessageDescription")}
                </span>
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <NormalFormTextarea<CaseMessageFormValues>
            register={register}
            name="body"
            label={t("messageLabel")}
            required
            disabled={isSubmitting}
            errors={errors}
            textareaClassName="bg-white border-primary/10 placeholder:text-primary/40 placeholder:text-xs"
          />

          <div className="flex gap-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                className="flex-1 h-10"
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
            </DialogClose>

            <Button
              className="flex-1 bg-secondary h-10"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : <Send className="size-4" />}
              {t(config.labelKey)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

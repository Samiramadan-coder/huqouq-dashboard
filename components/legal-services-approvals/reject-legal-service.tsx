"use client";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "../ui/dialog";
import {
  RejectFormValues,
  rejectSchema,
} from "@/types/legal-services-approvals";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { rejectLegalService } from "@/lib/legal-services-approvals";

// Reject button with a dialog asking for the reason sent to the client.
export default function RejectLegalService({
  serviceId,
  disabled,
  onPendingChange,
  onRejected,
}: {
  serviceId: number;
  disabled: boolean;
  onPendingChange: (pending: boolean) => void;
  onRejected: () => void;
}) {
  const t = useTranslations("LegalServicesApprovals.Details");
  const [open, setOpen] = useState(false);

  const schema = useMemo(() => rejectSchema(t), [t]);

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "" },
  });

  const onSubmit: SubmitHandler<RejectFormValues> = async (data) => {
    onPendingChange(true);
    try {
      const result = await rejectLegalService(data, serviceId);

      if (result.success) {
        toast.success(result.message || t("reject_success"));
        reset();
        setOpen(false);
        onRejected();
        return;
      }

      if (result.errors?.reason) {
        setError("reason", { type: "server", message: result.errors.reason });
        return;
      }

      toast.error(
        t(result.error === "forbidden" ? "actionForbidden" : "reject_failure"),
      );
    } catch {
      toast.error(t("reject_failure"));
    } finally {
      onPendingChange(false);
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
          variant="outline"
          disabled={disabled}
          className="flex-1 font-normal text-[13px] h-11 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4"
        >
          <CircleX />
          {t("reject")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle>{t("rejectTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <NormalFormTextarea<RejectFormValues>
            register={register}
            name="reason"
            label={t("reasonLabel")}
            required
            disabled={isSubmitting}
            errors={errors}
            textareaClassName="bg-white border-primary/10 placeholder:text-primary/40 placeholder:text-xs"
          />

          <div className="flex justify-end w-full">
            <Button
              className="font-normal text-[13px] h-11 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : <CircleX className="size-4" />}
              {t("reject")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

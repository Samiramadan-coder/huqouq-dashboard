import { formatMoney } from "@/lib/format";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";

import {
  CancelRefundFormValues,
  cancelRefundSchema,
  CANCEL_REASON_MAX_LENGTH,
  CANCEL_REASON_MIN_LENGTH,
} from "@/types/legal-services-montoring";

import { toast } from "sonner";
import { Ban } from "lucide-react";
import { cancelRefundConsultation } from "@/lib/consultation-monitoring";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMemo, useState } from "react";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { ConsultationDetailsType } from "@/types/consultation-monitoring";

// "Cancel & refund in full" button with a dialog asking for the reason. The
// full amount goes back to the client, so no fee or payout is taken.
export default function CancelRefund({
  consultation,
  disabled,
  title,
  onSuccess,
}: {
  consultation: ConsultationDetailsType;
  disabled: boolean;
  title?: string;
  onSuccess: () => void;
}) {
  const t = useTranslations("ConsultationMonitoring.Details");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const schema = useMemo(
    () => cancelRefundSchema((key) => t(`CancelRefund.${key}`)),
    [t],
  );

  const {
    control,
    register,
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CancelRefundFormValues>({
    defaultValues: { reason: "" },
    resolver: zodResolver(schema),
  });

  const reason = useWatch({ control, name: "reason" });

  const onSubmit: SubmitHandler<CancelRefundFormValues> = async (data) => {
    try {
      const result = await cancelRefundConsultation(data, consultation.id);

      if (result.success) {
        toast.success(result.message || t("CancelRefund.success"));
        reset();
        setOpen(false);
        onSuccess();
        return;
      }

      if (result.errors?.reason) {
        setError("reason", { type: "server", message: result.errors.reason });
        return;
      }

      toast.error(
        t(
          result.error === "forbidden"
            ? "CancelRefund.forbidden"
            : "CancelRefund.failure",
        ),
      );
    } catch {
      toast.error(t("CancelRefund.failure"));
    }
  };

  // The full amount paid goes back to the client.
  const refund = formatMoney(
    consultation.payment?.amount ?? consultation.amount,
    "AED",
    locale,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          title={title}
          className="h-9 rounded-md text-[13px] font-medium border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          <Ban className="size-3.5" />
          {t("cancelRefund")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1.5 px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-[15px] font-bold text-primary">
            {t("CancelRefund.title")}
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-gray-500">
            {t("CancelRefund.description", { amount: refund })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 px-5 py-5">
            <label htmlFor="reason" className="block text-xs text-gray-700">
              {t("CancelRefund.reasonLabel")}{" "}
              <span className="text-red-600">{t("CancelRefund.required")}</span>
            </label>

            <NormalFormTextarea<CancelRefundFormValues>
              register={register}
              name="reason"
              placeholder={t("CancelRefund.reasonPlaceholder")}
              disabled={isSubmitting}
              maxLength={CANCEL_REASON_MAX_LENGTH}
              textareaClassName="min-h-24 rounded-lg border-gray-200 bg-gray-50/40 text-[13px] placeholder:text-gray-300"
              errors={errors}
            />
          </div>

          <DialogFooter className="m-0 bg-gray-50/60 px-5 py-4 border-t border-gray-100">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 text-[13px]"
                disabled={isSubmitting}
              >
                {t("CancelRefund.keep")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-10 text-[13px] bg-red-500 text-white hover:bg-red-600"
              aria-busy={isSubmitting}
              disabled={
                isSubmitting || reason.trim().length < CANCEL_REASON_MIN_LENGTH
              }
            >
              {isSubmitting && <Spinner />}
              {t("CancelRefund.submit", { amount: refund })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMemo, useState } from "react";
import NormalFormTextarea from "../form/textarea";
import { formatMoney } from "@/types/case-monitoring";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormatter, useTranslations } from "next-intl";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { cancelRefundLegalService } from "@/lib/legal-services-monitoring";

// const CURRENCY = "AED";

// "Cancel & refund" button with a dialog asking for the reason. The full
// escrow amount goes back to the client, so no fee or payout is taken.
export default function CancelRefund({
  service,
  disabled,
  title,
  onSuccess,
}: {
  service: LegalServiceDetails;
  disabled: boolean;
  title?: string;
  onSuccess: () => void;
}) {
  const tCommon = useTranslations("Common");
  const t = useTranslations("LegalServicesMonitoring.Details");
  const format = useFormatter();
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
  const money = (amount: number) => formatMoney(format, amount, tCommon("AED"));

  const onSubmit: SubmitHandler<CancelRefundFormValues> = async (data) => {
    try {
      const result = await cancelRefundLegalService(data, service.id);

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

  const breakdown = [
    {
      label: t("CancelRefund.refundToClient"),
      amount: service.payment?.amount ?? 0,
    },
    { label: t("CancelRefund.platformFee"), amount: 0 },
    { label: t("CancelRefund.lawyerPayout"), amount: 0 },
  ];

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
          <Undo2 className="size-3.5" />
          {t("Actions.cancelRefund")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1.5 px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-[15px] font-bold text-primary">
            {t("CancelRefund.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {t("CancelRefund.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 px-5 py-5">
            <p className="text-xs text-gray-500">
              <span className="font-mono font-semibold text-primary">
                {service.reference}
              </span>
              {" · "}
              {service.summary}
            </p>

            <dl className="divide-y divide-red-100 rounded-lg border border-red-200 bg-red-50/60 px-4">
              {breakdown.map(({ label, amount }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 text-[13px]"
                >
                  <dt className="text-gray-600">{label}</dt>
                  <dd className="font-semibold text-primary">
                    {money(amount)}
                  </dd>
                </div>
              ))}
            </dl>

            <NormalFormTextarea<CancelRefundFormValues>
              register={register}
              name="reason"
              label={t("CancelRefund.reasonLabel")}
              labelClassName="text-xs"
              placeholder={t("CancelRefund.reasonPlaceholder")}
              disabled={isSubmitting}
              maxLength={CANCEL_REASON_MAX_LENGTH}
              description={t("CancelRefund.reasonHint", {
                min: CANCEL_REASON_MIN_LENGTH,
              })}
              errors={errors}
            />
          </div>

          <DialogFooter className="m-0 bg-white px-5 py-4 border-gray-100">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 text-[13px]"
                disabled={isSubmitting}
              >
                {t("CancelRefund.back")}
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
              {t("CancelRefund.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

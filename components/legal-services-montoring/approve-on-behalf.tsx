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
  ApproveOnBehalfFormValues,
  approveOnBehalfSchema,
  APPROVE_REASON_MAX_LENGTH,
  APPROVE_REASON_MIN_LENGTH,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMemo, useState } from "react";
import NormalFormTextarea from "../form/textarea";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { approveLegalServiceOnBehalf } from "@/lib/legal-services-monitoring";

// "Approve on behalf" button with a dialog asking for the reason. Completes
// the service for the client and starts the lawyer's payout hold.
export default function ApproveOnBehalf({
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
  const t = useTranslations("LegalServicesMonitoring.Details");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const schema = useMemo(
    () => approveOnBehalfSchema((key) => t(`ApproveOnBehalf.${key}`)),
    [t],
  );

  const {
    control,
    register,
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ApproveOnBehalfFormValues>({
    defaultValues: { reason: "" },
    resolver: zodResolver(schema),
  });

  const reason = useWatch({ control, name: "reason" });

  const onSubmit: SubmitHandler<ApproveOnBehalfFormValues> = async (data) => {
    try {
      const result = await approveLegalServiceOnBehalf(data, service.id);

      if (result.success) {
        toast.success(result.message || t("ApproveOnBehalf.success"));
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
            ? "ApproveOnBehalf.forbidden"
            : "ApproveOnBehalf.failure",
        ),
      );
    } catch {
      toast.error(t("ApproveOnBehalf.failure"));
    }
  };

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
          className="h-9 rounded-md text-[13px] font-medium"
        >
          <CircleCheck className="size-3.5" />
          {t("Actions.approveOnBehalf")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1.5 px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-[15px] font-bold text-primary">
            {t("ApproveOnBehalf.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {t("ApproveOnBehalf.description")}
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

            <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
              <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <p>
                {t("ApproveOnBehalf.warning", {
                  amount: formatMoney(
                    service.payment?.lawyer_amount ?? 0,
                    "AED",
                    locale,
                  ),
                })}
              </p>
            </div>

            <NormalFormTextarea<ApproveOnBehalfFormValues>
              register={register}
              name="reason"
              label={t("ApproveOnBehalf.reasonLabel")}
              labelClassName="text-xs"
              placeholder={t("ApproveOnBehalf.reasonPlaceholder")}
              disabled={isSubmitting}
              maxLength={APPROVE_REASON_MAX_LENGTH}
              description={t("ApproveOnBehalf.reasonHint", {
                min: APPROVE_REASON_MIN_LENGTH,
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
                {t("ApproveOnBehalf.back")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-10 text-[13px] bg-red-500 text-white hover:bg-red-600"
              aria-busy={isSubmitting}
              disabled={
                isSubmitting ||
                reason.trim().length < APPROVE_REASON_MIN_LENGTH
              }
            >
              {isSubmitting && <Spinner />}
              {t("ApproveOnBehalf.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

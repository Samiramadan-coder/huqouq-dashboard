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
  CHECKIN_MESSAGE_MAX_LENGTH,
  CHECKIN_REASON_MAX_LENGTH,
  CHECKIN_REASON_MIN_LENGTH,
  CheckinFormValues,
  checkinSchema,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

import { toast } from "sonner";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { sendLegalServiceCheckin } from "@/lib/legal-services-monitoring";

// "Send check-in" button with a dialog asking who to message, the message
// posted in the service chat, and the reason for the activity log.
export default function Checkin({
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
  const [open, setOpen] = useState(false);

  const schema = useMemo(
    () => checkinSchema((key) => t(`Checkin.${key}`)),
    [t],
  );

  // Without a hired lawyer the client is the only party to message.
  const recipients = service.lawyer
    ? ([
        { value: "client", label: service.client.name },
        { value: "lawyer", label: service.lawyer.name },
        { value: "both", label: t("Checkin.bothParties") },
      ] as const)
    : ([{ value: "client", label: service.client.name }] as const);

  const {
    control,
    register,
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CheckinFormValues>({
    defaultValues: {
      recipient: service.lawyer ? "both" : "client",
      message: "",
      reason: "",
    },
    resolver: zodResolver(schema),
  });

  const [recipient, message, reason] = useWatch({
    control,
    name: ["recipient", "message", "reason"],
  });

  const onSubmit: SubmitHandler<CheckinFormValues> = async (data) => {
    try {
      const result = await sendLegalServiceCheckin(data, service.id);

      if (result.success) {
        toast.success(result.message || t("Checkin.success"));
        reset();
        setOpen(false);
        onSuccess();
        return;
      }

      if (
        result.errors?.recipient ||
        result.errors?.message ||
        result.errors?.reason
      ) {
        for (const field of ["recipient", "message", "reason"] as const) {
          const error = result.errors[field];
          if (error) setError(field, { type: "server", message: error });
        }
        return;
      }

      toast.error(
        t(
          result.error === "forbidden"
            ? "Checkin.forbidden"
            : "Checkin.failure",
        ),
      );
    } catch {
      toast.error(t("Checkin.failure"));
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
          <Send className="size-3.5" />
          {t("Actions.checkin")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1.5 px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-[15px] font-bold text-primary">
            {t("Checkin.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {t("Checkin.description")}
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

            <fieldset className="space-y-2" disabled={isSubmitting}>
              <legend className="mb-2 text-sm font-semibold">
                {t("Checkin.sendTo")}
              </legend>
              <div className="flex flex-wrap gap-2">
                {recipients.map(({ value, label }) => (
                  <label
                    key={value}
                    className={cn(
                      "flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[13px] text-gray-700 has-focus-visible:ring-2 has-focus-visible:ring-ring",
                      recipient === value &&
                        "border-primary bg-primary/5 font-medium text-primary",
                    )}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register("recipient")}
                      className="size-3.5 accent-primary"
                    />
                    {label}
                  </label>
                ))}
              </div>
              {errors.recipient && (
                <p className="text-sm text-destructive">
                  {errors.recipient.message}
                </p>
              )}
            </fieldset>

            <NormalFormTextarea<CheckinFormValues>
              register={register}
              name="message"
              label={t("Checkin.messageLabel")}
              placeholder={t("Checkin.messagePlaceholder")}
              disabled={isSubmitting}
              maxLength={CHECKIN_MESSAGE_MAX_LENGTH}
              rows={3}
              textareaClassName="min-h-20"
              errors={errors}
            />

            <NormalFormTextarea<CheckinFormValues>
              register={register}
              name="reason"
              label={t("Checkin.reasonLabel")}
              labelClassName="text-xs"
              placeholder={t("Checkin.reasonPlaceholder")}
              disabled={isSubmitting}
              maxLength={CHECKIN_REASON_MAX_LENGTH}
              description={t("Checkin.reasonHint", {
                min: CHECKIN_REASON_MIN_LENGTH,
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
                {t("Checkin.back")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-10 text-[13px]"
              aria-busy={isSubmitting}
              disabled={
                isSubmitting ||
                !message.trim() ||
                reason.trim().length < CHECKIN_REASON_MIN_LENGTH
              }
            >
              {isSubmitting && <Spinner />}
              {t("Checkin.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

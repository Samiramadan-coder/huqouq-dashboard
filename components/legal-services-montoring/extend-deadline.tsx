import { useAppFormatter } from "@/hooks/use-app-formatter";
import { DATE_TIME_FORMAT } from "@/lib/format";
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
  EXTEND_DEADLINE_DAYS,
  EXTEND_REASON_MAX_LENGTH,
  EXTEND_REASON_MIN_LENGTH,
  ExtendDeadlineFormValues,
  extendDeadlineSchema,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMemo, useState } from "react";
import NormalFormSelect from "../form/select";
import { ArrowRight, CalendarClock } from "lucide-react";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { extendLegalServiceDeadline } from "@/lib/legal-services-monitoring";

const DAY_MS = 24 * 60 * 60 * 1000;

// "Extend deadline" button with a dialog asking for the extra days and the
// reason. Shows the current and resulting delivery deadline when one is set.
export default function ExtendDeadline({
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
  const format = useAppFormatter();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const schema = useMemo(
    () => extendDeadlineSchema((key) => t(`ExtendDeadline.${key}`)),
    [t],
  );

  const {
    control,
    register,
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ExtendDeadlineFormValues>({
    defaultValues: { days: 1, reason: "" },
    resolver: zodResolver(schema),
  });

  const [days, reason] = useWatch({ control, name: ["days", "reason"] });

  const dayOptions = EXTEND_DEADLINE_DAYS.map((value) => ({
    value,
    label: t("ExtendDeadline.dayOption", { count: value }),
  }));

  const currentDeadline = service.delivery_deadline
    ? new Date(service.delivery_deadline)
    : null;
  const newDeadline =
    currentDeadline && days
      ? new Date(currentDeadline.getTime() + days * DAY_MS)
      : null;

  const onSubmit: SubmitHandler<ExtendDeadlineFormValues> = async (data) => {
    try {
      const result = await extendLegalServiceDeadline(data, service.id);

      if (result.success) {
        toast.success(result.message || t("ExtendDeadline.success"));
        reset();
        setOpen(false);
        onSuccess();
        return;
      }

      if (result.errors?.days || result.errors?.reason) {
        for (const field of ["days", "reason"] as const) {
          const message = result.errors[field];
          if (message) setError(field, { type: "server", message });
        }
        return;
      }

      toast.error(
        t(
          result.error === "forbidden"
            ? "ExtendDeadline.forbidden"
            : "ExtendDeadline.failure",
        ),
      );
    } catch {
      toast.error(t("ExtendDeadline.failure"));
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
          <CalendarClock className="size-3.5" />
          {t("Actions.extendDeadline")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1.5 px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-[15px] font-bold text-primary">
            {t("ExtendDeadline.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {t("ExtendDeadline.description")}
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

            {currentDeadline && newDeadline && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-[13px]">
                <div>
                  <p className="text-[11px] text-gray-500">
                    {t("ExtendDeadline.currentDeadline")}
                  </p>
                  <p className="font-semibold text-gray-700">
                    {format.dateTime(currentDeadline, DATE_TIME_FORMAT)}
                  </p>
                </div>
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 text-gray-400 rtl:rotate-180"
                />
                <div className="text-end">
                  <p className="text-[11px] text-gray-500">
                    {t("ExtendDeadline.newDeadline")}
                  </p>
                  <p className="font-semibold text-primary">
                    {format.dateTime(newDeadline, DATE_TIME_FORMAT)}
                  </p>
                </div>
              </div>
            )}

            <NormalFormSelect<ExtendDeadlineFormValues>
              control={control}
              name="days"
              label={t("ExtendDeadline.daysLabel")}
              placeholder={t("ExtendDeadline.daysPlaceholder")}
              options={dayOptions}
              disabled={isSubmitting}
              dir={locale === "ar" ? "rtl" : "ltr"}
              required
            />

            <NormalFormTextarea<ExtendDeadlineFormValues>
              register={register}
              name="reason"
              label={t("ExtendDeadline.reasonLabel")}
              labelClassName="text-xs"
              placeholder={t("ExtendDeadline.reasonPlaceholder")}
              disabled={isSubmitting}
              maxLength={EXTEND_REASON_MAX_LENGTH}
              description={t("ExtendDeadline.reasonHint", {
                min: EXTEND_REASON_MIN_LENGTH,
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
                {t("ExtendDeadline.back")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-10 text-[13px]"
              aria-busy={isSubmitting}
              disabled={
                isSubmitting ||
                !days ||
                reason.trim().length < EXTEND_REASON_MIN_LENGTH
              }
            >
              {isSubmitting && <Spinner />}
              {t("ExtendDeadline.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

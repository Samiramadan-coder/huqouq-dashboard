"use client";

import {
  PAYOUT_HOLD_UNITS,
  PayoutHoldUnit,
  PayoutTiming,
  payoutTimingSchema,
} from "@/types/settings";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import NormalFormInput from "../form/input";
import { ArrowRight, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateFinancialSettings } from "@/lib/settings";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";

const PRESETS = [0, 3, 5, 7, 14];

// Hold periods that equal one working / calendar week, labelled "(1 week)".
const WEEK_LENGTH: Partial<Record<PayoutHoldUnit, number>> = {
  business_days: 5,
  calendar_days: 7,
};

// PayoutTimingCard configures how long funds are held before they become available for payout.
export default function PayoutTimingCard({
  defaultValues,
}: {
  defaultValues: PayoutTiming;
}) {
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PayoutTiming>({
    resolver: zodResolver(payoutTimingSchema),
    defaultValues,
  });

  const [watchedPeriod, unit] = useWatch({
    control,
    name: ["payout_hold_period", "payout_hold_unit"],
  });
  // Empty number inputs yield NaN, so fall back to 0 for derived values.
  const period = Number.isFinite(watchedPeriod) ? watchedPeriod : 0;

  const changePeriod = (value: number) =>
    setValue("payout_hold_period", Math.max(Math.round(value), 0), {
      shouldDirty: true,
      shouldValidate: true,
    });

  const duration = t(`payoutDuration.${unit}`, { count: period });

  const presetLabel = (preset: number) => {
    if (preset === 0) return t("payoutInstant");

    const label =
      unit === "hours"
        ? t("payoutPresetHours", { count: preset })
        : t("payoutPresetDays", { count: preset });

    return WEEK_LENGTH[unit] === preset
      ? t("payoutPresetWeek", { label })
      : label;
  };

  const onSubmit: SubmitHandler<PayoutTiming> = async (formData) => {
    const result = await updateFinancialSettings(formData);

    if (result.success) {
      toast.success(result.message);
      // Make the saved values the new baseline so the form is no longer dirty.
      reset(formData);
      return;
    }

    const serverErrors = Object.entries(result.errors ?? {}).filter(
      ([, message]) => message,
    );

    if (serverErrors.length === 0) {
      toast.error(tCommon("ErrorOccurred"));
      return;
    }

    serverErrors.forEach(([field, message]) => {
      toast.error(message);
      if (field in payoutTimingSchema.shape) {
        setError(field as keyof PayoutTiming, { type: "server", message });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-[13px] font-semibold text-gray-700">
          {t("payoutTiming")}
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5">
        <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
          {t("payoutHoldPeriod")}
        </label>

        <div className="flex flex-wrap gap-2 items-start">
          <NormalFormInput
            register={register}
            name="payout_hold_period"
            required
            errors={errors}
            min={0}
            step={1}
            type="number"
            className="w-24"
            inputClassName="text-center"
          />

          <Button
            type="button"
            className="h-10 w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            disabled={period <= 0}
            onClick={() => changePeriod(period - 1)}
          >
            -
          </Button>

          <Button
            type="button"
            className="h-10 w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            onClick={() => changePeriod(period + 1)}
          >
            +
          </Button>

          <Controller
            control={control}
            name="payout_hold_unit"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="data-[size=default]:h-10 min-w-36 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYOUT_HOLD_UNITS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`payoutUnits.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Button
            type="submit"
            className="h-10 px-4 text-[13px]"
            disabled={isSubmitting || !isDirty}
          >
            <Save />
            {t("save")}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              aria-pressed={period === preset}
              className={cn(
                "h-8 px-3 text-xs bg-transparent text-gray-700 border-gray-200 hover:bg-primary hover:text-white",
                period === preset && "bg-primary text-white",
              )}
              onClick={() => changePeriod(preset)}
            >
              {presetLabel(preset)}
            </Button>
          ))}
        </div>

        <p className="mt-2 text-[11px] text-gray-400">
          {period === 0
            ? t("payoutHintInstant")
            : t("payoutHint", { duration })}
        </p>

        <FundLifecycle pendingLabel={period > 0 ? duration : undefined} />
      </form>
    </div>
  );
}

// FundLifecycle visualises the stages funds go through before being paid out.
function FundLifecycle({ pendingLabel }: { pendingLabel?: string }) {
  const t = useTranslations("Settings");

  const steps = [
    {
      label: t("lifecycleSessionEnds"),
      className: "bg-white border-blue-200 text-blue-700",
    },
    pendingLabel && {
      label: t("lifecyclePending", { duration: pendingLabel }),
      className: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      label: t("lifecycleReady"),
      className: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      label: t("lifecycleAdminProcesses"),
      className: "bg-white border-blue-200 text-blue-700",
    },
  ].filter((step) => !!step);

  return (
    <div className="mt-4 p-4 rounded-lg bg-blue-50/60 border border-blue-100">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700 mb-2.5">
        {t("fundLifecycle")}
      </p>

      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center gap-2">
            {index > 0 && (
              <ArrowRight
                className="size-4 shrink-0 text-gray-400 rtl:rotate-180"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "px-3 py-1.5 rounded-md border text-[12px]",
                step.className,
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import {
  FeePercentage,
  FinancialSettings,
  FeePercentageKey,
  feePercentageSchema,
  FinancialSettingsMeta,
} from "@/types/settings";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import type { ReactNode } from "react";
import { Info, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import NormalFormInput from "../form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import PayoutTimingCard from "./payout-timing";
import { updateFinancialSettings } from "@/lib/settings";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";

const AGREEMENT_EXAMPLE_AMOUNT = 2000;
const LEGAL_SERVICES_EXAMPLE_AMOUNT = 5000;
const CONSULTATION_EXAMPLE_AMOUNT = 320;

export default function Financial({
  data,
  meta,
}: {
  data: FinancialSettings;
  meta: FinancialSettingsMeta;
}) {
  const t = useTranslations("Settings");

  return (
    <div className="space-y-4">
      <FeeSettingCard
        settingKey="agreement_confirmation_fee_percentage"
        title={t("agreementConfirmFee")}
        hint={t("agreementHint")}
        presets={[2, 3, 5, 7.5, 10]}
        tone="blue"
        defaultValue={data.agreement_confirmation_fee_percentage}
        meta={meta}
        renderExample={(percentage) =>
          t("exampleAgreementConfirmFee", {
            agreementConfirmationFee: percentage,
            feePercentageOf200AED: percentOf(
              AGREEMENT_EXAMPLE_AMOUNT,
              percentage,
            ),
          })
        }
      />

      <FeeSettingCard
        settingKey="legal_services_fee_percentage"
        title={t("legalServicesFee")}
        hint={t("legalServicesFeeHint")}
        presets={[5, 10, 15, 20]}
        tone="purple"
        defaultValue={data.legal_services_fee_percentage}
        meta={meta}
        renderExample={(percentage) => {
          const platformFee = percentOf(
            LEGAL_SERVICES_EXAMPLE_AMOUNT,
            percentage,
          );

          return t("exampleLegalServicesFee", {
            legalServicesFee: percentage,
            platformFee,
            lawyerReceives: LEGAL_SERVICES_EXAMPLE_AMOUNT - platformFee,
          });
        }}
      />

      <FeeSettingCard
        settingKey="consultations_fee_percentage"
        title={"Consultations Platform Fee"}
        hint={
          "Percentage taken from each transaction before crediting the lawyer's balance. Currently 0% during launch period."
        }
        presets={[0, 5, 10, 15, 20]}
        tone="blue"
        defaultValue={data.consultations_fee_percentage}
        meta={meta}
        renderExample={(percentage) => {
          const platformFee = percentOf(
            CONSULTATION_EXAMPLE_AMOUNT,
            percentage,
          );

          return t("exampleConsultationFee", {
            platformFee,
            lawyerFee: CONSULTATION_EXAMPLE_AMOUNT - platformFee,
          });
        }}
      />

      <PayoutTimingCard
        defaultValues={{
          payout_hold_period: data.payout_hold_period,
          payout_hold_unit: data.payout_hold_unit,
        }}
      />
    </div>
  );
}

// Returns `percentage`% of `amount`, rounded to 2 decimals to avoid float noise.
function percentOf(amount: number, percentage: number) {
  return Math.round(amount * percentage) / 100;
}

// Rounds a value to the precision of the step so +/- never yields 0.30000000000000004.
function roundToStep(value: number, step: number) {
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(value.toFixed(decimals));
}

const TONES = {
  blue: {
    box: "bg-blue-50/60 border-blue-100",
    icon: "text-blue-400",
    text: "text-blue-700",
  },
  purple: {
    box: "bg-purple-50/60 border-purple-100",
    icon: "text-purple-400",
    text: "text-purple-800",
  },
} as const;

// FeeSettingCard renders a form for configuring a single financial fee percentage.
function FeeSettingCard({
  settingKey,
  title,
  hint,
  presets,
  tone,
  defaultValue,
  meta,
  renderExample,
}: {
  settingKey: FeePercentageKey;
  title: string;
  hint: string;
  presets: number[];
  tone: keyof typeof TONES;
  defaultValue: number;
  meta: FinancialSettingsMeta;
  renderExample: (percentage: number) => ReactNode;
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
  } = useForm<FeePercentage>({
    resolver: zodResolver(feePercentageSchema(meta.max, meta.min)),
    defaultValues: { percentage: defaultValue },
  });

  const watched = useWatch({ control, name: "percentage" });
  // Empty number inputs yield NaN, so fall back to 0 for derived values.
  const percentage = Number.isFinite(watched) ? watched : 0;

  const changeValue = (value: number) =>
    setValue(
      "percentage",
      roundToStep(Math.min(Math.max(value, meta.min), meta.max), meta.step),
      { shouldDirty: true, shouldValidate: true },
    );

  const onSubmit: SubmitHandler<FeePercentage> = async (formData) => {
    const result = await updateFinancialSettings({
      [settingKey]: formData.percentage,
    });

    if (result.success) {
      toast.success(result.message);
      // Make the saved value the new baseline so the form is no longer dirty.
      reset({ percentage: formData.percentage });
      return;
    }

    const serverErrors = Object.values(result.errors ?? {}).filter(Boolean);

    if (serverErrors.length === 0) {
      toast.error(tCommon("ErrorOccurred"));
      return;
    }

    serverErrors.forEach((message) => toast.error(message));
    setError("percentage", { type: "server", message: serverErrors[0] });
  };

  const toneClasses = TONES[tone];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-[13px] font-semibold text-gray-700">{title}</h3>
      </div>

      <div className="p-5">
        <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
          {title} (%)
        </label>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-wrap gap-2 items-start"
        >
          <NormalFormInput
            register={register}
            name="percentage"
            suffix="%"
            required
            errors={errors}
            min={meta.min}
            max={meta.max}
            step={meta.step}
            type="number"
          />

          <Button
            type="button"
            className="h-10 w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            disabled={percentage <= meta.min}
            onClick={() => changeValue(percentage - meta.step)}
          >
            -
          </Button>

          <Button
            type="button"
            className="h-10 w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            disabled={percentage >= meta.max}
            onClick={() => changeValue(percentage + meta.step)}
          >
            +
          </Button>

          {presets.map((preset) => (
            <FixedButton
              key={preset}
              onClick={() => changeValue(preset)}
              percentage={preset}
              isActive={percentage === preset}
            />
          ))}

          <Button
            type="submit"
            className="h-10 px-4 text-[13px]"
            disabled={isSubmitting || !isDirty}
          >
            <Save />
            {t("save")}
          </Button>
        </form>

        <div
          className={cn(
            "mt-4 p-3 rounded-lg border flex items-center gap-2",
            toneClasses.box,
          )}
        >
          <Info
            className={cn("shrink-0 size-4", toneClasses.icon)}
            aria-hidden="true"
          />
          <p className={cn("text-[12px]", toneClasses.text)}>
            {renderExample(percentage)}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-gray-400">{hint}</p>
      </div>
    </div>
  );
}

// FixedButton component represents a button that sets a preset fee percentage.
function FixedButton({
  onClick,
  percentage,
  isActive,
}: {
  onClick?: () => void;
  percentage: number;
  isActive?: boolean;
}) {
  return (
    <Button
      type="button"
      aria-pressed={isActive}
      className={cn(
        "h-10 w-12 text-xs bg-transparent text-gray-700 border-gray-200 hover:bg-primary hover:text-white",
        isActive && "bg-primary text-white",
      )}
      onClick={onClick}
    >
      {percentage}%
    </Button>
  );
}

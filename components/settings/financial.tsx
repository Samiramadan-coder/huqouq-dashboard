"use client";

import {
  LegalServicesFee,
  FinancialSettings,
  FinancialSettingsMeta,
  legalServicesFeeSchema,
  AgreementConfirmationFee,
  agreementConfirmationFeeSchema,
} from "@/types/settings";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Info, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import NormalFormInput from "../form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import {
  updateAgreementConfirmationFee,
  updateLegalServicesFee,
} from "@/lib/settings";
import { toast } from "sonner";

export default function Financial({
  data,
  meta,
}: {
  data: FinancialSettings;
  meta: FinancialSettingsMeta;
}) {
  return (
    <div className="space-y-4">
      <AgreementConfirmationFeeSettings data={data} meta={meta} />
      <LegalServicesFeeSettings data={data} meta={meta} />
    </div>
  );
}

// AgreementConfirmationFeeSettings component handles the configuration of the agreement confirmation fee settings.
function AgreementConfirmationFeeSettings({
  data,
  meta,
}: {
  data: FinancialSettings;
  meta: FinancialSettingsMeta;
}) {
  const t = useTranslations("Settings");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AgreementConfirmationFee>({
    resolver: zodResolver(agreementConfirmationFeeSchema(meta.max, meta.min)),
    defaultValues: {
      agreement_confirmation_fee_percentage:
        data.agreement_confirmation_fee_percentage,
    },
  });

  const agreementConfirmationFee = useWatch({
    control: control,
    name: "agreement_confirmation_fee_percentage",
  });

  const onSubmit: SubmitHandler<AgreementConfirmationFee> = async (
    formData,
  ) => {
    const result = await updateAgreementConfirmationFee(
      formData.agreement_confirmation_fee_percentage,
    );

    if (result.success) {
      toast.success(result.message);
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof AgreementConfirmationFee, {
          type: "server",
          message,
        });
      });

      return;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-[13px] font-semibold text-gray-700">
          {t("agreementConfirmFee")}
        </h3>
      </div>

      <div className="p-5">
        <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
          {t("agreementConfirmFee")} (%)
        </label>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2 items-center"
        >
          <NormalFormInput
            register={register}
            name="agreement_confirmation_fee_percentage"
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
            className="w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            onClick={() =>
              setValue(
                "agreement_confirmation_fee_percentage",
                Math.max((agreementConfirmationFee || 0) - meta.step, meta.min),
              )
            }
          >
            -
          </Button>

          <Button
            type="button"
            className="w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            onClick={() =>
              setValue(
                "agreement_confirmation_fee_percentage",
                Math.min((agreementConfirmationFee || 0) + meta.step, meta.max),
              )
            }
          >
            +
          </Button>

          <FixedButton
            onClick={() => setValue("agreement_confirmation_fee_percentage", 2)}
            percentage={2}
            isActive={agreementConfirmationFee === 2}
          />

          <FixedButton
            onClick={() => setValue("agreement_confirmation_fee_percentage", 3)}
            percentage={3}
            isActive={agreementConfirmationFee === 3}
          />

          <FixedButton
            onClick={() => setValue("agreement_confirmation_fee_percentage", 5)}
            percentage={5}
            isActive={agreementConfirmationFee === 5}
          />

          <FixedButton
            onClick={() =>
              setValue("agreement_confirmation_fee_percentage", 7.5)
            }
            percentage={7.5}
            isActive={agreementConfirmationFee === 7.5}
          />

          <FixedButton
            onClick={() =>
              setValue("agreement_confirmation_fee_percentage", 10)
            }
            percentage={10}
            isActive={agreementConfirmationFee === 10}
          />

          <Button
            type="submit"
            className="h-10 px-4 text-[13px]"
            disabled={isSubmitting}
          >
            <Save />
            {t("save")}
          </Button>
        </form>

        <div className="mt-4 p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center gap-2">
          <Info className="text-blue-400 shrink-0 size-4" aria-hidden="true" />
          <p className="text-[12px] text-blue-700">
            {t("exampleAgreementConfirmFee", {
              agreementConfirmationFee,
              feePercentageOf200AED: (agreementConfirmationFee / 100) * 2000,
            })}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-gray-400">{t("agreementHint")}</p>
      </div>
    </div>
  );
}

// PlatformFeeSettings component handles the configuration of the platform fee settings.
function LegalServicesFeeSettings({
  data,
  meta,
}: {
  data: FinancialSettings;
  meta: FinancialSettingsMeta;
}) {
  const t = useTranslations("Settings");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LegalServicesFee>({
    resolver: zodResolver(legalServicesFeeSchema(meta.max, meta.min)),
    defaultValues: {
      legal_services_fee_percentage: data.legal_services_fee_percentage,
    },
  });

  const legalServicesFee = useWatch({
    control: control,
    name: "legal_services_fee_percentage",
  });

  const onSubmit: SubmitHandler<LegalServicesFee> = async (formData) => {
    const result = await updateLegalServicesFee(
      formData.legal_services_fee_percentage,
    );

    if (result.success) {
      toast.success(result.message);
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof LegalServicesFee, {
          type: "server",
          message,
        });
      });

      return;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <h3 className="text-[13px] font-semibold text-gray-700">
          {t("legalServicesFee")}
        </h3>
      </div>

      <div className="p-5">
        <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
          {t("legalServicesFee")} (%)
        </label>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2 items-center"
        >
          <NormalFormInput
            register={register}
            name="legal_services_fee_percentage"
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
            className="w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            onClick={() =>
              setValue(
                "legal_services_fee_percentage",
                Math.max((legalServicesFee || 0) - meta.step, meta.min),
              )
            }
          >
            -
          </Button>

          <Button
            type="button"
            className="w-8 font-bold bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
            onClick={() =>
              setValue(
                "legal_services_fee_percentage",
                Math.min((legalServicesFee || 0) + meta.step, meta.max),
              )
            }
          >
            +
          </Button>

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 5)}
            percentage={5}
            isActive={legalServicesFee === 5}
          />

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 10)}
            percentage={10}
            isActive={legalServicesFee === 10}
          />

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 15)}
            percentage={15}
            isActive={legalServicesFee === 15}
          />

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 20)}
            percentage={20}
            isActive={legalServicesFee === 20}
          />

          <Button
            type="submit"
            className="h-10 px-4 text-[13px]"
            disabled={isSubmitting}
          >
            <Save />
            {t("save")}
          </Button>
        </form>

        <div className="mt-4 p-3 rounded-lg bg-purple-50/60 border border-purple-100 flex items-center gap-2">
          <Info
            className="text-purple-400 shrink-0 size-4"
            aria-hidden="true"
          />
          <p className="text-[12px] text-purple-800">
            {t("exampleLegalServicesFee", {
              legalServicesFee: legalServicesFee || 0,
              platformFee: ((legalServicesFee || 0) * 5000) / 100,
              lawyerReceives: 5000 - ((legalServicesFee || 0) * 5000) / 100,
            })}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-gray-400">
          Huqouq deducts this % from each Legal Service payment before
          transferring the remainder to the lawyer. Example: 10% of AED 5,000 =
          AED 500 platform fee, AED 4,500 to lawyer.
        </p>
      </div>
    </div>
  );
}

// FixedButton component represents a button with a fixed percentage value for the legal services fee.
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
      className={cn(
        "w-12 text-xs bg-transparent text-gray-700 border-gray-200 hover:bg-primary hover:text-white",
        isActive && "bg-primary text-white",
      )}
      onClick={onClick}
    >
      {percentage}%
    </Button>
  );
}

"use client";

import {
  FinancialSettings,
  AgreementConfirmationFee,
  agreementConfirmationFeeSchema,
  FinancialSettingsMeta,
  PlatformFee,
  legalServicesFeeSchema,
} from "@/types/settings";

import { Button } from "../ui/button";
import { Info, Save } from "lucide-react";
import NormalFormInput from "../form/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

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
      <PlatformFeeSettings data={data} meta={meta} />
    </div>
  );
}

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

  const onSubmit: SubmitHandler<AgreementConfirmationFee> = (formData) => {
    console.log(formData);
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
          />

          <FixedButton
            onClick={() => setValue("agreement_confirmation_fee_percentage", 3)}
            percentage={3}
          />

          <FixedButton
            onClick={() => setValue("agreement_confirmation_fee_percentage", 5)}
            percentage={5}
          />

          <FixedButton
            onClick={() =>
              setValue("agreement_confirmation_fee_percentage", 7.5)
            }
            percentage={7.5}
          />

          <FixedButton
            onClick={() =>
              setValue("agreement_confirmation_fee_percentage", 10)
            }
            percentage={10}
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

function PlatformFeeSettings({
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
    formState: { errors, isSubmitting },
  } = useForm<PlatformFee>({
    resolver: zodResolver(legalServicesFeeSchema(meta.max, meta.min)),
    defaultValues: {
      legal_services_fee_percentage: data.legal_services_fee_percentage,
    },
  });

  const legalServicesFee = useWatch({
    control: control,
    name: "legal_services_fee_percentage",
  });

  const onSubmit: SubmitHandler<PlatformFee> = (formData) => {
    console.log(formData);
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
            onClick={() => setValue("legal_services_fee_percentage", 0)}
            percentage={0}
          />

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 5)}
            percentage={5}
          />

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 10)}
            percentage={10}
          />

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 15)}
            percentage={15}
          />

          <FixedButton
            onClick={() => setValue("legal_services_fee_percentage", 20)}
            percentage={20}
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

function FixedButton({
  onClick,
  percentage,
}: {
  onClick?: () => void;
  percentage: number;
}) {
  return (
    <Button
      type="button"
      className="w-12 text-xs bg-transparent text-gray-700 border-gray-200 hover:bg-transparent"
      onClick={onClick}
    >
      {percentage}%
    </Button>
  );
}

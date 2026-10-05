import z from "zod";

export const agreementConfirmationFeeSchema = (max: number, min: number) =>
  z.object({
    agreement_confirmation_fee_percentage: z.number().min(min).max(max),
  });

export type AgreementConfirmationFee = z.infer<
  ReturnType<typeof agreementConfirmationFeeSchema>
>;

export const legalServicesFeeSchema = (max: number, min: number) =>
  z.object({
    legal_services_fee_percentage: z.number().min(min).max(max),
  });

export type LegalServicesFee = z.infer<
  ReturnType<typeof legalServicesFeeSchema>
>;

export type FinancialSettings = {
  agreement_confirmation_fee_percentage: number;
  legal_services_fee_percentage: number;
};

export type FinancialSettingsMeta = {
  max: number;
  min: number;
  step: number;
};

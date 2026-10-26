import z from "zod";

export const feePercentageSchema = (max: number, min: number) =>
  z.object({
    percentage: z.number().min(min).max(max),
  });

export type FeePercentage = z.infer<ReturnType<typeof feePercentageSchema>>;

export type FinancialSettings = {
  agreement_confirmation_fee_percentage: number;
  legal_services_fee_percentage: number;
  consultations_fee_percentage: number;
};

export type FinancialSettingKey = keyof FinancialSettings;

export type FinancialSettingsMeta = {
  max: number;
  min: number;
  step: number;
};

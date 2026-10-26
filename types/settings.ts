import z from "zod";

export const feePercentageSchema = (max: number, min: number) =>
  z.object({
    percentage: z.number().min(min).max(max),
  });

export type FeePercentage = z.infer<ReturnType<typeof feePercentageSchema>>;

export const PAYOUT_HOLD_UNITS = [
  "business_days",
  "calendar_days",
  "hours",
] as const;

export type PayoutHoldUnit = (typeof PAYOUT_HOLD_UNITS)[number];

export const payoutTimingSchema = z.object({
  payout_hold_period: z.number().int().min(0),
  payout_hold_unit: z.enum(PAYOUT_HOLD_UNITS),
});

export type PayoutTiming = z.infer<typeof payoutTimingSchema>;

export type FinancialSettings = {
  agreement_confirmation_fee_percentage: number;
  legal_services_fee_percentage: number;
  consultations_fee_percentage: number;

  payout_hold_period: number;
  payout_hold_unit: PayoutHoldUnit;
};

export type FinancialSettingKey = keyof FinancialSettings;

export type FeePercentageKey = Extract<
  FinancialSettingKey,
  `${string}_fee_percentage`
>;

export type FinancialSettingsMeta = {
  max: number;
  min: number;
  step: number;
};

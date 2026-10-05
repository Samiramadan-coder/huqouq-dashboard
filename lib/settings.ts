"use server";

import { http, ValidationError } from "@/lib/http";
import { AgreementConfirmationFee, LegalServicesFee } from "@/types/settings";

// Response type for updating the agreement confirmation fee.
type AgreementConfirmationFeeResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof AgreementConfirmationFee, string>>;
    };

export async function updateAgreementConfirmationFee(
  agreement_confirmation_fee_percentage: number,
): Promise<AgreementConfirmationFeeResponse> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/admin/settings/financial`,
      { agreement_confirmation_fee_percentage },
    );

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof AgreementConfirmationFee, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}

// Response type for updating the legal services fee.
type LegalServicesFeeResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof LegalServicesFee, string>>;
    };

export async function updateLegalServicesFee(
  legal_services_fee_percentage: number,
): Promise<LegalServicesFeeResponse> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/admin/settings/financial`,
      { legal_services_fee_percentage },
    );

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof LegalServicesFee, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}

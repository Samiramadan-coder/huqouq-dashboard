"use server";

import { http, ValidationError } from "@/lib/http";
import { FinancialSettingKey, FinancialSettings } from "@/types/settings";

// Response type for updating financial settings.
export type FinancialSettingsResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<FinancialSettingKey, string>>;
    };

// Updates one or more financial settings in a single request.
export async function updateFinancialSettings(
  values: Partial<FinancialSettings>,
): Promise<FinancialSettingsResponse> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/admin/settings/financial`,
      values,
    );

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<FinancialSettingKey, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}

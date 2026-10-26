"use server";

import { http, ValidationError } from "@/lib/http";
import { FinancialSettingKey } from "@/types/settings";

// Response type for updating a single financial setting.
type FinancialSettingResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<FinancialSettingKey, string>>;
    };

export async function updateFinancialSetting(
  key: FinancialSettingKey,
  value: number,
): Promise<FinancialSettingResponse> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/admin/settings/financial`,
      { [key]: value },
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

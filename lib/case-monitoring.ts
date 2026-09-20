import { MessageFormValues } from "@/components/case-monitoring/send-check-in-message";
import { http, ValidationError } from "./http";
import { FlagFormValues } from "@/components/case-monitoring/flag-for-dispute-review";

//
type CheckInMessageResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof MessageFormValues, string>>;
    };

export async function sendCheckInMessage(
  formData: MessageFormValues,
  caseId: number,
): Promise<CheckInMessageResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/case-monitoring/${caseId}/check-in`,
      formData,
    );

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof MessageFormValues, string>>;

      return { success: false, errors };
    }
    return {
      success: false,
    };
  }
}

type FlagForDisputeReviewResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof FlagFormValues, string>>;
    };

export async function flagForDisputeReview(
  formData: FlagFormValues,
  caseId: number,
): Promise<FlagForDisputeReviewResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/case-monitoring/${caseId}/dispute`,
      formData,
    );

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof FlagFormValues, string>>;
      return { success: false, errors };
    }
    return {
      success: false,
    };
  }
}

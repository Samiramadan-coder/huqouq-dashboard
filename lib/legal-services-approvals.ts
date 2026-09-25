"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "./http";
import { RejectFormValues } from "@/components/legal-services-approvals/reject-legal-service";

// Approve Legal Service
type ApproveLegalServiceResult =
  | { success: true; message: string }
  | { success: false };

export async function approveLegalService(
  serviceId: number,
): Promise<ApproveLegalServiceResult> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/legal-service-approvals/${serviceId}/approve`,
    );
    updateTag("legal-services-approvals");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error approving legal service:", error);
    return { success: false };
  }
}

// Reject Legal Service
type RejectLegalServiceResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof RejectFormValues, string>>;
    };

export async function rejectLegalService(
  formData: RejectFormValues,
  serviceId: number,
): Promise<RejectLegalServiceResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/legal-service-approvals/${serviceId}/reject`,
      formData,
    );

    updateTag("legal-services-approvals");
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof RejectFormValues, string>>;
      return { success: false, errors };
    }
    return {
      success: false,
    };
  }
}

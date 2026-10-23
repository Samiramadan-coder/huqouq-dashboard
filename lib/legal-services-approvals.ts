"use server";

import z from "zod";
import { updateTag } from "next/cache";
import { ForbiddenError, http, ValidationError } from "./http";
import {
  ActionFailure,
  ApproveLegalServiceResult,
  LegalServiceApprovalResponse,
  LegalServiceDetailsResult,
  RejectFormValues,
  RejectLegalServiceResult,
  rejectSchema,
} from "@/types/legal-services-approvals";

// Server actions are public endpoints, so every argument is re-validated here.
const serviceIdSchema = z.number().int().positive();
const serverRejectSchema = rejectSchema((key) => key);

// Maps a request error to a failure code without leaking its details.
function toFailure(error: unknown, context: string): ActionFailure {
  if (error instanceof ForbiddenError) return "forbidden";

  console.error(`Legal service approval "${context}" failed:`, error);
  return "failed";
}

// Get Legal Service Details
export async function getLegalServiceDetails(
  serviceId: number,
): Promise<LegalServiceDetailsResult> {
  const id = serviceIdSchema.safeParse(serviceId);
  if (!id.success) return { success: false, error: "failed" };

  try {
    const { data } = await http.get<LegalServiceApprovalResponse>(
      `/api/admin/legal-service-approvals/${id.data}`,
    );

    const { attachments, ...service } = data.data;
    return {
      success: true,
      data: {
        ...service,
        attachments: attachments.map(
          ({ id, mime_type, name, size_bytes, uploaded_at }) => ({
            id,
            mime_type,
            name,
            size_bytes,
            uploaded_at,
          }),
        ),
      },
    };
  } catch (error) {
    return { success: false, error: toFailure(error, "details") };
  }
}

// Approve Legal Service
export async function approveLegalService(
  serviceId: number,
): Promise<ApproveLegalServiceResult> {
  const id = serviceIdSchema.safeParse(serviceId);
  if (!id.success) return { success: false, error: "failed" };

  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/legal-service-approvals/${id.data}/approve`,
    );

    updateTag("legal-services-approvals");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: toFailure(error, "approve") };
  }
}

// Reject Legal Service
export async function rejectLegalService(
  formData: RejectFormValues,
  serviceId: number,
): Promise<RejectLegalServiceResult> {
  const id = serviceIdSchema.safeParse(serviceId);
  const values = serverRejectSchema.safeParse(formData);
  if (!id.success || !values.success) {
    return { success: false, error: "failed" };
  }

  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/legal-service-approvals/${id.data}/reject`,
      values.data,
    );

    updateTag("legal-services-approvals");
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors)
          .filter(([field]) => field in values.data)
          .map(([field, messages]) => [field, messages[0]]),
      ) as Partial<Record<keyof RejectFormValues, string>>;
      return { success: false, error: "failed", errors };
    }

    return { success: false, error: toFailure(error, "reject") };
  }
}

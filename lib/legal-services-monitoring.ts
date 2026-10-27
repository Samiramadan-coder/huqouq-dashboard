"use server";

import z from "zod";
import { updateTag } from "next/cache";
import { ForbiddenError, http, ValidationError } from "./http";
import {
  ActionFailure,
  CancelRefundFormValues,
  CancelRefundResult,
  cancelRefundSchema,
  NoteFormValues,
  AddNoteResult,
  noteSchema,
  LegalServiceDetails,
  LegalServiceDetailsResult,
} from "@/types/legal-services-montoring";

// Server actions are public endpoints, so every argument is re-validated here.
const serviceIdSchema = z.number().int().positive();
const serverNoteSchema = noteSchema((key) => key);
const serverCancelRefundSchema = cancelRefundSchema((key) => key);

// Maps a request error to a failure code without leaking its details.
function toFailure(error: unknown, context: string): ActionFailure {
  if (error instanceof ForbiddenError) return "forbidden";

  console.error(`Legal service monitoring "${context}" failed:`, error);
  return "failed";
}

// Get Legal Service Details
export async function getLegalServiceDetails(
  serviceId: number,
): Promise<LegalServiceDetailsResult> {
  const id = serviceIdSchema.safeParse(serviceId);
  if (!id.success) return { success: false, error: "failed" };

  try {
    const { data } = await http.get<{ data: LegalServiceDetails }>(
      `/api/admin/legal-services-monitoring/${id.data}`,
    );

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: toFailure(error, "details") };
  }
}

// Add Internal Note
export async function addLegalServiceNote(
  formData: NoteFormValues,
  serviceId: number,
): Promise<AddNoteResult> {
  const id = serviceIdSchema.safeParse(serviceId);
  const values = serverNoteSchema.safeParse(formData);
  if (!id.success || !values.success) {
    return { success: false, error: "failed" };
  }

  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/legal-services-monitoring/${id.data}/notes`,
      values.data,
    );

    updateTag("legal-service-monitoring");
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors)
          .filter(([field]) => field in values.data)
          .map(([field, messages]) => [field, messages[0]]),
      ) as Partial<Record<keyof NoteFormValues, string>>;
      return { success: false, error: "failed", errors };
    }

    return { success: false, error: toFailure(error, "notes") };
  }
}

// Cancel & Refund Legal Service
export async function cancelRefundLegalService(
  formData: CancelRefundFormValues,
  serviceId: number,
): Promise<CancelRefundResult> {
  const id = serviceIdSchema.safeParse(serviceId);
  const values = serverCancelRefundSchema.safeParse(formData);
  if (!id.success || !values.success) {
    return { success: false, error: "failed" };
  }

  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/legal-services-monitoring/${id.data}/cancel-refund`,
      values.data,
    );

    updateTag("legal-service-monitoring");
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors)
          .filter(([field]) => field in values.data)
          .map(([field, messages]) => [field, messages[0]]),
      ) as Partial<Record<keyof CancelRefundFormValues, string>>;
      return { success: false, error: "failed", errors };
    }

    return { success: false, error: toFailure(error, "cancel-refund") };
  }
}

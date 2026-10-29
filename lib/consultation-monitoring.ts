"use server";

import {
  ActionFailure,
  ConsultationDetailsResult,
  ConsultationDetailsType,
} from "@/types/consultation-monitoring";
import {
  AddNoteResult,
  CancelRefundFormValues,
  CancelRefundResult,
  cancelRefundSchema,
  NoteFormValues,
  noteSchema,
} from "@/types/legal-services-montoring";
import z from "zod";
import { updateTag } from "next/cache";
import { ForbiddenError, http, ValidationError } from "./http";

// Server actions are public endpoints, so every argument is re-validated here.
const consultationIdSchema = z.number().int().positive();
const serverNoteSchema = noteSchema((key) => key);
const serverCancelRefundSchema = cancelRefundSchema((key) => key);

// Maps a request error to a failure code without leaking its details.
function toFailure(error: unknown, context: string): ActionFailure {
  if (error instanceof ForbiddenError) return "forbidden";

  console.error(`Consultation monitoring "${context}" failed:`, error);
  return "failed";
}

// Get Consultation Details
export async function getConsultationDetails(
  consultationId: number,
): Promise<ConsultationDetailsResult> {
  const id = consultationIdSchema.safeParse(consultationId);
  if (!id.success) return { success: false, error: "failed" };

  try {
    const { data } = await http.get<{ data: ConsultationDetailsType }>(
      `/api/admin/consultations/${id.data}`,
    );

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: toFailure(error, "details") };
  }
}

// Add Internal Note
export async function addConsultationNote(
  formData: NoteFormValues,
  consultationId: number,
): Promise<AddNoteResult> {
  const id = consultationIdSchema.safeParse(consultationId);
  const values = serverNoteSchema.safeParse(formData);
  if (!id.success || !values.success) {
    return { success: false, error: "failed" };
  }

  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/consultations/${id.data}/notes`,
      values.data,
    );

    updateTag("consultation-monitoring");
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

// Cancel & Refund Consultation
export async function cancelRefundConsultation(
  formData: CancelRefundFormValues,
  consultationId: number,
): Promise<CancelRefundResult> {
  const id = consultationIdSchema.safeParse(consultationId);
  const values = serverCancelRefundSchema.safeParse(formData);
  if (!id.success || !values.success) {
    return { success: false, error: "failed" };
  }

  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/consultations/${id.data}/cancel-refund`,
      values.data,
    );

    updateTag("consultation-monitoring");
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

"use server";

import z from "zod";
import { ForbiddenError, http, ValidationError } from "./http";
import {
  CaseMessageFormValues,
  CaseMessageResult,
  caseMessageSchema,
} from "@/types/case-monitoring";

// Server actions are public endpoints, so every argument is re-validated here.
const caseIdSchema = z.number().int().positive();
const serverMessageSchema = caseMessageSchema((key) => key);

// Posts a message-style admin action for a case and maps errors to a safe result.
async function postCaseMessage(
  caseId: number,
  formData: CaseMessageFormValues,
  path: "check-in" | "dispute",
): Promise<CaseMessageResult> {
  const id = caseIdSchema.safeParse(caseId);
  const values = serverMessageSchema.safeParse(formData);
  if (!id.success || !values.success) {
    return { success: false, error: "failed" };
  }

  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/case-monitoring/${id.data}/${path}`,
      values.data,
    );

    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors)
          .filter(([field]) => field in values.data)
          .map(([field, messages]) => [field, messages[0]]),
      ) as Partial<Record<keyof CaseMessageFormValues, string>>;
      return { success: false, error: "failed", errors };
    }

    if (error instanceof ForbiddenError) {
      return { success: false, error: "forbidden" };
    }

    console.error(`Case monitoring "${path}" failed:`, error);
    return { success: false, error: "failed" };
  }
}

// Send Check-in Message
export async function sendCheckInMessage(
  formData: CaseMessageFormValues,
  caseId: number,
): Promise<CaseMessageResult> {
  return postCaseMessage(caseId, formData, "check-in");
}

// Flag for Dispute Review
export async function flagForDisputeReview(
  formData: CaseMessageFormValues,
  caseId: number,
): Promise<CaseMessageResult> {
  return postCaseMessage(caseId, formData, "dispute");
}

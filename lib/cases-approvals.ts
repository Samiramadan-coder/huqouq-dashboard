"use server";

import z from "zod";
import { updateTag } from "next/cache";
import { ForbiddenError, http } from "./http";
import { CaseReviewResult, rejectSchema } from "@/types/case-approvals";

// Server actions are public endpoints, so every argument is re-validated here.
const caseIdSchema = z.number().int().positive();
const serverReasonSchema = rejectSchema((key) => key).shape.reason;

// Sends a review decision for a case and refreshes its cached details on success.
async function review(
  caseId: number,
  decision: "approve" | "reject",
  body?: { reason: string },
): Promise<CaseReviewResult> {
  try {
    await http.post(`/api/admin/case-approvals/${caseId}/${decision}`, body);

    updateTag(`case-approval-${caseId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { success: false, error: "forbidden" };
    }

    console.error(`Case approval "${decision}" failed:`, error);
    return { success: false, error: "failed" };
  }
}

// Reject Case
export async function rejectCase(
  caseId: number,
  reason: string,
): Promise<CaseReviewResult> {
  const id = caseIdSchema.safeParse(caseId);
  const parsedReason = serverReasonSchema.safeParse(reason);
  if (!id.success || !parsedReason.success) {
    return { success: false, error: "failed" };
  }

  return review(id.data, "reject", { reason: parsedReason.data });
}

// Approve Case
export async function approveCase(caseId: number): Promise<CaseReviewResult> {
  const id = caseIdSchema.safeParse(caseId);
  if (!id.success) return { success: false, error: "failed" };

  return review(id.data, "approve");
}

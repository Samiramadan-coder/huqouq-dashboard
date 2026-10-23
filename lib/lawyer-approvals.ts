"use server";

import z from "zod";
import { updateTag } from "next/cache";
import { ForbiddenError, http } from "./http";
import {
  ItemKey,
  itemKeys,
  reasonSchema,
  ReviewActionResult,
} from "@/types/lawyer-approvals";

// Server actions are public endpoints, so every argument is re-validated here.
const lawyerIdSchema = z.number().int().positive();
const sectionSchema = z.enum(itemKeys);
const serverReasonSchema = reasonSchema((key) => key).shape.reason;

// Sends a review request for a lawyer and refreshes their cached details on success.
async function review(
  lawyerId: number,
  path: string,
  body?: Record<string, string>,
): Promise<ReviewActionResult> {
  try {
    await http.post(`/api/admin/lawyer-approvals/${lawyerId}/${path}`, body);

    updateTag(`lawyer-approval-${lawyerId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { success: false, error: "forbidden" };
    }

    console.error(`Lawyer approval request "${path}" failed:`, error);
    return { success: false, error: "failed" };
  }
}

const invalidInput: ReviewActionResult = { success: false, error: "failed" };

// Approve Section
export async function approveSection(
  lawyerId: number,
  section: ItemKey,
): Promise<ReviewActionResult> {
  const id = lawyerIdSchema.safeParse(lawyerId);
  const item = sectionSchema.safeParse(section);
  if (!id.success || !item.success) return invalidInput;

  return review(id.data, `items/${item.data}/approve`);
}

// Flag (reject) Section
export async function flagSection(
  lawyerId: number,
  section: ItemKey,
  reason: string,
): Promise<ReviewActionResult> {
  const id = lawyerIdSchema.safeParse(lawyerId);
  const item = sectionSchema.safeParse(section);
  const parsedReason = serverReasonSchema.safeParse(reason);
  if (!id.success || !item.success || !parsedReason.success) {
    return invalidInput;
  }

  return review(id.data, `items/${item.data}/flag`, {
    reason: parsedReason.data,
  });
}

// Undo Section
export async function undoSection(
  lawyerId: number,
  section: ItemKey,
): Promise<ReviewActionResult> {
  const id = lawyerIdSchema.safeParse(lawyerId);
  const item = sectionSchema.safeParse(section);
  if (!id.success || !item.success) return invalidInput;

  return review(id.data, `items/${item.data}/undo`);
}

// Reject Profile
export async function rejectProfile(
  lawyerId: number,
): Promise<ReviewActionResult> {
  const id = lawyerIdSchema.safeParse(lawyerId);
  if (!id.success) return invalidInput;

  return review(id.data, "reject");
}

// Approve Profile
export async function approveProfile(
  lawyerId: number,
): Promise<ReviewActionResult> {
  const id = lawyerIdSchema.safeParse(lawyerId);
  if (!id.success) return invalidInput;

  return review(id.data, "approve-profile");
}

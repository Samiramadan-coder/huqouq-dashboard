"use server";

import { updateTag } from "next/cache";
import { http } from "./http";

// Reject Profile
export async function rejectCase(
  caseId: number,
): Promise<{ success: boolean }> {
  try {
    await http.post(`/api/admin/case-approvals/${caseId}/reject`);
    updateTag(`case-approval-${caseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error rejecting case:", error);
    return { success: false };
  }
}

// Approve Profile
export async function approveCase(
  caseId: number,
): Promise<{ success: boolean }> {
  try {
    await http.post(`/api/admin/case-approvals/${caseId}/approve`);
    updateTag(`case-approval-${caseId}`);
    return { success: true };
  } catch (error) {
    console.error("Error approving case:", error);
    return { success: false };
  }
}

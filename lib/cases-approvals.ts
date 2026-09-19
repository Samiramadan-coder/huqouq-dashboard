"use server";

import { updateTag } from "next/cache";
import { http } from "./http";

// Reject Profile
type RejectCaseResult = { success: true; message: string } | { success: false };

export async function rejectCase(
  caseId: number,
  reason: string,
): Promise<RejectCaseResult> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/case-approvals/${caseId}/reject`,
      { reason },
    );

    updateTag(`case-approval-${caseId}`);
    return { success: true, message: data.message };
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

"use server";

import { http } from "./http";
import { updateTag } from "next/cache";
import { ItemKey } from "@/types/lawyer-approvals";

// Approve Section
export async function approveSection(
  lawyerId: number,
  section: ItemKey,
): Promise<{ success: boolean }> {
  try {
    await http.post(
      `/api/admin/lawyer-approvals/${lawyerId}/items/${section}/approve`,
    );

    updateTag(`lawyer-approval-${lawyerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error approving section:", error);
    return { success: false };
  }
}

// Reject Section
export async function flagSection(
  lawyerId: number,
  section: ItemKey,
  reason: string,
): Promise<{ success: boolean }> {
  try {
    await http.post(
      `/api/admin/lawyer-approvals/${lawyerId}/items/${section}/flag`,
      { reason },
    );

    updateTag(`lawyer-approval-${lawyerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error flagging section:", error);
    return { success: false };
  }
}

// Undo Section
export async function undoSection(
  lawyerId: number,
  section: ItemKey,
): Promise<{ success: boolean }> {
  try {
    await http.post(
      `/api/admin/lawyer-approvals/${lawyerId}/items/${section}/undo`,
    );
    updateTag(`lawyer-approval-${lawyerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error undoing section:", error);
    return { success: false };
  }
}

// Reject Profile
export async function rejectProfile(
  lawyerId: number,
): Promise<{ success: boolean }> {
  try {
    await http.post(`/api/admin/lawyer-approvals/${lawyerId}/reject`);
    updateTag(`lawyer-approval-${lawyerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error rejecting profile:", error);
    return { success: false };
  }
}

// Approve Profile
export async function approveProfile(
  lawyerId: number,
): Promise<{ success: boolean }> {
  try {
    await http.post(`/api/admin/lawyer-approvals/${lawyerId}/approve-profile`);
    updateTag(`lawyer-approval-${lawyerId}`);
    return { success: true };
  } catch (error) {
    console.error("Error approving profile:", error);
    return { success: false };
  }
}

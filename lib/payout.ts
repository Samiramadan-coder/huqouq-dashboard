"use server";

import { updateTag } from "next/cache";

import { http } from "./http";

type PayoutResponse = { success: true; message: string } | { success: false };

export async function confirmPayout(
  lawyerId: number,
  reference: string,
): Promise<PayoutResponse> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/admin/payouts/lawyers/${lawyerId}`,
      { reference },
    );

    updateTag("by-lawyer-data");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error confirming payout:", error);
    return { success: false };
  }
}

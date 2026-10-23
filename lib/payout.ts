"use server";

import z from "zod";
import { updateTag } from "next/cache";

import { ForbiddenError, http } from "./http";
import type { PayoutAccountResult, PayoutsResponse } from "@/types/payouts";

const lawyerIdSchema = z.number().int().positive();

// Returns one lawyer's full bank details, only when an admin explicitly asks to
// see them. The list page itself only ships masked IBANs to the browser.
export async function getPayoutAccount(
  lawyerId: number,
): Promise<PayoutAccountResult> {
  const id = lawyerIdSchema.safeParse(lawyerId);
  if (!id.success) return { success: false, error: "not_found" };

  try {
    // There is no per-lawyer endpoint, so read the row from the payouts list.
    const { data } = await http.get<PayoutsResponse>("/api/admin/payouts", {
      next: { tags: ["by-lawyer-data"] },
    });
    const row = data.data.find((item) => item.lawyer.id === id.data);

    if (!row?.iban) return { success: false, error: "not_found" };
    return { success: true, iban: row.iban, accountName: row.account_name };
  } catch (error) {
    if (error instanceof ForbiddenError) {
      return { success: false, error: "forbidden" };
    }

    // Log only the error type: the response may contain bank details.
    console.error(
      "Failed to load payout account:",
      error instanceof Error ? error.name : "unknown error",
    );
    return { success: false, error: "failed" };
  }
}

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

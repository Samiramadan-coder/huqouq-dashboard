"use server";

import z from "zod";
import { ForbiddenError, http } from "./http";
import {
  ActionFailure,
  LegalServiceDetails,
  LegalServiceDetailsResult,
} from "@/types/legal-services-montoring";

// Server actions are public endpoints, so every argument is re-validated here.
const serviceIdSchema = z.number().int().positive();

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

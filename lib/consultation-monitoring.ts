"use server";

import {
  ActionFailure,
  ConsultationDetailsResult,
  ConsultationDetailsType,
} from "@/types/consultation-monitoring";
import { ForbiddenError, http } from "./http";
import z from "zod";

const consultationIdSchema = z.number().int().positive();

function toFailure(error: unknown, context: string): ActionFailure {
  if (error instanceof ForbiddenError) return "forbidden";

  console.error(`Legal service monitoring "${context}" failed:`, error);
  return "failed";
}

// Get Legal Service Details
export async function getConsultationDetails(
  serviceId: number,
): Promise<ConsultationDetailsResult> {
  const id = consultationIdSchema.safeParse(serviceId);
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

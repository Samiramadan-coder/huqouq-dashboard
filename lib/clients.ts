"use server";

import z from "zod";
import { ForbiddenError, http, HttpError } from "./http";
import { ClientDetailsResponse, ClientDetailsResult } from "@/types/clients";

// Server actions are public endpoints, so the id is re-validated here.
const clientIdSchema = z.number().int().positive();

// Get Client Details — returns only the fields the details sheet displays.
export async function getClientDetails(
  clientId: number,
): Promise<ClientDetailsResult> {
  const id = clientIdSchema.safeParse(clientId);
  if (!id.success) return { success: false, error: "not_found" };

  try {
    const { data } = await http.get<ClientDetailsResponse>(
      `/api/admin/clients/${id.data}`,
    );
    const { data: client, activity, history } = data;

    return {
      success: true,
      activity,
      history,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        city: client.city,
        country: client.country,
        joined_at: client.joined_at,
        last_active_at: client.last_active_at,
        status: client.status,
        status_label: client.status_label,
      },
    };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return { success: false, error: "not_found" };
    }
    if (error instanceof ForbiddenError) {
      return { success: false, error: "forbidden" };
    }

    console.error("Failed to fetch client details:", error);
    return { success: false, error: "failed" };
  }
}

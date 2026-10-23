"use server";

import z from "zod";
import { ForbiddenError, http, HttpError } from "./http";
import { LawyerDetailsResponse, LawyerDetailsResult } from "@/types/lawyers";

// Server actions are public endpoints, so the id is re-validated here.
const lawyerIdSchema = z.number().int().positive();

// Get Lawyer Details — returns only the fields the details sheet displays.
export async function getLawyerDetails(
  lawyerId: number,
): Promise<LawyerDetailsResult> {
  const id = lawyerIdSchema.safeParse(lawyerId);
  if (!id.success) return { success: false, error: "not_found" };

  try {
    const { data } = await http.get<LawyerDetailsResponse>(
      `/api/admin/lawyers/${id.data}`,
    );
    const { data: lawyer, activity, history } = data;
    const { profile } = lawyer;

    return {
      success: true,
      activity,
      history,
      lawyer: {
        id: lawyer.id,
        name: lawyer.name,
        email: lawyer.email,
        phone: lawyer.phone,
        city: lawyer.city,
        country: lawyer.country,
        joined_at: lawyer.joined_at,
        profile_status: lawyer.profile_status,
        status_label: lawyer.status_label,
        account_type_label: lawyer.account_type_label,
        specializations: lawyer.specializations,
        profile: {
          years_of_experience: profile.years_of_experience,
          languages: profile.languages,
          bio: profile.bio,
          bar_number: profile.bar_number,
          education: profile.education.map(({ id, degree, description }) => ({
            id,
            degree,
            description,
          })),
          experience: profile.experience.map(
            ({ id, title, organization, start_year, end_year }) => ({
              id,
              title,
              organization,
              start_year,
              end_year,
            }),
          ),
        },
      },
    };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return { success: false, error: "not_found" };
    }
    if (error instanceof ForbiddenError) {
      return { success: false, error: "forbidden" };
    }

    console.error("Failed to fetch lawyer details:", error);
    return { success: false, error: "failed" };
  }
}

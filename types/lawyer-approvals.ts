import z from "zod";
import { T } from "./shared";

export type TableStatus = "pending" | "approved" | "rejected";

export type Education = {
  certificate_path: string | null;
  certificate_url: string | null;
  degree: string;
  description: string;
  graduation_month: number;
  graduation_year: number;
  university: string;
};

export type Experience = {
  certificate_path: null | string;
  certificate_url: null | string;
  description: string;
  end_month: number | null;
  end_year: number | null;
  is_current: boolean;
  organization: string;
  start_month: number;
  start_year: number;
  title: string;
};

export type ItemKey =
  | "professional_info"
  | "specializations_services"
  | "languages_bio"
  | "education"
  | "experience"
  | "bar_certificate";

export type ReviewItem = {
  item: ItemKey;
  item_label: string;
  reason: null | string;
  reviewed_at: null | string;
  reviewed_by: null | string;
  status: "pending" | "approved" | "flagged";
};

export type LawyerProfile = {
  account_type: "freelance" | "company" | "office";
  specializations: { id: number; name: string }[];
  services: { id: number; name: string }[];
  submitted_at: string;
  academic_degree: string;
  academic_degree_label: string;
  bar_certificate_url: string;
  bar_degree: string;
  bar_degree_label: string;
  bar_number: string;
  bio: string;
  completion_percentage: number;
  office_name: string;
  profile_status: "in_review" | "approved" | "needs_fix";
  rejection_reason: string | null;
  website_url: string;
  years_of_experience: number;
  reviewed_at: string | null;
  languages: string[];
  education: Education[];
  experience: Experience[];
  review_items: ReviewItem[];
};

export type Lawyer = {
  city: string;
  country: string;
  created_at: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  id: number;
  last_name: string;
  name: string;
  phone: string;
  phone_verified: boolean;
  photo_url: string | null;
  role: "lawyer";
  status: "pending_approval";
  lawyer_profile: LawyerProfile;
};

export type Counts = {
  approved: number;
  pending: number;
  rejected: number;
};

export const reasonSchema = (t: T) =>
  z.object({
    reason: z.string().min(1, t("reasonIsRequired")),
  });

export type ReasonFormData = z.infer<ReturnType<typeof reasonSchema>>;

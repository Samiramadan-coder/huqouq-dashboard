import z from "zod";
import { Pagination, T } from "./shared";

export type Education = {
  certificate_path: string | null;
  certificate_url: string | null;
  degree: string;
  description: string;
  graduation_month: number;
  graduation_year: number;
  university: string;
  id: number;
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
  id: number;
};

export const itemKeys = [
  "professional_info",
  "specializations_services",
  "languages_bio",
  "education",
  "experience",
  "bar_certificate",
] as const;

export type ItemKey = (typeof itemKeys)[number];

export type ReviewItemStatus = "pending" | "approved" | "flagged";

export type ReviewItem = {
  item: ItemKey;
  item_label: string;
  reason: null | string;
  reviewed_at: null | string;
  reviewed_by: null | string;
  status: ReviewItemStatus;
};

export type AccountType = "freelance" | "company" | "office";

export type ProfileStatus = "in_review" | "approved" | "needs_fix";

export type LawyerProfile = {
  account_type: AccountType;
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
  profile_status: ProfileStatus;
  rejection_reason: string | null;
  website_url: string;
  years_of_experience: number;
  reviewed_by: string | null;
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

// Tabs of the approvals list, in display order.
export const approvalStatuses = ["pending", "approved", "rejected"] as const;

export type ApprovalStatus = (typeof approvalStatuses)[number];

export type Counts = Record<ApprovalStatus, number>;

// Response of `GET /api/admin/lawyer-approvals`.
export type LawyerApprovalsResponse = {
  data: Lawyer[];
  counts: Counts;
  meta: Pagination;
};

// Response of `GET /api/admin/lawyer-approvals/:id`.
export type LawyerApprovalResponse = {
  user: Lawyer;
};

export type ReviewActionResult =
  | { success: true }
  | { success: false; error: "forbidden" | "failed" };

export const reasonSchema = (t: T) =>
  z.object({
    reason: z.string().trim().min(1, t("reasonIsRequired")),
  });

export type ReasonFormData = z.infer<ReturnType<typeof reasonSchema>>;

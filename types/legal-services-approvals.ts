import z from "zod";
import { Pagination, T } from "./shared";

// Tabs of the approvals list, in display order.
export const reviewTabs = ["pending_review", "approved", "rejected"] as const;

export type ReviewTab = (typeof reviewTabs)[number];

export type Counts = Record<ReviewTab, number>;

export type LegalServiceStatus = ReviewTab | "in_progress";

export type Urgency = "urgent" | "very_urgent" | "standard";

type Client = {
  first_name: string;
  id: number;
  initial: string;
  joined_at: string;
  location: string;
  name: string;
};

export type LegalService = {
  client: Client;
  description: string;
  emirate: string;
  id: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  service_type: string;
  service_type_label: string;
  status: LegalServiceStatus;
  status_label: string;
  submitted_at: string;
  urgency: Urgency;
  urgency_label: string;
};

type Attachment = {
  download_url: string;
  id: number;
  mime_type: string;
  name: string;
  size_bytes: number;
  uploaded_at: string;
};

export type LegalServiceDetails = LegalService & {
  attachments: Attachment[];
};

// What the details sheet receives. Files are downloaded through the app's own
// proxy route, so the raw `download_url` never reaches the browser.
export type LegalServiceDetailsView = LegalService & {
  attachments: Omit<Attachment, "download_url">[];
};

// Response of `GET /api/admin/legal-service-approvals`.
export type LegalServicesApprovalsResponse = {
  counts: Counts;
  meta: Pagination;
  urgent_count: number;
  data: LegalService[];
};

// Response of `GET /api/admin/legal-service-approvals/:id`.
export type LegalServiceApprovalResponse = {
  data: LegalServiceDetails;
};

export type ActionFailure = "forbidden" | "failed";

export type LegalServiceDetailsResult =
  | { success: true; data: LegalServiceDetailsView }
  | { success: false; error: ActionFailure };

export type ApproveLegalServiceResult =
  | { success: true; message: string }
  | { success: false; error: ActionFailure };

export type RejectLegalServiceResult =
  | { success: true; message: string }
  | {
      success: false;
      error: ActionFailure;
      errors?: Partial<Record<keyof RejectFormValues, string>>;
    };

export const REJECTION_REASON_MIN_LENGTH = 10;
export const REJECTION_REASON_MAX_LENGTH = 400;

export const rejectSchema = (t: T) =>
  z.object({
    reason: z
      .string()
      .trim()
      .min(REJECTION_REASON_MIN_LENGTH, t("reasonMinLength"))
      .max(REJECTION_REASON_MAX_LENGTH, t("reasonMaxLength")),
  });

export type RejectFormValues = z.infer<ReturnType<typeof rejectSchema>>;

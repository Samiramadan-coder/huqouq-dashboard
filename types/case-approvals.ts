export type Counts = {
  closed: number;
  in_progress: number;
  pending_closure: number;
  pending_fees: number;
  pending_review: number;
  published: number;
  rejected: number;
};

export type UrgencyCounts = {
  critical: number;
  standard: number;
  urgent: number;
  very_urgent: number;
};

export type CaseStatus =
  | "pending_closure"
  | "pending_review"
  | "in_progress"
  | "published"
  | "pending_fees"
  | "has_offers"
  | "hired"
  | "closed"
  | "rejected";

type Client = {
  id: number;
  name: string;
  first_name: string;
  photo_url: string | null;
};

type Specialization = {
  id: number;
  name: string;
};

export type Case = {
  closed_at: null | string;
  closed_by: null | string;
  closing_note: null | string;
  closure_requested_at: null | string;
  display_status: CaseStatus;
  display_status_label: string;
  fee_paid_at: null | string;
  has_offers: boolean;
  hired_at: null | string;
  reviewed_by: null | string;
  can_close: boolean;
  can_edit: boolean;
  chat_unlocked: boolean;
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  city: string;
  client: Client;
  created_at: string;
  description: string;
  documents_count: number;
  id: number;
  offers_count: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  specialization: Specialization;
  status: CaseStatus;
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
};

export type CaseDetails = Case & {
  documents: {
    id: number;
    name: string;
    url: string;
    size_bytes: number;
  }[];
};

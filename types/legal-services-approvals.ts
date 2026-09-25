export type Counts = {
  approved: number;
  pending_review: number;
  rejected: number;
};

type Client = {
  first_name: string;
  id: number;
  initial: string;
  joined_at: string;
  location: string;
  name: string;
};

export type LegalService = {
  description: string;
  emirate: string;
  id: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  service_type: string;
  service_type_label: string;
  status: "pending_review" | "approved" | "rejected";
  status_label: string;
  submitted_at: string;
  urgency: "urgent" | "very_urgent" | "standard";
  urgency_label: string;
  client: Client;
};

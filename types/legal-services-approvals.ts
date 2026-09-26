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
  client: Client;
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

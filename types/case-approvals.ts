export type Counts = {
  approved: number;
  pending_review: number;
  rejected: number;
};

export type CaseStatus = "pending_review" | "approved" | "rejected";

export type CaseDetails = {
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  city: string;
  client: {
    id: number;
    name: string;
    first_name: string;
    photo_url: string | null;
  };
  created_at: string;
  description: string;
  documents_count: number;
  id: number;
  offers_count: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  specialization: {
    id: number;
    name: string;
  };
  status: CaseStatus;
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
  documents: {
    id: number;
    name: string;
    url: string;
    size_bytes: number;
  }[];
};

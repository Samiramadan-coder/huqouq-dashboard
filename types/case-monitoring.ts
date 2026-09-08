export type Counts = {
  all_active: number;
  closed: number;
  in_progress: number;
  needs_attention: number;
  pending_closure: number;
  pending_fees: number;
};

type OfferStatus =
  | "pending"
  | "accepted"
  | "cancelled"
  | "declined"
  | "withdrawn";

type CaseStatus =
  | "pending_closure"
  | "pending_review"
  | "in_progress"
  | "published"
  | "pending_fees"
  | "has_offers"
  | "hired"
  | "closed"
  | "rejected";

type Offer = {
  amount: number;
  created_at: string;
  expected_days: number;
  expected_timeline: string;
  id: number;
  message: string;
  status: OfferStatus;
  status_label: string;
  lawyer: {
    id: number;
    name: string;
    photo_url: string | null;
    years_of_experience: number;
    specializations: string[];
  };
};

type Client = {
  first_name: string;
  id: number;
  name: string;
  photo_url: string | null;
};

type HiredLawyer = {
  id: number;
  name: string;
};

type Payment = {
  agreed_amount: number;
  currency: string;
  fee_percentage: number;
  id: number;
  lawyer_amount: number;
  note: string;
  paid_at: string | null;
  platform_fee: number;
  provider: string | null;
  reference: string;
  status: string;
  status_label: string;
};

type Specialization = {
  id: number;
  name: string;
};

export type CaseMonitoring = {
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  can_close: boolean;
  can_edit: boolean;
  chat_unlocked: boolean;
  city: string;
  closed_at: string | null;
  closed_by: string | null;
  closing_note: string | null;
  closure_requested_at: string | null;
  created_at: string;
  description: string;
  display_status: CaseStatus;
  display_status_label: string;
  documents_count: number;
  fee_paid_at: string | null;
  has_offers: boolean;
  hired_at: string | null;
  id: number;
  offers_count: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  status: CaseStatus;
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
  accepted_offer: Offer;
  client: Client;
  hired_lawyer: HiredLawyer;
  payment: Payment;
  specialization: Specialization;
};

import { CaseStatus } from "./case-approvals";

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
  cases_count: number;
  contact_visible: boolean;
  email: string;
  first_name: string;
  id: number;
  joined_at: string;
  name: string;
  phone: string;
  photo_url: string | null;
};

type HiredLawyer = {
  id: number;
  name: string;
  photo_url: string | null;
  rating: number | null;
  reviews_count: number;
  specialization: string;
  verified: boolean;
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

type AttentionFlag = {
  label: string;
  value: string;
};

export type TimeLine = {
  at: string;
  key:
    | "posted"
    | "approved"
    | "offers"
    | "hired"
    | "pending_fees"
    | "in_progress"
    | "pending_closure"
    | "closed"
    | "reviewed";
  label: string;
  note: string | null;
  state: "done" | "current" | "upcoming";
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
  attention_flags: AttentionFlag[];
  agreed_price: number;
  closure_requested_by: null | string;
  currency: string;
  is_hire_request: boolean;
  last_activity_at: string;
  messages_count: number;
  needs_attention: boolean;
  request_decline_reason: null | string;
  request_declined_at: null | string;
  requested_lawyer: null | HiredLawyer;
  review: null;
  timeline: TimeLine[];
};

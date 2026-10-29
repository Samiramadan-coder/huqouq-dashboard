export type SummaryType = {
  cancelled_30_days: number;
  completed_30_days: number;
  refunds_this_month: number;
  this_week: number;
  upcoming_today: number;
};

export const consultationTabs = [
  "all",
  "upcoming",
  "live",
  "completed",
  "needs_new_time",
  "cancelled",
] as const;

export type ConsultationTab = (typeof consultationTabs)[number];

export type Counts = Record<ConsultationTab, number>;

// Every tab except "all" is also a consultation status.
export type ConsultationStatus = Exclude<ConsultationTab, "all">;

export type FiltersType = {
  tabs: { value: ConsultationTab; label: string }[];
  clients: { id: number; name: string }[];
  lawyers: { id: number; name: string }[];
  sorts: { value: "date_desc" | "date_asc"; label: string }[];
  types: { value: "voice" | "video"; label: string }[];
};

export type Consultation = {
  id: number;
  amount: number;
  client: {
    id: number;
    name: string;
    photo_url: string;
  };
  date: string;
  date_label: string;
  duration_minutes: number;
  ends_at: string;
  lawyer: {
    id: number;
    name: string;
    photo_url: string;
  };
  reference: string;
  refund_amount: number | null;
  starts_at: string;
  status: ConsultationStatus;
  status_label: string;
  time_from: string;
  time_to: string;
  type: "voice" | "video";
  type_label: string;
};

export type ConsultationDetailsType = Consultation & {
  actions: {
    cancel_refund: { available: boolean; reason: string };
  };

  brief: string;
  cancel_reason: null | string;
  cancelled_by: null | string;
  reference: string;
  review: null;
  notes: {
    author: string;
    body: string;
    created_at: string;
    id: number;
  }[];
  parties: {
    client: {
      contact_visible: boolean;
      email: string;
      id: number;
      member_since: string;
      name: string;
      phone: string;
      photo_url: null | string;
    };
    lawyer: null | {
      contact_visible: boolean;
      email: string;
      id: number;
      member_since: string;
      name: string;
      phone: string;
      photo_url: null | string;
      rating: number;
      reviews_count: number;
      specialization: string;
    };
  };
  payment: null | {
    amount: number;
    fee_percentage: number;
    lawyer_amount: number;
    method: null | string;
    paid_at: string;
    platform_fee: number;
    reference: string;
    refund_amount: number;
    refunded_at: null | string;
  };
  payout: {
    detail: null | string;
    label: string;
    paid_at: string;
    ready_at: string;
    reference: string;
    status: "not_started" | "ready" | "paid";
  };
};

export type ActionFailure = "forbidden" | "failed";

export type ConsultationDetailsResult =
  | { success: true; data: ConsultationDetailsType }
  | { success: false; error: ActionFailure };

import { DATE_FORMAT } from "./case-monitoring";

export type Summary = {
  active: number;
  awaiting_approval: number;
  dispute: number;
  held_in_escrow: number;
  need_attention: number;
  revision: number;
};

export type Attention = {
  total: number;
  by_flag: {
    value: "overdue" | "inactive" | "no_decision";
    label: string;
    count: number;
  }[];
};

// Tabs of the monitoring list, in display order.
export const monitoringTabs = [
  "all",
  "has_offers",
  "in_progress",
  "delivered",
  "revision",
  "dispute",
  "completed",
  "closed",
] as const;

export type MonitoringTab = (typeof monitoringTabs)[number];

export type Counts = Record<MonitoringTab, number>;

export type LegalService = {
  agreed_fee: null | number;
  delivery_deadline: null | string;
  first_offer_at: null | string;
  id: number;
  last_activity_at: null | string;
  client: {
    id: number;
    name: string;
    photo_url: string;
  };
  lawyer: null | {
    id: number;
    name: string;
    photo_url: string;
    verified: boolean;
  };
  attention: {
    label: string;
    value: "overdue" | "inactive" | "no_decision";
  }[];
  offers_count: number;
  reference: string;
  review_deadline: null | string;
  revisions: null | number;
  round: null | number;
  service_type: string;
  service_type_label: string;
  status: MonitoringTab;
  status_label: string;
  summary: string;
  urgency: "standard" | "urgent" | "very_urgent";
  urgency_label: string;
};

export type Filters = {
  lawyers: { id: number; name: string }[];
  service_types: { label: string; value: string }[];
  urgencies: { label: string; value: string }[];
  tabs: { value: MonitoringTab; label: string }[];
};

// Shape of a single service from the details endpoint. Same as the list item
// until the details payload is finalized.
export type LegalServiceDetails = LegalService & {
  chat_open: boolean;
  deliveries: {
    delivered_at: string;
    note: string | null;
    round: number;
    took_minutes: number;
    files: {
      download_url: string;
      id: number;
      mime_type: string;
      name: string;
      size_bytes: number;
      uploaded_at: string;
    }[];
    // Null while the client hasn't responded to the delivery yet.
    response: null | {
      at: string;
      by: string;
      note: string;
      type: string;
    };
  }[];
  notes: [];
  offers: {
    accepted: boolean;
    created_at: string;
    delivery_amount: number;
    delivery_time_label: string;
    delivery_unit: string;
    delivery_unit_label: string;
    fee: number;
    id: number;
    message: string;
    outcome: string;
    status: "pending" | "rejected" | "accepted";
    status_label: string;
    updated_at: string;
    lawyer: {
      id: 24;
      name: string;
      photo_url: null | string;
      rating: number;
      reviews_count: number;
      specialization: string;
      verified: boolean;
      years_of_experience: number;
    };
  }[];
  parties: {
    client: {
      city: string;
      city_label: string;
      contact_visible: true;
      email: string;
      id: number;
      member_since: string;
      name: string;
      phone: string;
      photo_url: null | string;
    };
    lawyer: null | {
      city: string;
      city_label: string;
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
      verified: boolean;
    };
  };
  payment: null | {
    amount: number;
    escrow: string;
    escrow_label: string;
    fee_percentage: number;
    lawyer_amount: number;
    paid_at: string;
    platform_fee: number;
    provider: "manual";
    reference: string;
    refunded_amount: number;
    refunded_at: null | string;
    payout: {
      label: string;
      paid_at: null | string;
      ready_at: null | string;
      reference: null | string;
      status: "not_started" | "ready" | "paid";
    };
  };
  request: {
    approved_at: string;
    approved_by: string;
    description: string;
    emirate: string;
    emirate_label: string;
    files: {
      download_url: string;
      id: number;
      mime_type: string;
      name: string;
      size_bytes: number;
      uploaded_at: string;
    }[];
    submitted_at: string;
  };
  actions: {
    approve_on_behalf: { available: boolean; reason: string };
    cancel_refund: { available: boolean; reason: string };
    checkin: { available: boolean; reason: string };
    extend_deadline: { available: boolean; reason: string };
    extend_review: { available: boolean; reason: string };
  };
  activity: {
    category: "system" | "status" | "admin";
    label: string;
    at: string;
    actor: string;
    note: null | string;
  }[];
};

export type ActionFailure = "forbidden" | "failed";

export type LegalServiceDetailsResult =
  | { success: true; data: LegalServiceDetails }
  | { success: false; error: ActionFailure };

export const DATE_TIME_FORMAT = {
  ...DATE_FORMAT,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
} as const satisfies Intl.DateTimeFormatOptions;

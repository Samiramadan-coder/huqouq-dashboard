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
  agreed_fee: number;
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
  status: "has_offers" | "delivered" | "in_progress" | "completed";
  status_label: string;
  summary: string;
  urgency: "standard" | "urgent" | "very_urgent";
  urgency_label: string;
};

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

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

export type FiltersType = {
  tabs: { value: ConsultationTab; label: string }[];
  clients: { id: number; name: string }[];
  lawyers: { id: number; name: string }[];
  sorts: { value: "date_desc" | "date_asc"; label: string }[];
  types: { value: "voice" | "video"; label: string }[];
};

import { Pagination } from "./shared";

export type Counts = {
  active: number;
  flagged: number;
  inactive: number;
  suspended: number;
  total: number;
};

// Values accepted by the list's `status` filter.
export const clientStatusFilters = ["active", "inactive"] as const;

export type ClientStatus = (typeof clientStatusFilters)[number];

export type Client = {
  account_status: string;
  cases_count: number;
  city: string;
  contact_visible: boolean;
  country: string;
  email: string | null;
  first_name: string;
  id: number;
  joined_at: string;
  last_active_at: string | null;
  last_name: string;
  name: string;
  phone: string;
  photo_url: string | null;
  rejected_cases_count: number;
  status: ClientStatus;
  status_label: string;
  consultations_count: number;
};

export type Activity = {
  cases_hired: number;
  cases_posted: number;
  cases_rejected: number;
  consultations_booked: number;
  consultations_completed: number;
  disputes_involved: number;
  // Percentage, 0–100.
  rejection_rate: number;
  reviews_given: number;
};

export type HistoryType = "case" | "consultation";

export type HistoryItem = {
  type: HistoryType;
  at: string;
  detail: string;
  status: string;
  status_label: string;
  title: string;
  amount: number;
};

// Response of `GET /api/admin/clients`.
export type ClientsResponse = {
  counts: Counts;
  data: Client[];
  meta: Pagination;
};

// Response of `GET /api/admin/clients/:id`.
export type ClientDetailsResponse = {
  data: Client;
  activity: Activity;
  history: HistoryItem[];
};

// Only the client fields the details sheet displays.
export type ClientDetailsView = Pick<
  Client,
  | "id"
  | "name"
  | "email"
  | "phone"
  | "city"
  | "country"
  | "joined_at"
  | "last_active_at"
  | "status"
  | "status_label"
>;

export type ClientDetailsResult =
  | {
      success: true;
      client: ClientDetailsView;
      activity: Activity;
      history: HistoryItem[];
    }
  | { success: false; error: "not_found" | "forbidden" | "failed" };

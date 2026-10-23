import { LawyerProfile } from "./lawyer-approvals";
import { Pagination } from "./shared";

export type Counts = {
  approved: number;
  incomplete: number;
  on_leave: number;
  pending: number;
  rejected: number;
  suspended: number;
  total: number;
};

// Values accepted by the list's `status` filter.
export const lawyerStatusFilters = [
  "approved",
  "pending",
  "rejected",
  "incomplete",
] as const;

export type LawyerStatusFilter = (typeof lawyerStatusFilters)[number];

export type LawyerStatus = Exclude<keyof Counts, "total">;

export type ProfileStatus = "in_review" | "approved" | "needs_fix" | "incomplete";

export type Lawyer = {
  account_status: "unverified" | "pending_approval" | "active";
  account_type: null | "freelance" | "company" | "office";
  account_type_label: null | string;
  cases_count: number;
  city: string;
  country: string;
  email: null | string;
  first_name: string;
  id: number;
  joined_at: string;
  last_active_at: null | string;
  last_name: string;
  name: string;
  office_name: null | string;
  phone: string;
  photo_url: null | string;
  profile_status: ProfileStatus;
  rating: null | number;
  reviews_count: number;
  specializations: { id: number; name: string }[];
  status: LawyerStatus;
  status_label: string;
  profile: LawyerProfile;
};

export type Activity = {
  active_cases: number;
  active_offers: number;
  cases_handled: number;
  disputes_involved: number;
  offers_submitted: number;
  rating: number;
  reviews_count: number;
};

export type HistoryType = "case" | "offer";

export type HistoryItem = {
  type: HistoryType;
  at: string;
  detail: string;
  status: string;
  status_label: string;
  title: string;
  amount: number;
};

// Response of `GET /api/admin/lawyers`.
export type LawyersResponse = {
  counts: Counts;
  data: Lawyer[];
  meta: Pagination;
};

// Response of `GET /api/admin/lawyers/:id`.
export type LawyerDetailsResponse = {
  data: Lawyer;
  activity: Activity;
  history: HistoryItem[];
};

// Only the lawyer fields the details sheet displays.
export type LawyerDetailsView = Pick<
  Lawyer,
  | "id"
  | "name"
  | "email"
  | "phone"
  | "city"
  | "country"
  | "joined_at"
  | "profile_status"
  | "status_label"
  | "account_type_label"
  | "specializations"
> & {
  profile: Pick<
    LawyerProfile,
    "years_of_experience" | "languages" | "bio" | "bar_number"
  > & {
    education: Pick<
      LawyerProfile["education"][number],
      "id" | "degree" | "description"
    >[];
    experience: Pick<
      LawyerProfile["experience"][number],
      "id" | "title" | "organization" | "start_year" | "end_year"
    >[];
  };
};

export type LawyerDetailsResult =
  | {
      success: true;
      lawyer: LawyerDetailsView;
      activity: Activity;
      history: HistoryItem[];
    }
  | { success: false; error: "not_found" | "forbidden" | "failed" };

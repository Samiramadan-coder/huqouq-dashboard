export type Counts = {
  approved: number;
  incomplete: number;
  on_leave: number;
  pending: number;
  rejected: number;
  suspended: number;
  total: number;
};

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
  profile_status: "in_review" | "approved" | "needs_fix" | "incomplete";
  rating: null | number;
  reviews_count: number;
  specializations: { id: number; name: string }[];
  status: string;
  status_label: string;
};

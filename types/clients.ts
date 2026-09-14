export type Counts = {
  active: number;
  flagged: number;
  inactive: number;
  suspended: number;
  total: number;
};

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
  last_active_at: string;
  last_name: string;
  name: string;
  phone: string;
  photo_url: string | null;
  rejected_cases_count: number;
  status: "active" | "inactive";
  status_label: string;
};

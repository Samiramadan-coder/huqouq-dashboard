export type Summary = {
  currency: string;
  lawyers_with_balance: number;
  paid_this_month: number;
  ready_for_payout: number;
  total_pending: number;
};

export type ByLawyerData = {
  account_name: string | null;
  can_process_payout: boolean;
  iban: string | null;
  ls_pending: number;
  ls_ready: number;
  payout_details_missing: boolean;
  pending: number;
  ready: number;
  total_paid: number;
  lawyer: {
    id: number;
    name: string;
    photo_url: string;
  };
};

export type AllTransactionsData = {
  amount: number;
  becomes_ready_on: null | string;
  currency: string;
  date: string;
  earned_at: string | null;
  fee_percentage: number;
  gross: number;
  id: string;
  paid_date: null | string;
  paid_reference: null | string;
  payout_id: null | string;
  pending_note: string | null;
  platform_fee: number;
  service_type: string;
  service_type_label: string;
  source_id: number;
  status: "pending" | "ready" | "paid";
  status_label: string;
  type: string;
  type_label: string;
  client: {
    first_name: string;
  };
  lawyer: {
    id: number;
    name: string;
    photo_url: string;
  };
};

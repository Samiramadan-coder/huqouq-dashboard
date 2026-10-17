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

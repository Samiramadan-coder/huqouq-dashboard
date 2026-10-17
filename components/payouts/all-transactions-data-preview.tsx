import { http } from "@/lib/http";

export default async function AllTransactionsDataPreview() {
  const { data } = await http.get("/api/admin/payouts/transactions");

  console.log(data);

  return <div>AllTransactionsDataPreview</div>;
}

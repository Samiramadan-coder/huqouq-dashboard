import { TablePageSkeleton } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return <TablePageSkeleton tabs={3} selects={2} alert columns={6} />;
}

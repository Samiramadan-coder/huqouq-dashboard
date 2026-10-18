import { TablePageSkeleton } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return <TablePageSkeleton title stats={4} tabs={2} search={false} columns={6} />;
}

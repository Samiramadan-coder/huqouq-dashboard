import { TablePageSkeleton } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return <TablePageSkeleton stats={4} tabs={3} search={false} columns={6} />;
}

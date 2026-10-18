import { TablePageSkeleton } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return <TablePageSkeleton stats={4} selects={2} columns={6} />;
}

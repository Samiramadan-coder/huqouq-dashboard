import { TablePageSkeleton } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return <TablePageSkeleton stats={5} tabs={6} selects={4} columns={8} />;
}

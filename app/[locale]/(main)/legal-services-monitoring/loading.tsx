import { TablePageSkeleton } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return (
    <TablePageSkeleton stats={6} tabs={8} selects={3} alert columns={8} />
  );
}

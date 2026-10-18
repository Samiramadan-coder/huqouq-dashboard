import { DetailsPageSkeleton } from "@/components/skeletons/page-skeletons";

export default function Loading() {
  return <DetailsPageSkeleton sections={5} actions={false} />;
}

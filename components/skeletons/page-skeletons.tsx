import {
  FiltersSkeleton,
  PageTitleSkeleton,
  SectionCardSkeleton,
  SkeletonRoot,
  StatCardsSkeleton,
  TableSkeleton,
  TabsSkeleton,
} from "./skeleton-blocks";
import { Skeleton } from "@/components/ui/skeleton";

type TablePageSkeletonProps = {
  title?: boolean;
  stats?: number;
  tabs?: number;
  search?: boolean;
  selects?: number;
  alert?: boolean;
  columns?: number;
};

/** Stats / tabs / filters followed by a data table (list pages). */
export function TablePageSkeleton({
  title = false,
  stats = 0,
  tabs = 0,
  search = true,
  selects = 0,
  alert = false,
  columns = 5,
}: TablePageSkeletonProps) {
  return (
    <SkeletonRoot className="space-y-6 p-4 sm:p-6">
      {title && <PageTitleSkeleton />}
      {stats > 0 && <StatCardsSkeleton count={stats} />}
      {tabs > 0 && <TabsSkeleton count={tabs} />}
      {(search || selects > 0) && (
        <FiltersSkeleton search={search} selects={selects} />
      )}
      {alert && <Skeleton className="h-10 w-full rounded-lg" />}
      <TableSkeleton columns={columns} />
    </SkeletonRoot>
  );
}

/** Breadcrumb header bar, stacked section cards and an actions footer. */
export function DetailsPageSkeleton({
  sections = 3,
  actions = true,
}: {
  sections?: number;
  actions?: boolean;
}) {
  return (
    <SkeletonRoot>
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3.5 w-28" />
          <span className="text-lg text-gray-200">/</span>
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
        <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {Array.from({ length: sections }).map((_, i) => (
          <SectionCardSkeleton key={i} />
        ))}
      </div>

      {actions && (
        <div className="flex justify-end gap-4 border-t border-gray-200 bg-white p-4 sm:p-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      )}
    </SkeletonRoot>
  );
}

/** Tabs followed by settings-style form cards. */
export function FormPageSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <SkeletonRoot className="p-4 sm:p-6">
      <div className="container max-w-5xl space-y-3">
        <Skeleton className="h-11 w-48 rounded-lg" />

        <div className="space-y-4">
          {Array.from({ length: cards }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-3.5">
                <Skeleton className="h-3.5 w-44" />
              </div>
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="size-8" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="size-8" />
                  <Skeleton className="ms-auto h-10 w-20" />
                </div>
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonRoot>
  );
}

/** Grid of dashboard cards (overview pages). */
export function CardsPageSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <SkeletonRoot className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-gray-200 bg-white p-5"
        >
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </SkeletonRoot>
  );
}

/** Centered credentials card (auth pages). */
export function AuthFormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <SkeletonRoot className="w-75 space-y-6 rounded-xl bg-white px-6 py-8 shadow-sm sm:w-120">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3.5 w-56 max-w-full" />
      </div>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-11 w-full" />
    </SkeletonRoot>
  );
}

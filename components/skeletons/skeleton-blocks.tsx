import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonRoot({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("Common");

  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{t("Loading")}</span>
      {children}
    </div>
  );
}

export function PageTitleSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-3.5 w-72 max-w-full" />
    </div>
  );
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TabsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="inline-flex max-w-full gap-1 overflow-hidden rounded-xl border border-gray-200 bg-white p-1">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-28 shrink-0 rounded-lg" />
      ))}
    </div>
  );
}

export function FiltersSkeleton({
  search = true,
  selects = 0,
}: {
  search?: boolean;
  selects?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {search && <Skeleton className="h-8.5 w-full max-w-80" />}
      {Array.from({ length: selects }).map((_, i) => (
        <Skeleton key={i} className="h-8.5 w-full max-w-48" />
      ))}
    </div>
  );
}

export function TableSkeleton({
  columns = 5,
  rows = 8,
}: {
  columns?: number;
  rows?: number;
}) {
  // Same grid for header and rows so columns line up and fill the width.
  const gridClassName =
    "grid grid-cols-1 items-center gap-6 px-5 sm:grid-cols-[minmax(0,2fr)_repeat(var(--cols),minmax(0,1fr))]";
  const gridStyle = { "--cols": columns - 1 } as React.CSSProperties;

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div
        className={cn(gridClassName, "border-b border-gray-100 bg-gray-50/60 py-4")}
        style={gridStyle}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-3", i === 0 ? "w-32" : "hidden w-16 sm:block")}
          />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className={cn(
            gridClassName,
            "border-b border-gray-100 py-3.5 last:border-b-0",
          )}
          style={gridStyle}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="w-full max-w-40 space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
          </div>
          {Array.from({ length: columns - 1 }).map((_, i) => (
            <Skeleton key={i} className="hidden h-3 w-3/5 sm:block" />
          ))}
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-7 w-40" />
      </div>
    </div>
  );
}

export function SectionCardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-5 py-3.5">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {Array.from({ length: lines * 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

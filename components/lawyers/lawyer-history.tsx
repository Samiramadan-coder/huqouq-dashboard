"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LawyerHistory({ className }: { className?: string }) {
  const t = useTranslations("Lawyers.History");

  return (
    <section className={cn("w-full space-y-3 text-start", className)}>
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {t("Title")}
      </h2>

      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="gap-0 rounded-2xl ring-0! border border-gray-200 bg-gray-50/80 py-0 shadow-none"
          >
            <CardContent className="flex flex-wrap items-start gap-2 px-4 py-3 sm:flex-nowrap">
              <Badge
                variant="outline"
                className={cn(
                  "mt-0.5 shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold uppercase",
                  true
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-secondary/15 bg-secondary/8 text-secondary",
                )}
              >
                test
              </Badge>

              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] font-semibold leading-5 text-gray-800">
                  test
                </h3>

                <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
                  test
                </p>
              </div>

              <div className="ms-auto shrink-0 text-end">
                <p
                  className={cn(
                    "text-[11px] font-semibold leading-5",
                    true ? "text-gray-400" : "text-green-600",
                  )}
                >
                  test
                </p>

                <time
                  dateTime="2026-06-20"
                  className="block text-[10px] leading-4 text-gray-400"
                >
                  test
                </time>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

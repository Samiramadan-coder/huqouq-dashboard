"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCcw, TriangleAlert } from "lucide-react";

type ErrorStateProps = {
  error: Error & { digest?: string };
  onRetry: () => void;
  className?: string;
};

export default function ErrorState({
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const t = useTranslations("Errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-4 sm:p-6",
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
          <TriangleAlert className="size-5 text-red-500" strokeWidth={1.8} />
        </div>

        <h2 className="mt-4 text-base font-semibold text-gray-800">
          {t("title")}
        </h2>
        <p className="mt-1.5 text-[13px] text-gray-500">{t("description")}</p>

        {error.digest && (
          <p className="mt-3 text-[11px] text-gray-400">
            {t("reference", { digest: error.digest })}
          </p>
        )}

        <Button onClick={onRetry} className="mt-6 h-10 px-5 text-[13px]">
          <RotateCcw className="size-3.5" />
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}

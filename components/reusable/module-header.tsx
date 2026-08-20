"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export default function ModuleHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  const locale = useLocale();
  return (
    <header className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1
          className={cn("text-2xl font-semibold text-foreground", {
            "font-lora": locale === "en",
          })}
        >
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>

      {children}
    </header>
  );
}

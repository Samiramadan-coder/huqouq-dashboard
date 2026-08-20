"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale = locale === "ar" ? "en" : "ar";

  return (
    <Button
      variant="ghost"
      className="text-muted-foreground bg-muted hover:bg-muted hover:text-muted-foreground rounded-md"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label="switcher"
    >
      <Globe />
      <span className="text-sm">{locale === "ar" ? "En" : "AR"}</span>
    </Button>
  );
}

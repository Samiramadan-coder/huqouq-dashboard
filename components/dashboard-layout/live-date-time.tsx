"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";

export default function LiveDateTime() {
  const locale = useLocale();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // "Tue 27 Oct" / "الثلاثاء 27 أكتوبر": the parts joined by spaces, without
  // the locale's punctuation.
  const date = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    numberingSystem: "latn",
  })
    .formatToParts(now)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join(" ");

  const time = formatDate(now, locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <time
      dateTime={now.toISOString()}
      suppressHydrationWarning
      className="text-sm font-medium text-muted-foreground hidden sm:inline-flex"
    >
      {date} · {time}
    </time>
  );
}

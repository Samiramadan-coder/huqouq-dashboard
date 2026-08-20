"use client";

import { useEffect, useState } from "react";

export default function LiveDateTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(now);

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

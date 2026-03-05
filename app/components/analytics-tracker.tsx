"use client";

import { useEffect } from "react";

type AnalyticsTrackerProps = {
  eventType?: "page_view" | "hatch_completed";
  path: string;
};

export function AnalyticsTracker({ eventType = "page_view", path }: AnalyticsTrackerProps) {
  useEffect(() => {
    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: eventType, path }),
      keepalive: true,
    });
  }, [eventType, path]);

  return null;
}

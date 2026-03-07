import { NextResponse } from "next/server";
import { getCompletionFunnel, getPageViewCounts } from "@/lib/analytics-pg";

export async function GET() {
  const [pageViews, funnel] = await Promise.all([
    getPageViewCounts(),
    getCompletionFunnel()
  ]);

  return NextResponse.json({
    ok: true,
    pageViews,
    funnel,
  });
}

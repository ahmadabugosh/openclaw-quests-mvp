import { NextResponse } from "next/server";
import { getCompletionFunnel, getPageViewCounts } from "@/lib/analytics";
import { serverDb } from "@/lib/server-db";

export async function GET() {
  return NextResponse.json({
    ok: true,
    pageViews: getPageViewCounts(serverDb),
    funnel: getCompletionFunnel(serverDb),
  });
}

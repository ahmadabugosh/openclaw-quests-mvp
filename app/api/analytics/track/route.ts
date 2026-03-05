import { NextResponse } from "next/server";
import { recordAnalyticsEvent, type AnalyticsEventType } from "@/lib/analytics";
import { serverDb } from "@/lib/server-db";

const ALLOWED_TYPES: AnalyticsEventType[] = [
  "page_view",
  "signup_started",
  "signup_completed",
  "proof_submitted",
  "quest_completed",
  "hatch_completed",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: AnalyticsEventType;
      path?: string;
      questId?: number;
      userId?: number;
    };

    if (!body.type || !ALLOWED_TYPES.includes(body.type)) {
      return NextResponse.json({ error: "Invalid analytics event type" }, { status: 400 });
    }

    recordAnalyticsEvent(serverDb, body.type, {
      path: body.path,
      questId: body.questId,
      userId: body.userId,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid analytics payload" }, { status: 400 });
  }
}

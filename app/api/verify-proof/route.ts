import { NextResponse } from "next/server";
import { decodeProofCode, verifyProofSignature } from "@/lib/proof";
import { evaluateQuestCompletion } from "@/lib/verification";

// MVP placeholder: replace with DB-backed instance secret lookup.
const INSTANCE_SECRETS: Record<string, string> = {
  demo_instance: "demo-secret",
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { proofCode?: string };
    const proofCode = body.proofCode;

    if (!proofCode) {
      return NextResponse.json({ error: "proofCode is required" }, { status: 400 });
    }

    const payload = decodeProofCode(proofCode);
    const secret = INSTANCE_SECRETS[payload.instance_id];

    if (!secret) {
      return NextResponse.json({ error: "Unknown instance_id" }, { status: 404 });
    }

    if (!verifyProofSignature(payload, secret)) {
      return NextResponse.json({ error: "Invalid proof signature" }, { status: 401 });
    }

    const progress = evaluateQuestCompletion(payload.checks);

    return NextResponse.json({
      ok: true,
      instanceId: payload.instance_id,
      progress,
      version: payload.version,
      timestamp: payload.timestamp,
    });
  } catch {
    return NextResponse.json({ error: "Invalid proof payload" }, { status: 400 });
  }
}

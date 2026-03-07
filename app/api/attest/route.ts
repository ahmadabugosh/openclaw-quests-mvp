import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAttestation, getAttestationUrl } from "@/lib/eas";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, name, questsCompleted, walletAddress } = await req.json();

    // Verify Stripe payment
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Check if already attested for this session
    if (session.metadata?.attestation_uid) {
      return NextResponse.json({
        uid: session.metadata.attestation_uid,
        url: getAttestationUrl(session.metadata.attestation_uid),
        alreadyAttested: true,
      });
    }

    // Create on-chain attestation
    const credentialId = `Hatched OpenClaw Operator | OC-${Date.now().toString(36).toUpperCase()}`;
    const result = await createAttestation({
      name: name || session.metadata?.userName || "Anonymous",
      email: walletAddress || "", // Store wallet address in email field if provided
      completionDate: Math.floor(Date.now() / 1000),
      credentialId,
      questsCompleted: questsCompleted || 12,
    });

    if (!result) {
      return NextResponse.json({ error: "Failed to create on-chain attestation. Please contact support." }, { status: 500 });
    }

    // Store attestation UID in Stripe session metadata for deduplication
    try {
      await stripe.checkout.sessions.update(sessionId, {
        metadata: { ...session.metadata, attestation_uid: result.uid },
      });
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      uid: result.uid,
      txHash: result.txHash,
      url: getAttestationUrl(result.uid),
      credentialId,
    });
  } catch (err) {
    console.error("Attestation error:", err);
    return NextResponse.json({ error: "Failed to process attestation" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAttestation, getAttestationUrl } from "@/lib/eas";
import { getUserFromSession } from "@/lib/auth-pg";
import { pool } from "@/lib/postgres-db";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, name, questsCompleted, walletAddress } = await req.json();

    // Try to get authenticated user (optional - will save to DB if authenticated)
    const cookie = req.cookies.get("ocq_session")?.value;
    const user = cookie ? await getUserFromSession(cookie) : null;

    // Check if this is a crypto payment (no Stripe session)
    const isCryptoPayment = sessionId === "crypto-payment" || walletAddress;

    if (!isCryptoPayment) {
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

      // Create attestation for Stripe payment
      const credentialId = `Hatched OpenClaw Operator | OC-${Date.now().toString(36).toUpperCase()}`;
      const result = await createAttestation({
        name: name || session.metadata?.userName || "Anonymous",
        email: "", // No email for privacy
        completionDate: Math.floor(Date.now() / 1000),
        credentialId,
        questsCompleted: questsCompleted || 12,
      });

      if (!result) {
        return NextResponse.json({ error: "Failed to create on-chain attestation. Please contact support." }, { status: 500 });
      }

      // Save to database if user is authenticated
      if (user) {
        // Save payment to database (check if exists first)
        const existingPayment = await pool.query(
          "SELECT 1 FROM payments WHERE user_id = $1 LIMIT 1",
          [user.id]
        );
        if (existingPayment.rows.length === 0) {
          await pool.query(
            `INSERT INTO payments (user_id, method, status, stripe_session_id, amount_cents, created_at)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [user.id, "stripe", "paid", sessionId, 2000, new Date().toISOString()]
          );
        }

        // Save attestation to database (check if exists first)
        const existingAttestation = await pool.query(
          "SELECT 1 FROM attestations WHERE user_id = $1 LIMIT 1",
          [user.id]
        );
        if (existingAttestation.rows.length === 0) {
          await pool.query(
            `INSERT INTO attestations (user_id, uid, url, created_at)
             VALUES ($1, $2, $3, $4)`,
            [user.id, result.uid, getAttestationUrl(result.uid), new Date().toISOString()]
          );
        }
      }

      // Store attestation UID in Stripe session metadata
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
    } else {
      // Crypto payment - create attestation directly
      const credentialId = `Hatched OpenClaw Operator | OC-${Date.now().toString(36).toUpperCase()}`;
      const result = await createAttestation({
        name: name || "Anonymous",
        email: walletAddress || "", // Store wallet address in email field
        completionDate: Math.floor(Date.now() / 1000),
        credentialId,
        questsCompleted: questsCompleted || 12,
      });

      if (!result) {
        return NextResponse.json({ error: "Failed to create on-chain attestation. Please contact support." }, { status: 500 });
      }

      // Save to database if user is authenticated
      if (user) {
        // Save crypto payment to database (check if exists first)
        const existingPayment = await pool.query(
          "SELECT 1 FROM payments WHERE user_id = $1 LIMIT 1",
          [user.id]
        );
        if (existingPayment.rows.length === 0) {
          await pool.query(
            `INSERT INTO payments (user_id, method, status, amount_cents, created_at)
             VALUES ($1, $2, $3, $4, $5)`,
            [user.id, "crypto", "paid", 2000, new Date().toISOString()]
          );
        }

        // Save attestation to database (check if exists first)
        const existingAttestation = await pool.query(
          "SELECT 1 FROM attestations WHERE user_id = $1 LIMIT 1",
          [user.id]
        );
        if (existingAttestation.rows.length === 0) {
          await pool.query(
            `INSERT INTO attestations (user_id, uid, url, created_at)
             VALUES ($1, $2, $3, $4)`,
            [user.id, result.uid, getAttestationUrl(result.uid), new Date().toISOString()]
          );
        }
      }

      return NextResponse.json({
        uid: result.uid,
        txHash: result.txHash,
        url: getAttestationUrl(result.uid),
        credentialId,
      });
    }
  } catch (err) {
    console.error("Attestation error:", err);
    return NextResponse.json({ error: "Failed to process attestation" }, { status: 500 });
  }
}

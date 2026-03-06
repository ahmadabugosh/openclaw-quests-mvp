import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }

  try {
    const { email, name } = await req.json();
    const stripe = new Stripe(stripeKey);

    const origin = req.headers.get("origin") || "https://carefree-cooperation-production-787e.up.railway.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "OpenClaw Operator Certificate",
              description: "On-chain verified credential (EAS on Base) proving you completed all 12 OpenClaw quests.",
            },
            unit_amount: 2000, // $20.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/certificate?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/certificate?payment=cancelled`,
      metadata: {
        userName: name || "",
        userEmail: email || "",
        type: "openclaw_operator_certificate",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

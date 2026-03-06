import { NextRequest, NextResponse } from "next/server";
import { verifyUSDCPayment } from "@/lib/usdc";

export async function POST(req: NextRequest) {
  try {
    const { txHash } = await req.json();

    if (!txHash || typeof txHash !== "string") {
      return NextResponse.json({ error: "Transaction hash required" }, { status: 400 });
    }

    const result = await verifyUSDCPayment(txHash);

    if (!result.valid) {
      return NextResponse.json({ error: "Could not verify payment. Make sure you sent 20 USDC to the correct address on Base." }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      from: result.from, 
      amount: result.amount,
      method: "crypto",
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

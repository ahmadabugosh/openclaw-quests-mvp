import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/postgres-db";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.hatch_date,
        u.created_at as user_created,
        p.id as payment_id,
        p.method as payment_method,
        p.stripe_session_id,
        p.created_at as payment_date,
        a.uid as attestation_uid,
        a.url as attestation_url,
        a.created_at as attestation_date,
        (SELECT COUNT(*) FROM quest_progress WHERE user_id = u.id AND status = 'completed') as completed_quests
      FROM users u
      LEFT JOIN payments p ON p.user_id = u.id
      LEFT JOIN attestations a ON a.user_id = u.id
      WHERE u.email = $1
    `, [email.toLowerCase()]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      user: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message,
    }, { status: 500 });
  }
}

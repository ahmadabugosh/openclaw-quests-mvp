import { NextResponse } from "next/server";
import { pool } from "@/lib/postgres-db";

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Get table list
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      const tables = tablesResult.rows.map((r: any) => r.table_name);
      
      // Get row counts
      const counts: Record<string, number> = {};
      for (const table of tables) {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
        counts[table] = parseInt(countResult.rows[0].count);
      }
      
      // Get sample users
      const usersResult = await client.query(
        "SELECT id, email, username, hatch_date, created_at FROM users ORDER BY created_at DESC LIMIT 5"
      );
      
      return NextResponse.json({
        ok: true,
        tables,
        counts,
        sampleUsers: usersResult.rows,
        timestamp: new Date().toISOString(),
      });
      
    } finally {
      client.release();
    }
    
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err.message,
    }, { status: 500 });
  }
}

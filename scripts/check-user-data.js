const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUserData() {
  try {
    // Get all users with payment and attestation info
    const result = await pool.query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.hatch_date,
        u.created_at,
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
      ORDER BY u.created_at DESC
    `);

    console.log("\n📊 User Data:\n");
    result.rows.forEach(user => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`👤 User #${user.id}: ${user.email}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Hatched: ${user.hatch_date || 'No'}`);
      console.log(`   Completed quests: ${user.completed_quests}/12`);
      console.log(`   💳 Payment: ${user.payment_id ? `Yes (${user.payment_method}) - ${user.payment_date}` : 'NO PAYMENT RECORD'}`);
      if (user.stripe_session_id) {
        console.log(`   Stripe Session: ${user.stripe_session_id}`);
      }
      console.log(`   🎖️  Attestation: ${user.attestation_uid ? `Yes - ${user.attestation_uid.substring(0, 20)}...` : 'NO ATTESTATION'}`);
      if (user.attestation_url) {
        console.log(`   URL: ${user.attestation_url}`);
      }
      console.log();
    });

    await pool.end();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkUserData();

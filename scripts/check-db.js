const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    // List all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log("📊 Tables in database:");
    console.log(tablesResult.rows.map(r => `  - ${r.table_name}`).join("\n"));
    console.log("");

    // Check each table for row counts
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      const countResult = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`${tableName}: ${countResult.rows[0].count} rows`);
    }

    // Show sample users if any
    const usersResult = await pool.query("SELECT id, email, username, created_at FROM users LIMIT 5");
    if (usersResult.rows.length > 0) {
      console.log("\n👥 Sample users:");
      usersResult.rows.forEach(u => {
        console.log(`  - ${u.username} (${u.email}) - created ${u.created_at}`);
      });
    }

    await pool.end();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkDatabase();

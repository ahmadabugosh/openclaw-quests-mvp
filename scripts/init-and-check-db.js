const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

console.log("🔌 Connecting to database...");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 5,
  connectionTimeoutMillis: 10000,
});

async function initAndCheck() {
  const client = await pool.connect();
  
  try {
    console.log("✅ Connected!");
    
    // First, initialize the schema
    console.log("\n📦 Creating schema...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        github_id TEXT,
        password_hash TEXT,
        instance_id TEXT NOT NULL UNIQUE,
        instance_secret_hash TEXT NOT NULL,
        agent_name TEXT,
        hatch_date TEXT,
        creature_data TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS quest_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quest_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('locked', 'available', 'completed')),
        completed_at TIMESTAMP,
        verification_data TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, quest_id)
      );

      CREATE INDEX IF NOT EXISTS idx_quest_progress_user_id ON quest_progress(user_id);

      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token_hash TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type TEXT NOT NULL,
        page_path TEXT,
        quest_id INTEGER,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        method TEXT NOT NULL CHECK (method IN ('stripe', 'crypto')),
        status TEXT NOT NULL DEFAULT 'paid',
        stripe_session_id TEXT,
        tx_hash TEXT,
        amount_cents INTEGER NOT NULL DEFAULT 2000,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

      CREATE TABLE IF NOT EXISTS attestations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        uid TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_attestations_user_id ON attestations(user_id);
    `);
    
    console.log("✅ Schema created!");
    
    // Now check what's in the database
    console.log("\n📊 Checking database contents...\n");
    
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log("Tables:");
    for (const row of tablesResult.rows) {
      console.log(`  - ${row.table_name}`);
    }
    
    console.log("\n📈 Row counts:");
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const count = parseInt(countResult.rows[0].count);
      console.log(`  ${tableName}: ${count} row${count === 1 ? '' : 's'}`);
    }
    
    // Show sample users if any
    const usersResult = await client.query("SELECT id, email, username, hatch_date, created_at FROM users ORDER BY created_at DESC LIMIT 5");
    if (usersResult.rows.length > 0) {
      console.log("\n👥 Recent users:");
      usersResult.rows.forEach(u => {
        const hatched = u.hatch_date ? '🥚✅' : '🥚❌';
        console.log(`  ${hatched} ${u.username} (${u.email}) - ${u.created_at}`);
      });
    } else {
      console.log("\n👥 No users yet");
    }
    
  } finally {
    client.release();
    await pool.end();
  }
}

initAndCheck().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

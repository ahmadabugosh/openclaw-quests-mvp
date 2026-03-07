const Database = require('better-sqlite3');

const dbPath = process.env.QUESTS_DB_PATH || '/data/quests.db';
const db = new Database(dbPath, { readonly: true });

console.log('\n=== DATABASE SNAPSHOT ===\n');

// User count
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log(`📊 Total Users: ${userCount.count}`);

// Users with quest progress
const users = db.prepare(`
  SELECT 
    u.id,
    u.email,
    u.username,
    u.hatch_date,
    COUNT(CASE WHEN qp.status = 'completed' THEN 1 END) as completed_quests,
    (SELECT COUNT(*) FROM payments p WHERE p.user_id = u.id AND p.status = 'paid') as has_paid,
    (SELECT COUNT(*) FROM attestations a WHERE a.user_id = u.id) as has_attestation
  FROM users u
  LEFT JOIN quest_progress qp ON u.id = qp.user_id
  GROUP BY u.id
  ORDER BY u.id DESC
  LIMIT 10
`).all();

console.log('\n📝 Recent Users:');
users.forEach(u => {
  console.log(`  • ${u.username} (${u.email})`);
  console.log(`    Quests: ${u.completed_quests}/12 | Paid: ${u.has_paid ? '✅' : '❌'} | Attestation: ${u.has_attestation ? '✅' : '❌'} | Hatched: ${u.hatch_date || 'Not yet'}`);
});

// Payment stats
const payments = db.prepare(`
  SELECT method, COUNT(*) as count 
  FROM payments 
  WHERE status = 'paid' 
  GROUP BY method
`).all();

console.log('\n💰 Payments:');
payments.forEach(p => {
  console.log(`  • ${p.method}: ${p.count}`);
});

// Attestation count
const attestations = db.prepare('SELECT COUNT(*) as count FROM attestations').get();
console.log(`\n🔗 On-Chain Attestations: ${attestations.count}`);

db.close();
console.log('\n========================\n');

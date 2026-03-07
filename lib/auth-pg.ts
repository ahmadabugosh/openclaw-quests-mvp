import { createHash, randomBytes } from "node:crypto";
import { hashPassword, hashSessionToken, newSessionToken, verifyPassword } from "@/lib/auth";
import { pool } from "@/lib/postgres-db";

type DbUser = {
  id: number;
  email: string;
  username: string;
  github_id: string | null;
  password_hash: string | null;
};

export async function createEmailUser(email: string, username: string, password: string): Promise<number> {
  const passwordHash = hashPassword(password);
  const instanceId = randomBytes(12).toString("hex");
  const instanceSecretHash = createHash("sha256").update(randomBytes(24)).digest("hex");

  const result = await pool.query(
    `INSERT INTO users (email, username, password_hash, instance_id, instance_secret_hash)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [email.toLowerCase(), username, passwordHash, instanceId, instanceSecretHash]
  );

  return result.rows[0].id;
}

export async function authenticateEmailUser(email: string, password: string): Promise<DbUser | null> {
  const result = await pool.query(
    "SELECT id, email, username, github_id, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  const user = result.rows[0];
  if (!user || !user.password_hash) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return user;
}

export async function findOrCreateGithubUser(
  githubId: string,
  email: string,
  username: string
): Promise<DbUser> {
  const existing = await pool.query(
    "SELECT id, email, username, github_id, password_hash FROM users WHERE github_id = $1",
    [githubId]
  );

  if (existing.rows[0]) return existing.rows[0];

  const instanceId = randomBytes(12).toString("hex");
  const instanceSecretHash = createHash("sha256").update(randomBytes(24)).digest("hex");

  const result = await pool.query(
    `INSERT INTO users (email, username, github_id, instance_id, instance_secret_hash)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, github_id, password_hash`,
    [email.toLowerCase(), username, githubId, instanceId, instanceSecretHash]
  );

  return result.rows[0];
}

export async function createSession(userId: number): Promise<{ token: string; expiresAt: Date }> {
  const token = newSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  await pool.query(
    "INSERT INTO sessions (user_id, session_token_hash, expires_at) VALUES ($1, $2, $3)",
    [userId, tokenHash, expiresAt.toISOString()]
  );

  return { token, expiresAt };
}

export async function getUserFromSession(token: string): Promise<DbUser | null> {
  const tokenHash = hashSessionToken(token);
  const result = await pool.query(
    `SELECT u.id, u.email, u.username, u.github_id, u.password_hash
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.session_token_hash = $1 AND s.expires_at > CURRENT_TIMESTAMP`,
    [tokenHash]
  );

  return result.rows[0] || null;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const result = await pool.query(
    "SELECT id, email, username, github_id, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );
  return result.rows[0] || null;
}

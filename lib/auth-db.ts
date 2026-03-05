import { createHash, randomBytes } from "node:crypto";
import type { QuestsDatabase } from "@/lib/db";
import { hashPassword, hashSessionToken, newSessionToken, verifyPassword } from "@/lib/auth";

type DbUser = {
  id: number;
  email: string;
  username: string;
  github_id: string | null;
  password_hash: string | null;
};

export function createEmailUser(db: QuestsDatabase, email: string, username: string, password: string): number {
  const passwordHash = hashPassword(password);
  const instanceId = randomBytes(12).toString("hex");
  const instanceSecretHash = createHash("sha256").update(randomBytes(24)).digest("hex");

  db.prepare(
    `INSERT INTO users (email, username, password_hash, instance_id, instance_secret_hash)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(email.toLowerCase(), username, passwordHash, instanceId, instanceSecretHash);

  const row = db.prepare("SELECT last_insert_rowid() as id").get() as { id: number };
  return row.id;
}

export function authenticateEmailUser(db: QuestsDatabase, email: string, password: string): DbUser | null {
  const user = db
    .prepare("SELECT id, email, username, github_id, password_hash FROM users WHERE email = ?")
    .get(email.toLowerCase()) as DbUser | undefined;

  if (!user || !user.password_hash) return null;
  if (!verifyPassword(password, user.password_hash)) return null;
  return user;
}

export function findOrCreateGithubUser(
  db: QuestsDatabase,
  githubId: string,
  email: string,
  username: string,
): DbUser {
  const existing = db
    .prepare("SELECT id, email, username, github_id, password_hash FROM users WHERE github_id = ?")
    .get(githubId) as DbUser | undefined;

  if (existing) return existing;

  const instanceId = randomBytes(12).toString("hex");
  const instanceSecretHash = createHash("sha256").update(randomBytes(24)).digest("hex");

  db.prepare(
    `INSERT INTO users (email, username, github_id, instance_id, instance_secret_hash)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(email.toLowerCase(), username, githubId, instanceId, instanceSecretHash);

  return db
    .prepare("SELECT id, email, username, github_id, password_hash FROM users WHERE github_id = ?")
    .get(githubId) as DbUser;
}

export function createSession(db: QuestsDatabase, userId: number): { token: string; expiresAt: Date } {
  const token = newSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);

  db.prepare("INSERT INTO sessions (user_id, session_token_hash, expires_at) VALUES (?, ?, ?)").run(
    userId,
    tokenHash,
    expiresAt.toISOString(),
  );

  return { token, expiresAt };
}

export function getUserFromSession(db: QuestsDatabase, token: string): DbUser | null {
  const tokenHash = hashSessionToken(token);
  return (
    (db
      .prepare(
        `SELECT u.id, u.email, u.username, u.github_id, u.password_hash
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.session_token_hash = ? AND s.expires_at > CURRENT_TIMESTAMP`,
      )
      .get(tokenHash) as DbUser | undefined) ?? null
  );
}

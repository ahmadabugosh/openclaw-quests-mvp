import { openDatabase } from "./db";

const dbPath = process.env.QUESTS_DB_PATH ?? ".data/quests.db";

export const serverDb = openDatabase(dbPath);

// src/lib/db/storage.ts
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("period_tracker.db");

export async function initDatabase() {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS local_storage (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);
    console.log("=== SQLite DB Initialized Safely ===");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

export const STORAGE_KEYS = {
  SELECTED_DATES: "period_selected_dates",
  CYCLE_LENGTH: "period_cycle_length",
  PERIOD_LENGTH: "period_period_length",
  IS_NEW_USER: "period_is_new_user",
};

export const storage = {
  getString: async (key: string): Promise<string | null> => {
    try {
      const result = await db.getFirstAsync<{ value: string }>(
        "SELECT value FROM local_storage WHERE key = ?",
        [key],
      );
      return result?.value ?? null;
    } catch {
      return null;
    }
  },
  setString: async (key: string, value: string): Promise<void> => {
    await db.runAsync(
      "INSERT OR REPLACE INTO local_storage (key, value) VALUES (?, ?)",
      [key, value],
    );
  },
  getNumber: async (key: string): Promise<number | null> => {
    const val = await storage.getString(key);
    return val ? parseFloat(val) : null;
  },
  setNumber: async (key: string, value: number): Promise<void> => {
    await storage.setString(key, String(value));
  },
};

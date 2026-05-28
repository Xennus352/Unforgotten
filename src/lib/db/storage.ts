/**
 * SQLite storage with schema validation and error recovery
 * Provides robust data persistence with graceful fallbacks
 */

import * as SQLite from "expo-sqlite";
import { DateKey } from "@/types/period";

const db = SQLite.openDatabaseSync("period_tracker.db");
const STORAGE_VERSION = 1;

/**
 * Storage schema for versioning support
 */
interface StorageRecord {
  key: string;
  value: string;
  version?: number;
}

// Initialize database on module load
(async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS local_storage (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );
    `);
    console.log("Database initialized");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
})();

export const STORAGE_KEYS = {
  SELECTED_DATES: "period_selected_dates",
  CYCLE_LENGTH: "period_cycle_length",
  PERIOD_LENGTH: "period_period_length",
  IS_NEW_USER: "period_is_new_user",
  STORAGE_VERSION: "period_storage_version",
} as const;

/**
 * Safe JSON parser with fallback value
 */

function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export async function initDatabase(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS local_storage (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      version INTEGER DEFAULT 1
    );
  `);
}

export const storage = {
  getString: async (key: string): Promise<string | null> => {
    try {
      const result = await db.getFirstAsync<StorageRecord>(
        "SELECT value FROM local_storage WHERE key = ?",
        [key]
      );
      return result?.value ?? null;
    } catch (error) {
      console.warn(`Storage read error for key ${key}:`, error);
      return null;
    }
  },

  setString: async (key: string, value: string): Promise<void> => {
    try {
      await db.runAsync(
        "INSERT OR REPLACE INTO local_storage (key, value, version) VALUES (?, ?, ?)",
        [key, value, STORAGE_VERSION]
      );
    } catch (error) {
      console.error(`Storage write error for key ${key}:`, error);
    }
  },

  getNumber: async (key: string): Promise<number | null> => {
    const val = await storage.getString(key);
    if (!val) return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
  },

  setNumber: async (key: string, value: number): Promise<void> => {
    if (isNaN(value)) {
      console.warn(`Invalid number value for storage key ${key}:`, value);
      return;
    }
    await storage.setString(key, String(value));
  },

  // Safe defaults for period data
  getPeriodData: async (): Promise<{
    selectedDates: DateKey[];
    cycleLength: number;
    periodLength: number;
    isNewUser: boolean;
  }> => {
    const [storedDates, storedCycle, storedPeriod, storedNewUser] = await Promise.all([
      storage.getString(STORAGE_KEYS.SELECTED_DATES),
      storage.getNumber(STORAGE_KEYS.CYCLE_LENGTH),
      storage.getNumber(STORAGE_KEYS.PERIOD_LENGTH),
      storage.getString(STORAGE_KEYS.IS_NEW_USER),
    ]);

    return {
      selectedDates: safeJsonParse<DateKey[]>(storedDates, []),
      cycleLength: storedCycle ?? 28,
      periodLength: storedPeriod ?? 5,
      isNewUser: storedNewUser === null ? true : safeJsonParse(storedNewUser, true),
    };
  },
} as const;
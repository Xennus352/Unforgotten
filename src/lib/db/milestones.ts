import type { Milestone } from "@/types/milestone";
import * as SQLite from "expo-sqlite";

const DB_NAME = "milestones.db";
const RELATIONSHIP_START_KEY = "relationship_start";

type MilestoneRow = {
  id: string;
  title: string;
  date: string;
  emoji: string;
  note: string | null;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS milestones (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          emoji TEXT NOT NULL,
          note TEXT
        );
        CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);
      return db;
    })();
  }
  return databasePromise;
}

function rowToMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    emoji: row.emoji,
    note: row.note ?? undefined,
  };
}

export async function fetchMilestones(): Promise<Milestone[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<MilestoneRow>(
    "SELECT id, title, date, emoji, note FROM milestones ORDER BY date ASC",
  );
  return rows.map(rowToMilestone);
}

export async function fetchRelationshipStart(): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_settings WHERE key = ?",
    RELATIONSHIP_START_KEY,
  );
  return row?.value ?? null;
}

export async function saveRelationshipStart(isoDate: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)",
    RELATIONSHIP_START_KEY,
    isoDate,
  );
}

export type NewMilestone = {
  title: string;
  date: string;
  emoji: string;
  note?: string;
};

export async function insertMilestone(input: NewMilestone): Promise<Milestone> {
  const db = await getDatabase();
  const milestone: Milestone = {
    id: createId(),
    title: input.title.trim(),
    date: input.date,
    emoji: input.emoji,
    note: input.note?.trim() || undefined,
  };

  await db.runAsync(
    "INSERT INTO milestones (id, title, date, emoji, note) VALUES (?, ?, ?, ?, ?)",
    milestone.id,
    milestone.title,
    milestone.date,
    milestone.emoji,
    milestone.note ?? null,
  );

  return milestone;
}

export async function deleteMilestone(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM milestones WHERE id = ?", id);
}


export async function updateMilestone(
  id: string,
  updates: Partial<NewMilestone>
): Promise<void> {
  const db = await getDatabase();
  const sets: string[] = [];
  const args: any[] = [];

  if (updates.title !== undefined) {
    sets.push("title = ?");
    args.push(updates.title.trim());
  }
  if (updates.date !== undefined) {
    sets.push("date = ?");
    args.push(updates.date);
  }
  if (updates.emoji !== undefined) {
    sets.push("emoji = ?");
    args.push(updates.emoji);
  }
  if (updates.note !== undefined) {
    sets.push("note = ?");
    args.push(updates.note.trim() || null);
  }

  if (sets.length === 0) return;

  args.push(id);
  const query = `UPDATE milestones SET ${sets.join(", ")} WHERE id = ?`;
  await db.runAsync(query, ...args);
}

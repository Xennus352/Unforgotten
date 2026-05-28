/**
 * Date formatting utilities
 * Compatible with predictions.ts timezone-safe patterns
 */

import { formatDateKey as formatKey, parseDateKey as parseKey } from "@/utils/predictions";

export function toIsoDate(date: Date): string {
  return formatKey(date);
}

export function parseIsoDate(iso: string): Date {
  return parseKey(iso as any);
}

export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function daysTogetherSince(startIso: string): number {
  const [y, m, d] = startIso.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}
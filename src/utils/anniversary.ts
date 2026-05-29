/**
 * Anniversary utility functions
 */

import { DateKey } from "@/types/period";

/**
 * Resolve the first available anniversary date from the provided data.
 * Checks in order: anniversaryDate, relationshipStart, fetchRelationshipStart.
 * Returns undefined if none are present.
 */
export function resolveAnniversaryDate(data: {
  anniversaryDate?: string;
  relationshipStart?: string;
  fetchRelationshipStart?: string;
}): string | undefined {
  return (
    data.anniversaryDate ||
    data.relationshipStart ||
    data.fetchRelationshipStart
  );
}

/**
 * Create a default anniversary date based on today's date.
 * Format: YYYY-MM-DD (DateKey)
 */
export function createDefaultAnniversaryDate(): DateKey {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as DateKey;
}
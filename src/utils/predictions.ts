/**
 * Date utility functions for timezone-safe date operations
 * Uses local date components to avoid timezone parsing pitfalls
 */

import { DateKey, CycleGroup } from "@/types/period";

/**
 * Format a Date to ISO date key (YYYY-MM-DD)
 * Uses local date components to ensure consistent formatting across timezones
 */
export function formatDateKey(date: Date): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}` as DateKey;
}

/**
 * Parse an ISO date key to Date object
 * Uses array destructuring to safely extract components
 */
export function parseDateKey(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get today's date key in a timezone-safe manner
 */
export function getTodayKey(): DateKey {
  const today = new Date();
  return formatDateKey(today);
}

/**
 * Check if two date keys are consecutive days
 * Used for cycle detection and grouping
 */
export function areDatesConsecutive(a: DateKey, b: DateKey): boolean {
  const dateA = parseDateKey(a);
  const dateB = parseDateKey(b);
  const diff = Math.abs(dateB.getTime() - dateA.getTime());
  return diff === 24 * 60 * 60 * 1000;
}

/**
 * Add days to a date key and return the resulting key
 */
export function addDaysToDateKey(key: DateKey, days: number): DateKey {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return formatDateKey(date);
}

/**
 * Get the number of days between two date keys
 */
export function daysBetween(keyA: DateKey, keyB: DateKey): number {
  const dateA = parseDateKey(keyA);
  const dateB = parseDateKey(keyB);
  return Math.floor((dateB.getTime() - dateA.getTime()) / (24 * 60 * 60 * 1000));
}

/**
 * Group consecutive selected dates into cycle groups
 * Each group represents a single menstrual cycle period
 */
export function groupConsecutiveDates(dates: DateKey[]): CycleGroup[] {
  if (dates.length === 0) return [];

  // Sort dates chronologically
  const sorted = [...dates].sort((a, b) => {
    const dateA = parseDateKey(a);
    const dateB = parseDateKey(b);
    return dateA.getTime() - dateB.getTime();
  });

  const groups: CycleGroup[] = [];
  let currentGroup: DateKey[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (areDatesConsecutive(sorted[i - 1], sorted[i])) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push({
        startDate: currentGroup[0],
        endDate: currentGroup[currentGroup.length - 1],
        dates: [...currentGroup],
      });
      currentGroup = [sorted[i]];
    }
  }

  // Don't forget the last group
  groups.push({
    startDate: currentGroup[0],
    endDate: currentGroup[currentGroup.length - 1],
    dates: [...currentGroup],
  });

  return groups;
}

/**
 * Get the start date of the most recent cycle
 * Returns null if no valid cycle data exists
 */
export function getLatestCycleStart(dates: DateKey[]): DateKey | null {
  const groups = groupConsecutiveDates(dates);
  if (groups.length === 0) return null;

  // Return the start date of the most recent cycle group
  const latestGroup = groups[groups.length - 1];
  return latestGroup.startDate;
}

/**
 * Generate predicted period dates based on cycle history
 * Predicts from the latest cycle start date for maximum accuracy
 */
export function generatePredictions(
  selectedDates: DateKey[],
  cycleLength: number,
  periodLength: number,
  predictionCycles: number = 3
): DateKey[] {
  const predictions: DateKey[] = [];
  const latestCycleStart = getLatestCycleStart(selectedDates);

  // If no data, we cannot make accurate predictions
  // Return empty array - calendar will show empty state
  if (!latestCycleStart) {
    return predictions;
  }

  for (let cycleIndex = 1; cycleIndex <= predictionCycles; cycleIndex++) {
    const cycleStartDate = addDaysToDateKey(
      latestCycleStart,
      cycleLength * cycleIndex
    );

    for (let dayOffset = 0; dayOffset < periodLength; dayOffset++) {
      const predictedDate = addDaysToDateKey(cycleStartDate, dayOffset);
      if (!predictions.includes(predictedDate)) {
        predictions.push(predictedDate);
      }
    }
  }

  return predictions;
}
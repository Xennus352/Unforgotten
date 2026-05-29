import { scheduleCustomCareNotification } from "@/app/(tabs)/index";
import { DateKey } from "@/types/period";

interface TrackingData {
  selectedDates: DateKey[]; // Array of strings
  predictedDates: DateKey[]; // Array of strings
  cycleLength: number;
  periodLength: number;
  anniversaryDate?: string;
}

/**
 * Evaluates tracking data timelines and schedules the targeted push variant
 */
export async function evaluateAndScheduleDailyNotification(data: TrackingData) {
  const today = new Date();
  const todayStr = formatDateToKey(today);

  // 1. Target Condition: Anniversary Check
  if (data.anniversaryDate) {
    const anniDate = new Date(data.anniversaryDate);
    if (
      today.getDate() === anniDate.getDate() &&
      today.getMonth() === anniDate.getMonth()
    ) {
      await scheduleCustomCareNotification("anniversary");
      return "anniversary";
    }
  }

  // 2. Target Condition: Every Day In Period Check (Logged OR Predicted)
  // FIX: Using .includes(todayStr) solves the index/any error completely
  if (
    data.selectedDates.includes(todayStr) ||
    data.predictedDates.includes(todayStr)
  ) {
    await scheduleCustomCareNotification("in_period");
    return "in_period";
  }

  // 3. Target Condition: Near Period Check (Exactly 2 days out)
  const isNear = checkIfPeriodIsApproaching(data.predictedDates, 2);
  if (isNear) {
    await scheduleCustomCareNotification("near_period");
    return "near_period";
  }

  // 4. Default Fallback Context
  await scheduleCustomCareNotification("sweet");
  return "sweet";
}

/**
 * Utility: Checks if a predicted period date exists within the next X days
 */
function checkIfPeriodIsApproaching(
  predictedDates: DateKey[],
  daysAhead: number,
): boolean {
  const today = new Date();

  for (let i = 1; i <= daysAhead; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    const futureKey = formatDateToKey(futureDate);

    // FIX: Changed from bracket index lookups to .includes()
    if (predictedDates.includes(futureKey)) {
      return true;
    }
  }
  return false;
}

/**
 * Helper to standardise Dates to "YYYY-MM-DD" strings matching your DateKey
 */
function formatDateToKey(date: Date): DateKey {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as DateKey;
}

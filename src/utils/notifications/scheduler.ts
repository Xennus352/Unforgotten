import { CareCategory, NotificationPayload } from "@/types/message";
import { DateKey } from "@/types/period";
import { generateCareMessage } from "@/utils/messageEngine";
import * as Notifications from "expo-notifications";

interface TrackingData {
  selectedDates: DateKey[];
  predictedDates: DateKey[];
  cycleLength: number;
  periodLength: number;
  anniversaryDate?: string;
  fetchRelationshipStart?: string; // Added to catch your explicit debug property
  relationshipStart?: string; // Added fallback safety anchor
}

export async function evaluateAndScheduleDailyNotification(
  data: TrackingData,
  explicitAnniversaryDate?: string, // 👈 Add this explicit string parameter here
) {
  const today = new Date();
  const todayStr = formatDateToKey(today);

  // Fallback chain: check explicit parameter first, then look inside the data object properties
  const targetAnniDate =
    explicitAnniversaryDate ||
    data.anniversaryDate ||
    data.fetchRelationshipStart ||
    (data as any).relationshipStart;

  // Safety guard: if anniversary date is missing, log warning and skip anniversary logic
  if (!targetAnniDate) {
    console.warn("Anniversary date missing - skipping anniversary logic");
  } else {
    console.log(
      `[Evaluation Debug] Resolved Anniversary Date to: ${targetAnniDate}`,
    );

    // 1. Target Condition: Anniversary Check (On the exact day OR approaching in the next 2 days)
    const yearlyMatch = checkYearlyAnniversary(targetAnniDate, 2);
    const monthlyMatch = checkMonthlyAnniversary(targetAnniDate, 2);

    if (yearlyMatch) {
      await scheduleCustomCareNotification("anniversary_yearly");
      return "anniversary_yearly";
    }

    if (monthlyMatch) {
      await scheduleCustomCareNotification("anniversary_monthly");
      return "anniversary_monthly";
    }
  }

  // 2. Target Condition: Every Day In Period Check (Logged OR Predicted)
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
 * Utility: Checks if the recurring anniversary falls on today or within the next X days (yearly: month + day)
 */
function checkYearlyAnniversary(
  anniversaryDateStr: string,
  daysAhead: number,
): boolean {
  console.log("❤️ Raw anniversary input:", anniversaryDateStr);

  // ✅ Force safe parsing from YYYY-MM-DD or ISO
  const cleanDate = anniversaryDateStr.split("T")[0];
  const parts = cleanDate.split("-");

  if (parts.length !== 3) {
    console.log("❌ Invalid format:", anniversaryDateStr);
    return false;
  }

  const targetMonth = Number(parts[1]) - 1;
  const targetDay = Number(parts[2]);

  const now = new Date();

  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);

    console.log(
      `[Anni Debug] ${d.getMonth() + 1}-${d.getDate()} vs ${targetMonth + 1}-${targetDay}`,
    );

    if (d.getMonth() === targetMonth && d.getDate() === targetDay) {
      console.log("❤️ ANNIVERSARY MATCHED (yearly)");
      return true;
    }
  }

  return false;
}

/**
 * Utility: Checks if the recurring anniversary falls on today or within the next X days (monthly: day of month only)
 */
function checkMonthlyAnniversary(
  anniversaryDateStr: string,
  daysAhead: number,
): boolean {
  console.log("❤️ Raw anniversary input (monthly):", anniversaryDateStr);

  // ✅ Force safe parsing from YYYY-MM-DD or ISO
  const cleanDate = anniversaryDateStr.split("T")[0];
  const parts = cleanDate.split("-");

  if (parts.length !== 3) {
    console.log("❌ Invalid format:", anniversaryDateStr);
    return false;
  }

  const targetDay = Number(parts[2]);

  const now = new Date();

  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);

    console.log(
      `[Anni Debug] ${d.getDate()} vs ${targetDay}`,
    );

    if (d.getDate() === targetDay) {
      console.log("❤️ ANNIVERSARY MATCHED (monthly)");
      return true;
    }
  }

  return false;
}

/**
 * Utility: Checks if a predicted period date exists within the next X days
 */
function checkIfPeriodIsApproaching(
  predictedDates: DateKey[],
  daysAhead: number,
): boolean {
  const today = new Date();
  const baseTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    12,
    0,
    0,
  ).getTime();

  for (let i = 1; i <= daysAhead; i++) {
    const futureDate = new Date(baseTime + i * 86400000);
    const futureKey = formatDateToKey(futureDate);

    if (predictedDates.includes(futureKey)) {
      return true;
    }
  }

  return false;
}

function formatDateToKey(date: Date): DateKey {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as DateKey;
}

export async function scheduleCustomCareNotification(
  currentPhase: CareCategory,
) {
  const messageDetails = generateCareMessage(currentPhase);

  const payload: NotificationPayload = {
    category: currentPhase,
    appVersion: "1.0.0",
    messageId: messageDetails.id,
  };

  const allNotifications =
    await Notifications.getAllScheduledNotificationsAsync();
  for (const notification of allNotifications) {
    const notificationData = notification.content.data as
      | NotificationPayload
      | undefined;
    if (
      notificationData &&
      notificationData.appVersion === "1.0.0" &&
      notificationData.category &&
      notificationData.messageId
    ) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📨 Unforgotten",
      body: messageDetails.text,
      sound: true,
      data: payload,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      repeats: false,
    },
  });

  console.log(`📨 Scheduled [${currentPhase}]`);
}
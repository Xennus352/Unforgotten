
import * as Notifications from 'expo-notifications';
import { generateCareMessage } from './messageEngine';
import { CareCategory, NotificationPayload } from '@/types/message';

export async function scheduleCareNotification(category: CareCategory = 'sweet'): Promise<string> {
  // 1. Generate text variations dynamically
  const messageDetails = generateCareMessage(category, true);

  // 2. Map payload cleanly to our TS interface
  const notificationPayload: NotificationPayload = {
    category: category,
    appVersion: "1.0.0",
    messageId: messageDetails.id
  };

  // 3. Hand off configuration object to Expo
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "🧪 Unforgotten",
      body: messageDetails.text, // Displays full combined Burmese text on screen
      sound: true,
      data: notificationPayload, // Stored implicitly as JSON string map underneath
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60,
      repeats: false,
    },
  });

  console.log(`📨 Scheduled [${category}] with ID:`, id);
  return id;
}
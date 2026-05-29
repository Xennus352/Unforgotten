import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function initializeNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });
  }

  return true;
}
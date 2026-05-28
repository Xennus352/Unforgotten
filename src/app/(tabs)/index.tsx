import Calendar from "@/components/periodSpace/Calendar";
import OnboardingModal from "@/components/periodSpace/OnboardingModal";
import { layout, theme } from "@/constants/theme";
import { usePeriodData } from "@/hooks/usePeriodData";
import { DateKey } from "@/types/period";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CareCategory, NotificationPayload } from "@/types/message";
import { generateCareMessage } from "@/utils/messageEngine";
import * as Notifications from "expo-notifications";

// Dynamic Notification Service Linked to Cycle Context
export async function scheduleCustomCareNotification(
  currentPhase: CareCategory,
) {
  // Compile completely unique message permutation
  const messageDetails = generateCareMessage(currentPhase);

  const payload: NotificationPayload = {
    category: currentPhase,
    appVersion: "1.0.0",
    messageId: messageDetails.id,
  };

  //  Queue Alert to fire in exactly 1 minute
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "💝 Unforgotten",
      body: messageDetails.text, // Combined Burmese Text variation
      sound: true,
      data: payload,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60, 
      repeats: false,
    },
  });

  console.log(
    `📨 Test [${currentPhase}] alert queued for 1 minute from now. ID:`,
    id,
  );
}

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [configOpen, setConfigOpen] = useState(false);

  const {
    selectedDates,
    cycleLength,
    periodLength,
    isNewUser,
    toggleDate,
    saveSettings,
    completeOnboarding,
    initialized,
    predictedDates,
  } = usePeriodData();

  /**
   * Temporary Test Engine: Randomly selects a category to test text variations
   */
  const determineCurrentCategory = useCallback((): CareCategory => {
    const testCategories: CareCategory[] = [
      "sweet",
      "near_period",
      "in_period",
      "anniversary",
    ];
    const randomIndex = Math.floor(Math.random() * testCategories.length);
    return testCategories[randomIndex];
  }, []);

  const triggerNotificationTest = useCallback(async () => {
    const activeCategory = determineCurrentCategory();
    await scheduleCustomCareNotification(activeCategory);
  }, [determineCurrentCategory]);

  ///TODO:Test only

  const handleMonthChange = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return direction === "prev"
        ? new Date(year, month - 1, 1)
        : new Date(year, month + 1, 1);
    });
  }, []);

  const handleSaveSettings = useCallback(
    (newCycle: number, newPeriod: number) => {
      saveSettings(newCycle, newPeriod);
      if (isNewUser) {
        completeOnboarding();
      } else {
        setConfigOpen(false);
      }
    },
    [isNewUser, saveSettings, completeOnboarding],
  );

  const handleToggleDate = useCallback(
    (dateKey: DateKey) => toggleDate(dateKey),
    [toggleDate],
  );

  // Loading state during initialization
  if (!initialized) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Period tracker content"
      >
        {/* Header Hero Section */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>Hello there,</Text>
            <Text style={styles.mainTitle}>Your Cycle Insights</Text>
          </View>

          {!isNewUser && (
            <TouchableOpacity
              style={styles.settingsIconButton}
              onPress={() => setConfigOpen(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              accessibilityHint="Adjust cycle tracking parameters"
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Status Widget */}
        <View style={styles.heroWidget}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroStatusLabel}>Current Status</Text>
            <Text style={styles.heroStatusMain}>Prediction Window Active</Text>
            <Text style={styles.heroStatusSub}>
              Log dates below to fine-tune accuracy
            </Text>
          </View>

          <View style={styles.heroBadgeCircle}>
            <Ionicons name="heart" size={28} color={theme.textInverse} />
          </View>
        </View>

        {/* Side-By-Side Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.iconWrapper, { backgroundColor: "#FFF0F2" }]}>
              <Ionicons
                name="sync-outline"
                size={20}
                color={theme.primary}
                accessibilityLabel="Cycle icon"
              />
            </View>

            <Text style={styles.metricLabel}>Cycle Length</Text>
            <Text style={styles.metricValue}>
              {cycleLength} <Text style={styles.metricUnit}>days</Text>
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconWrapper, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons
                name="water-outline"
                size={20}
                color={theme.success}
                accessibilityLabel="Water drop icon"
              />
            </View>

            <Text style={styles.metricLabel}>Period Flow</Text>
            <Text style={styles.metricValue}>
              {periodLength} <Text style={styles.metricUnit}>days</Text>
            </Text>
          </View>
        </View>

        {/* Calendar Section - No layout hacks needed */}
        <Calendar
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          selectedDates={selectedDates}
          predictedDates={predictedDates}
          onToggleDate={handleToggleDate}
        />

        {/* FIXED: Swapped out dead reference for triggerNotificationTest */}
        <View style={{ flex: 1, justifyContent: "center", marginTop: 20 }}>
          <Button
            title="Send Notification (1 Min)"
            onPress={triggerNotificationTest}
          />
        </View>
      </ScrollView>

      <OnboardingModal
        visible={isNewUser || configOpen}
        isDismissable={!isNewUser}
        onClose={() => setConfigOpen(false)}
        onSave={handleSaveSettings}
        initialCycle={cycleLength}
        initialPeriod={periodLength}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  greetingText: {
    fontSize: 14,
    color: theme.textMuted,
    fontWeight: "500",
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.text,
    marginTop: 2,
  },

  settingsIconButton: {
    backgroundColor: theme.surface,
    padding: 10,
    borderRadius: 14,
    elevation: 2,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    minHeight: layout.touchTarget.minimum,
    minWidth: layout.touchTarget.minimum,
    alignItems: "center",
    justifyContent: "center",
  },

  heroWidget: {
    backgroundColor: theme.primary,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    elevation: 4,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  heroTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  heroStatusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  heroStatusMain: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.textInverse,
    marginTop: 4,
  },

  heroStatusSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },

  heroBadgeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  metricsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },

  metricCard: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },

  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  metricLabel: {
    fontSize: 13,
    color: theme.textMuted,
    fontWeight: "500",
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.text,
    marginTop: 4,
  },

  metricUnit: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.textMuted,
  },
});

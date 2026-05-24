import Calendar from "@/components/periodSpace/Calendar";
import OnboardingModal from "@/components/periodSpace/OnboardingModal";
import { colors } from "@/constants/theme";
import { usePeriodData } from "@/hooks/usePeriodData";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  } = usePeriodData();

  const computedPredictedDates = useMemo(() => {
    const predictions: string[] = [];
    let baseDate = new Date();

    if (selectedDates && selectedDates.length > 0) {
      const sorted = [...selectedDates].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      );
      baseDate = new Date(sorted[sorted.length - 1]);
    } else {
      baseDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    }

    for (let cycleIndex = 1; cycleIndex <= 3; cycleIndex++) {
      const nextCycleStart = new Date(baseDate);
      nextCycleStart.setDate(
        nextCycleStart.getDate() + cycleLength * cycleIndex,
      );

      for (let p = 0; p < periodLength; p++) {
        const pDate = new Date(nextCycleStart);
        pDate.setDate(pDate.getDate() + p);
        const key = `${pDate.getFullYear()}-${String(pDate.getMonth() + 1).padStart(2, "0")}-${String(pDate.getDate()).padStart(2, "0")}`;
        if (!predictions.includes(key)) {
          predictions.push(key);
        }
      }
    }

    return predictions;
  }, [selectedDates, cycleLength, periodLength, currentDate]);

  if (!initialized) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const year = prev.getFullYear();
      const month = prev.getMonth();
      return direction === "prev"
        ? new Date(year, month - 1, 1)
        : new Date(year, month + 1, 1);
    });
  };

  const handleSaveMetrics = (newCycle: number, newPeriod: number) => {
    saveSettings(newCycle, newPeriod);
    if (isNewUser) {
      completeOnboarding();
    } else {
      setConfigOpen(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCapsule}>
          <View style={styles.statusHeaderRow}>
            <Text style={styles.statusTitle}>Period Tracker Insights</Text>

            {!isNewUser && (
              <TouchableOpacity
                style={styles.settingsBadge}
                onPress={() => setConfigOpen(true)}
              >
                <Ionicons
                  name="options-outline"
                  size={14}
                  color={colors.neutral}
                />
                <Text style={styles.settingsBadgeText}>Configure</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.infoText}>
            • Cycle Duration:{" "}
            <Text style={{ fontWeight: "700" }}>{cycleLength} Days</Text>
          </Text>
          <Text style={styles.infoText}>
            • Period Duration:{" "}
            <Text style={{ fontWeight: "700" }}>{periodLength} Days</Text>
          </Text>
        </View>

        <Calendar
          currentDate={currentDate}
          onMonthChange={handleMonthChange}
          selectedDates={selectedDates}
          predictedDates={computedPredictedDates}
          onToggleDate={toggleDate}
        />
      </ScrollView>

      <OnboardingModal
        visible={isNewUser || configOpen}
        isDismissable={!isNewUser}
        onClose={() => setConfigOpen(false)}
        onSave={handleSaveMetrics}
        initialCycle={cycleLength}
        initialPeriod={periodLength}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16, paddingBottom: 40, marginTop: -4 },
  statusCapsule: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  statusHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral,
  },
  settingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.creamBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  settingsBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral,
  },
  infoText: {
    fontSize: 14,
    color: colors.neutral,
    marginTop: 5,
  },
});


import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/theme";

const { width } = Dimensions.get("window");

// Better spacing calculation
const HORIZONTAL_PADDING = 32;
const GRID_GAP = 4;
const DAY_SIZE = (width - HORIZONTAL_PADDING - GRID_GAP * 6) / 7;

export default function Tracker() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 24));

  const [selectedDays, setSelectedDays] = useState<number[]>([
    12, 13, 14, 15, 16,
  ]);

  const [predictedDays] = useState<number[]>([
    9, 10, 11, 17, 18,
  ]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month]
  );

  const firstDayIndex = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month]
  );

  const toggleDaySelection = (day: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }

      return [...prev, day].sort((a, b) => a - b);
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderDays = () => {
    const totalSlots = [];

    // Empty slots before month starts
    for (let i = 0; i < firstDayIndex; i++) {
      totalSlots.push(
        <View key={`empty-${i}`} style={styles.dayCellEmpty} />
      );
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const isPeriodActive = selectedDays.includes(day);
      const isPredicted = predictedDays.includes(day);

      totalSlots.push(
        <TouchableOpacity
          key={`day-${day}`}
          activeOpacity={0.85}
          onPress={() => toggleDaySelection(day)}
          style={[
            styles.dayCell,
            isPeriodActive && styles.activePeriodCell,
            isPredicted && !isPeriodActive && styles.predictedPeriodCell,
          ]}
        >
          <Text
            style={[
              styles.dayText,
              isPeriodActive && styles.activePeriodText,
              isPredicted && !isPeriodActive && styles.predictedPeriodText,
            ]}
          >
            {day}
          </Text>

          {isPeriodActive && <View style={styles.dropletIndicator} />}
        </TouchableOpacity>
      );
    }

    return totalSlots;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.statusCapsule}>
        <View style={styles.statusHeaderRow}>
          <Ionicons
            name="heart-sharp"
            size={24}
            color={colors.primary}
          />

          <Text style={styles.statusTitle}>Her Cycle Sync</Text>
        </View>

        <Text style={styles.statusSubtitle}>
          {selectedDays.length > 0
            ? `Day ${selectedDays.length} of your current window`
            : "Next romantic milestone predicting shortly"}
        </Text>
      </View>

      {/* Calendar */}
      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={handlePrevMonth}
            style={styles.arrowButton}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={colors.neutral}
            />
          </TouchableOpacity>

          <Text style={styles.monthLabel}>
            {monthNames[month]} {year}
          </Text>

          <TouchableOpacity
            onPress={handleNextMonth}
            style={styles.arrowButton}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.neutral}
            />
          </TouchableOpacity>
        </View>

        {/* Week labels */}
        <View style={styles.weekDaysRow}>
          {["S", "M", "T", "W", "T", "F", "S"].map(
            (dayName, idx) => (
              <Text key={idx} style={styles.weekDayLabel}>
                {dayName}
              </Text>
            )
          )}
        </View>

        {/* Calendar grid */}
        <View style={styles.daysMatrixGrid}>{renderDays()}</View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: colors.primary },
            ]}
          />

          <Text style={styles.legendText}>Active Flow Period</Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor: "rgba(255,194,209,0.35)",
                borderWidth: 1,
                borderColor: colors.primary,
              },
            ]}
          />

          <Text style={styles.legendText}>Predicted Window</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBg,
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 50,
  },

  statusCapsule: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,

    borderWidth: 1,
    borderColor: "rgba(255,194,209,0.25)",
  },

  statusHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral,
  },

  statusSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(137,113,114,0.75)",
    fontWeight: "500",
  },

  calendarCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
  },

  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.creamBg,
    alignItems: "center",
    justifyContent: "center",
  },

  monthLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.neutral,
    letterSpacing: 0.3,
  },

  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  weekDayLabel: {
    width: DAY_SIZE,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(137,113,114,0.45)",
  },

  daysMatrixGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: GRID_GAP,
  },

  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: GRID_GAP,
    position: "relative",
  },

  dayCellEmpty: {
    width: DAY_SIZE,
    height: DAY_SIZE,
  },

  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral,
  },

  activePeriodCell: {
    backgroundColor: colors.primary,

    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },

  activePeriodText: {
    color: colors.white,
    fontWeight: "700",
  },

  predictedPeriodCell: {
    backgroundColor: "rgba(255,194,209,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,194,209,0.55)",
  },

  predictedPeriodText: {
    color: colors.neutral,
    fontWeight: "600",
  },

  dropletIndicator: {
    position: "absolute",
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
  },

  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 24,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.neutral,
  },
});

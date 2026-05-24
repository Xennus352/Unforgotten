import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const DAY_SIZE = Math.floor((width - 32) / 7) - 1;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarProps {
  currentDate: Date;
  onMonthChange: (direction: "prev" | "next") => void;
  selectedDates: string[];
  predictedDates?: string[];
  onToggleDate?: (dateKey: string) => void;
}

export default function Calendar({
  currentDate,
  onMonthChange,
  selectedDates,
  predictedDates = [],
  onToggleDate,
}: CalendarProps) {
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

  const todayObj = new Date();
  const todayKey = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month],
  );
  const firstDayIndex = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month],
  );

  const daysGrid = useMemo(() => {
    const items = [];

    for (let i = 0; i < firstDayIndex; i++) {
      items.push(<View key={`empty-${i}`} style={styles.dayCellEmpty} />);
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const isToday = dateKey === todayKey;
      const isPassedPeriod = selectedDates.includes(dateKey);
      const isPredictedPeriod = predictedDates.includes(dateKey);

      const textStyle = [
        styles.dayText,
        isPassedPeriod && styles.activePeriodText,
        isPredictedPeriod && styles.predictedPeriodText,
      ];

      items.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={styles.dayCell}
          onPress={() => onToggleDate?.(dateKey)}
          activeOpacity={0.7}
        >
          {isPassedPeriod && (
            <View style={[styles.statusCapsule, styles.activePeriodCapsule]} />
          )}

          {isPredictedPeriod && !isPassedPeriod && (
            <View
              style={[styles.statusCapsule, styles.predictedPeriodCapsule]}
            />
          )}

          {isToday && <View style={styles.todayOutlineCell} />}

          <Text style={textStyle}>{day}</Text>

          {isPassedPeriod && (
            <Ionicons
              name="heart"
              size={11}
              color={colors.white}
              style={styles.heartIndicator}
            />
          )}
          {isPredictedPeriod && !isPassedPeriod && (
            <Ionicons
              name="heart-outline"
              size={11}
              color={colors.primary}
              style={styles.heartIndicator}
            />
          )}
        </TouchableOpacity>
      );
    }

    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    year,
    month,
    daysInMonth,
    firstDayIndex,
    selectedDates,
    predictedDates,
    todayKey,
  ]);

  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <Text style={styles.arrowButton} onPress={() => onMonthChange("prev")}>
          <Ionicons name="chevron-back" size={18} color={colors.neutral} />
        </Text>

        <Text style={styles.monthLabel}>
          {monthNames[month]} {year}
        </Text>

        <Text style={styles.arrowButton} onPress={() => onMonthChange("next")}>
          <Ionicons name="chevron-forward" size={18} color={colors.neutral} />
        </Text>
      </View>

      <View style={styles.weekDaysRow}>
        {WEEKDAYS.map((day, idx) => (
          <Text key={`weekday-${idx}`} style={styles.weekDayLabel}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysMatrixGrid}>{daysGrid}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 16,
    width: "100%",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  arrowButton: {
    padding: 8,
    backgroundColor: colors.creamBg,
    borderRadius: 50,
    textAlign: "center",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.neutral,
  },
  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 10,
    width: "100%",
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
    width: DAY_SIZE * 7,
    alignSelf: "center",
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 2,
  },
  dayCellEmpty: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    marginVertical: 2,
  },
  statusCapsule: {
    position: "absolute",
    width: DAY_SIZE * 0.85,
    height: DAY_SIZE * 0.85,
    borderRadius: (DAY_SIZE * 0.85) / 2,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.neutral,
  },
  activePeriodCapsule: {
    backgroundColor: colors.primary,
  },
  activePeriodText: {
    color: colors.white,
    fontWeight: "700",
  },
  predictedPeriodCapsule: {
    backgroundColor: `${colors.primary}25`,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  predictedPeriodText: {
    color: colors.primary,
    fontWeight: "700",
  },
  todayOutlineCell: {
    position: "absolute",
    width: DAY_SIZE * 0.85,
    height: DAY_SIZE * 0.85,
    borderRadius: (DAY_SIZE * 0.85) / 2,
    borderWidth: 1.5,
    borderColor: colors.neutral,
  },
  heartIndicator: {
    position: "absolute",
    bottom: 1,
  },
});

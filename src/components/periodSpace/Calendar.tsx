import { theme } from "@/constants/theme";
import { CalendarDay, DateKey } from "@/types/period";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CalendarProps {
  currentDate: Date;
  onMonthChange: (direction: "prev" | "next") => void;
  selectedDates: DateKey[];
  predictedDates: DateKey[];
  onToggleDate?: (dateKey: DateKey) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const DAY_SIZE = Math.max(
  32,
  Math.min(48, Math.floor((screenWidth - 48) / 7) - 2),
);

const MONTH_NAMES = [
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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  currentDate,
  onMonthChange,
  selectedDates,
  predictedDates,
  onToggleDate,
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const todayKey = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}` as DateKey;
  }, []);

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month],
  );
  const firstDayIndex = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month],
  );

  const calendarDays = useMemo((): CalendarDay[] => {
    const days: CalendarDay[] = [];

    // Add empty placeholder cells for days before month start
    // These render as blank cells but maintain grid alignment
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dateKey: `placeholder-leading-${i}` as DateKey,
        day: null,
        isToday: false,
        isCurrentMonth: false,
        isSelected: false,
        isPredicted: false,
        isWeekend: false,
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` as DateKey;
      const dayDate = new Date(year, month, day);
      const dayOfWeek = dayDate.getDay();

      days.push({
        dateKey,
        day,
        isToday: dateKey === todayKey,
        isCurrentMonth: true,
        isSelected: selectedDates.includes(dateKey),
        isPredicted: predictedDates.includes(dateKey),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }

    // Fill remaining cells to complete 6 rows (42 cells total)
    // This ensures proper grid alignment for all months
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
      days.push({
        dateKey: `placeholder-trailing-${i}` as DateKey,
        day: null,
        isToday: false,
        isCurrentMonth: false,
        isSelected: false,
        isPredicted: false,
        isWeekend: false,
      });
    }

    return days;
  }, [
    year,
    month,
    daysInMonth,
    firstDayIndex,
    todayKey,
    selectedDates,
    predictedDates,
  ]);

  const handleDayPress = useCallback(
    (dateKey: DateKey) => {
      onToggleDate?.(dateKey);
    },
    [onToggleDate],
  );

  const renderDay = useCallback(
    (day: CalendarDay) => {
      const accessibilityLabel = day.isCurrentMonth
        ? `${day.day}${getOrdinalSuffix(day.day || 0)} ${MONTH_NAMES[month]}, ${year}`
        : day.day === null
          ? "Empty day"
          : `Other month day ${day.day}`;

      const dayStyle = [
        styles.dayCell,
        day.isCurrentMonth && styles.currentMonthDay,
      ];

      // Don't show today indicator if selected or predicted
      const showTodayIndicator =
        day.isToday && !day.isSelected && !day.isPredicted;

      return (
        <TouchableOpacity
          key={day.dateKey}
          style={dayStyle}
          onPress={() =>
            day.isCurrentMonth && handleDayPress(day.dateKey as DateKey)
          }
          disabled={!day.isCurrentMonth}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={
            day.isCurrentMonth ? "Tap to log period day" : undefined
          }
          accessibilityState={{ selected: day.isSelected }}
        >
          {day.isCurrentMonth && (
            <View style={styles.dayWrapper}>
              {/* BACKGROUND */}
              {day.isToday && !day.isSelected && !day.isPredicted && (
                <View style={styles.todayCell} />
              )}

              {day.isPredicted && !day.isSelected && (
                <View style={styles.predictedIndicator} />
              )}

              {day.isSelected && <View style={styles.selectedIndicator} />}

              {/* NUMBER (ONLY ONCE) */}
              {day.day !== null && (
                <Text
                  style={[
                    styles.dayText,
                    day.isToday &&
                      !day.isSelected &&
                      !day.isPredicted &&
                      styles.todayText,
                    day.isSelected && styles.selectedDayText,
                    day.isPredicted &&
                      !day.isSelected &&
                      styles.predictedDayText,
                  ]}
                >
                  {day.day}
                </Text>
              )}

              {/* ICON */}
              {day.isSelected && (
                <View>
                  <Ionicons name="heart" size={10} color={theme.textInverse} />
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [month, year, handleDayPress],
  );

  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onMonthChange("prev")}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          accessibilityHint="Navigate to previous month"
        >
          <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>
          {MONTH_NAMES[month]} {year}
        </Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onMonthChange("next")}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          accessibilityHint="Navigate to next month"
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysRow}>
        {WEEKDAYS.map((day, idx) => (
          <Text
            key={`weekday-${idx}`}
            style={[
              styles.weekDayLabel,
              idx === 0 || idx === 6 ? styles.weekendLabel : null,
            ]}
            accessibilityLabel={day}
          >
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysMatrix}>{calendarDays.map(renderDay)}</View>
    </View>
  );
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

const styles = StyleSheet.create({
  calendarCard: {
    backgroundColor: theme.surface,
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
  dayWrapper: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  navButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: theme.cardSecondary,
  },

  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.text,
    letterSpacing: 0.2,
  },

  weekDaysRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  weekDayLabel: {
    width: DAY_SIZE,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: theme.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  weekendLabel: {
    color: theme.dangerSoft,
  },

  daysMatrix: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 1.5,
  },

  currentMonthDay: {
    opacity: 1,
  },

  todayCell: {
    position: "absolute",
    width: DAY_SIZE * 0.78,
    height: DAY_SIZE * 0.78,
    borderRadius: DAY_SIZE * 0.39,
    borderWidth: 1.5,
    borderColor: theme.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedIndicator: {
    position: "absolute",
    width: DAY_SIZE * 0.82,
    height: DAY_SIZE * 0.82,
    borderRadius: DAY_SIZE * 0.41,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  predictedIndicator: {
    position: "absolute",
    width: DAY_SIZE * 0.7,
    height: DAY_SIZE * 0.7,
    borderRadius: DAY_SIZE * 0.35,
    backgroundColor: theme.primarySoft,
    opacity: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },

  dayText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.text,
  },

  todayText: {
    color: theme.text,
    fontWeight: "700",
  },

  selectedDayText: {
    color: theme.textInverse,
    fontWeight: "700",
  },

  predictedDayText: {
    color: theme.primary,
    fontWeight: "600",
  },

  otherMonthText: {
    color: theme.textMuted,
  },
});

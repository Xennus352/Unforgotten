import { colors } from "@/constants/theme";
import type { Milestone } from "@/types/milestone";
import { toIsoDate } from "@/utils/date";
import { milestoneMarkedDates } from "@/utils/milestoneEvents";
import { Ionicons } from "@expo/vector-icons"; // Added Ionicons Import
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  milestones: Milestone[];
};


const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MilestoneCalendarPanel({ milestones }: Props) {
  const insets = useSafeAreaInsets();
  const today = toIsoDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const scrollRef = useRef<ScrollView>(null);

  // Dynamic real-time date compilation string
  const dynamicTodayString = useMemo(() => {
    const d = new Date();
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }, []);

  const milestoneMap = useMemo(() => {
    const marks = milestoneMarkedDates(milestones);
    return marks;
  }, [milestones]);

  const dateStrip = useMemo(() => {
    const list = [];
    const baseDate = new Date();
    for (let i = -14; i <= 14; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = toIsoDate(d);
      list.push({
        isoString: iso,
        dayNum: d.getDate(),
        dayName: WEEK_DAYS[d.getDay()],
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        hasMilestone: !!milestoneMap[iso]?.marked,
      });
    }
    return list;
  }, [milestoneMap]);

  const currentFocus = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d.getTime())) return { day: "--", month: "---", year: "" };
    return {
      day: d.getDate(),
      month: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
    };
  }, [selectedDate]);

  const activeMilestonesCount = useMemo(() => {
    return milestones.filter((m) => m.date === selectedDate).length;
  }, [milestones, selectedDate]);

  return (
    <View style={[styles.rootContainer, { paddingTop: insets.top + 12 }]}>
      <View style={styles.scrollerSectionView}>
        <Text style={styles.scrollerSectionTitle}>
          Select Anchor Date
        </Text>
        
        
        <View style={styles.todayDateBadgeRow}>
          <Ionicons 
            name="today-outline" 
            size={13} 
            color={colors.neutral} 
            style={styles.todayIconShift}
          />
          <Text style={styles.todayDateBadgeText}>
            {dynamicTodayString}
          </Text>
        </View>
      </View>

      <View style={styles.asymmetricLayoutGrid}>
        {/* LEFT COLUMN: Large Abstract Focus Panel */}
        <View style={styles.focusBlock}>
          <Text style={styles.focusMonth}>{currentFocus.month}</Text>
          <Text style={styles.focusDay}>{currentFocus.day}</Text>
          <View style={styles.focusLine} />
          {activeMilestonesCount > 0 ? (
            <View style={styles.activeEventBadge}>
              <Text style={styles.activeEventBadgeText}>
                {activeMilestonesCount}{" "}
                {activeMilestonesCount === 1 ? "Event" : "Events"}
              </Text>
            </View>
          ) : (
            <Text style={styles.focusYear}>{currentFocus.year}</Text>
          )}
        </View>

        {/* RIGHT COLUMN: Elegant Carousel Wheels */}
        <View style={styles.scrollerWrapper}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            decelerationRate="fast"
            snapToInterval={68}
          >
            {dateStrip.map((item) => {
              const isSelected = item.isoString === selectedDate;
              const isToday = item.isoString === today;

              return (
                <Pressable
                  key={item.isoString}
                  onPress={() => setSelectedDate(item.isoString)}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipSelected,
                    isToday && !isSelected && styles.dateChipTodayBorder,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNameLabel,
                      isSelected && styles.textSelected,
                    ]}
                  >
                    {item.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dayNumberLabel,
                      isSelected && styles.textSelected,
                    ]}
                  >
                    {item.dayNum}
                  </Text>

                  <View style={styles.indicatorContainer}>
                    {item.hasMilestone && (
                      <View
                        style={[
                          styles.milestoneDot,
                          isSelected && styles.milestoneDotSelected,
                        ]}
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: "transparent",
    paddingBottom: 5,
  },
  asymmetricLayoutGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
    alignItems: "center",
  },
  focusBlock: {
    backgroundColor: colors.white,
    borderRadius: 42,
    width: 70,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 48, 127, 0.4)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  focusMonth: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.neutral,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  focusDay: {
    fontSize: 24,
    fontWeight: "900",
    color: "#4A3E3F",
    lineHeight: 38,
    marginVertical: 2,
  },
  focusLine: {
    width: 20,
    height: 2.5,
    backgroundColor: colors.primary,
    borderRadius: 1,
    marginBottom: 6,
  },
  focusYear: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.neutral,
    opacity: 0.7,
  },
  activeEventBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeEventBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.white,
  },
  scrollerWrapper: {
    flex: 1,
    justifyContent: "center",
    height: 120,
  },
  scrollerSectionView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  scrollerSectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.neutral,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  todayDateBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  todayIconShift: {
    marginTop: -2, 
  },
  todayDateBadgeText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.neutral,
    letterSpacing: 0.5,
  },
  scrollContainer: {
    paddingLeft: 2,
    paddingRight: 16,
    gap: 10,
    alignItems: "center",
  },
  dateChip: {
    width: 40,
    height: 74,
    borderRadius: 36,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(249, 3, 11, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  dateChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  dateChipTodayBorder: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: "rgba(255, 194, 209, 0.08)",
  },
  dayNameLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.neutral,
    opacity: 0.8,
  },
  dayNumberLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4A3E3F",
    marginTop: 2,
  },
  textSelected: {
    color: colors.white,
    opacity: 1,
  },
  indicatorContainer: {
    height: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    width: "100%",
  },
  milestoneDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  milestoneDotSelected: {
    backgroundColor: colors.white,
    width: 6,
    height: 6,
  },
});
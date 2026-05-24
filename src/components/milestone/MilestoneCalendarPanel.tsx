import type { Milestone } from "@/types/milestone";
import { toIsoDate } from "@/utils/date";
import { milestoneMarkedDates } from "@/utils/milestoneEvents";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  milestones: Milestone[];
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MilestoneCalendarPanel({ milestones }: Props) {
  const insets = useSafeAreaInsets();
  const today = toIsoDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const headerFormattedDate = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d.getTime())) return "";
    return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }, [selectedDate]);

  const currentMonthName = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d.getTime())) return "";
    return MONTH_NAMES[d.getMonth()];
  }, [selectedDate]);

  const markedDates = useMemo(() => {
    const marks = milestoneMarkedDates(milestones);
    
    Object.keys(marks).forEach((key) => {
      if (marks[key]) {
        marks[key].selected = false;
      }
    });

    const existing = marks[selectedDate];
    marks[selectedDate] = {
      ...existing,
      marked: existing?.marked ?? false,
      selected: true,
    };
    return { ...marks };
  }, [milestones, selectedDate]);

  return (
    <View style={styles.wrapper}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
      >
        {/* The clean header block container with the safe padding top metrics injected */}
        <View style={[styles.headerContainerBlock, { paddingTop: insets.top + 12 }]}>
          <LinearGradient
            colors={["#8C4F6e", "#5A344B"]} 
            style={StyleSheet.absoluteFill}
          />
          
          <View style={styles.topMetaRow}>
            <Text style={styles.dateMetaText}>{headerFormattedDate}</Text>
            <Text style={styles.monthLargeTitle}>{currentMonthName}</Text>
          </View>

          <View style={styles.weekStripContainer}>
            <WeekCalendar
              firstDay={1}
              markedDates={markedDates}
              allowShadow={false}
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",
                textSectionTitleColor: "rgba(255, 255, 255, 0.55)",
                textDayHeaderFontSize: 12,
                textDayHeaderFontWeight: "600",
                selectedDayBackgroundColor: "#FFFFFF",
                selectedDayTextColor: "#5A344B",
                todayTextColor: "#FF8C94",
                dayTextColor: "#FFFFFF",
                textDisabledColor: "rgba(255, 255, 255, 0.25)",
                dotColor: "rgba(255, 255, 255, 0.6)",
                selectedDotColor: "#5A344B",
              }}
            />
          </View>
        </View>
      </CalendarProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  headerContainerBlock: {
    paddingBottom: 10,
    //borderBottomLeftRadius: 18,
    //borderBottomRightRadius: 18,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    //shadowRadius: 6,
  },
  topMetaRow: {
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  dateMetaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.65)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  monthLargeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  weekStripContainer: {
    minHeight: 60,
    marginTop: 4,
  },
});
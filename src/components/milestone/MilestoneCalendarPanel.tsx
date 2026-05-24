import { colors } from "@/constants/theme";
import type { Milestone } from "@/types/milestone";
import {
  milestoneMarkedDates,
  milestonesToTimelineEvents,
} from "@/utils/milestoneEvents";
import { toIsoDate } from "@/utils/date";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CalendarProvider,
  Timeline,
  WeekCalendar,
} from "react-native-calendars";

type Props = {
  milestones: Milestone[];
};

const TIMELINE_THEME = {
  event: {
    opacity: 0.95,
    borderRadius: 8,
    paddingLeft: 8,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#5A4B50",
  },
  eventSummary: {
    fontSize: 12,
    color: colors.neutral,
  },
  timeLabel: {
    fontSize: 12,
    color: "rgba(90, 75, 80, 0.55)",
  },
  line: {
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
};

export function MilestoneCalendarPanel({ milestones }: Props) {
  const today = toIsoDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const events = useMemo(
    () => milestonesToTimelineEvents(milestones),
    [milestones],
  );

  const markedDates = useMemo(() => {
    const marks = milestoneMarkedDates(milestones);
    const existing = marks[selectedDate];
    marks[selectedDate] = {
      ...existing,
      marked: existing?.marked ?? false,
      selected: true,
      selectedColor: "#2DD4BF",
      dotColor: existing?.dotColor ?? "#f59e0b",
    };
    return marks;
  }, [milestones, selectedDate]);

  const dayEvents = useMemo(
    () => events.filter((event) => event.start.startsWith(selectedDate)),
    [events, selectedDate],
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Love calendar</Text>
      <Text style={styles.subheading}>Pick a day to see your moments</Text>

      <CalendarProvider
        date={selectedDate}
        onDateChanged={setSelectedDate}
        style={styles.provider}
      >
        <View style={styles.weekStrip}>
          <WeekCalendar
            firstDay={1}
            markedDates={markedDates}
            allowShadow={false}
            theme={{
              backgroundColor: "transparent",
              calendarBackground: "transparent",
              textSectionTitleColor: colors.neutral,
              selectedDayBackgroundColor: "#2DD4BF",
              selectedDayTextColor: "#fff",
              todayTextColor: "#E91E63",
              dayTextColor: "#5A4B50",
              textDisabledColor: "rgba(90, 75, 80, 0.35)",
              dotColor: colors.tertiary,
              selectedDotColor: "#E91E63",
            }}
          />
        </View>

        <View style={styles.timelineShell}>
          <LinearGradient
            colors={["#F4F9E8", "#E3F2D8", "#D4EBCB"]}
            style={StyleSheet.absoluteFill}
          />
          <Timeline
            date={selectedDate}
            events={dayEvents}
            start={6}
            end={22}
            scrollToFirst
            showNowIndicator
            theme={TIMELINE_THEME}
            renderEvent={(event) => (
              <View
                style={[
                  styles.eventCard,
                  { backgroundColor: event.color ?? MILESTONE_EVENT_COLOR },
                ]}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                {event.summary ? (
                  <Text style={styles.eventSummary}>{event.summary}</Text>
                ) : null}
              </View>
            )}
          />
        </View>
      </CalendarProvider>
    </View>
  );
}

const MILESTONE_EVENT_COLOR = "rgba(252, 231, 243, 0.95)";

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#5A4B50",
  },
  subheading: {
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 4,
  },
  provider: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
  },
  weekStrip: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingBottom: 4,
  },
  timelineShell: {
    height: 320,
    overflow: "hidden",
  },
  eventCard: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(233, 30, 99, 0.15)",
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5A4B50",
  },
  eventSummary: {
    fontSize: 12,
    color: colors.neutral,
    marginTop: 4,
  },
});

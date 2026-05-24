import type { Milestone } from "@/types/milestone";
import type { TimelineEventProps } from "react-native-calendars";

const MILESTONE_EVENT_COLOR = "rgba(252, 231, 243, 0.95)";

export function milestonesToTimelineEvents(
  milestones: Milestone[],
): TimelineEventProps[] {
  return milestones.map((milestone, index) => ({
    id: milestone.id,
    start: `${milestone.date} ${String(9 + (index % 6)).padStart(2, "0")}:00:00`,
    end: `${milestone.date} ${String(10 + (index % 6)).padStart(2, "0")}:00:00`,
    title: `${milestone.emoji} ${milestone.title}`,
    summary: milestone.note,
    color: MILESTONE_EVENT_COLOR,
  }));
}

export function milestoneMarkedDates(milestones: Milestone[]) {
  const marked: Record<
    string,
    {
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
      selectedDotColor?: string;
    }
  > = {};

  for (const milestone of milestones) {
    marked[milestone.date] = {
      marked: true,
      dotColor: "#f59e0b",
      selectedDotColor: "#E91E63",
    };
  }

  return marked;
}

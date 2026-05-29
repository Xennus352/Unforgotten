import { evaluateAndScheduleDailyNotification } from "@/utils/notifications/scheduler";
import { useEffect, useRef } from "react";

interface Props {
  initialized: boolean;
  selectedDates: any;
  predictedDates: any;
  cycleLength: number;
  periodLength: number;
  anniversaryDate?: string;
}

export function useNotificationScheduler({
  initialized,
  selectedDates,
  predictedDates,
  cycleLength,
  periodLength,
  anniversaryDate,
}: Props) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initialized || initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    evaluateAndScheduleDailyNotification({
      selectedDates,
      predictedDates,
      cycleLength,
      periodLength,
      anniversaryDate,
    });
    // Intentionally only depends on initialized - we only want to schedule once
    // upon first mount when data is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);
}

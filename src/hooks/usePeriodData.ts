/**
 * Period data hook with optimized state management
 * Separates prediction logic from UI concerns
 */

import { storage, STORAGE_KEYS } from "@/lib/db/storage";
import { generatePredictions } from "@/utils/predictions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateKey } from "@/types/period";

export function usePeriodData() {
  const [selectedDates, setSelectedDates] = useState<DateKey[]>([]);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const {
        selectedDates,
        cycleLength,
        periodLength,
        isNewUser,
      } = await storage.getPeriodData();

      setSelectedDates(selectedDates);
      setCycleLength(cycleLength);
      setPeriodLength(periodLength);
      setIsNewUser(isNewUser);
      setInitialized(true);
    };

    loadInitialData();
  }, []);

  const toggleDate = useCallback(async (dateKey: DateKey) => {
    setSelectedDates((prev) => {
      const updated = prev.includes(dateKey)
        ? prev.filter((d) => d !== dateKey)
        : [...prev, dateKey].sort();

      storage.setString(STORAGE_KEYS.SELECTED_DATES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveSettings = useCallback((cycle: number, period: number) => {
    const safeCycle = Math.max(21, Math.min(45, cycle));
    const safePeriod = Math.max(2, Math.min(14, period));

    setCycleLength(safeCycle);
    setPeriodLength(safePeriod);
    storage.setNumber(STORAGE_KEYS.CYCLE_LENGTH, safeCycle);
    storage.setNumber(STORAGE_KEYS.PERIOD_LENGTH, safePeriod);
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsNewUser(false);
    storage.setString(STORAGE_KEYS.IS_NEW_USER, JSON.stringify(false));
  }, []);

  // Memoized predictions - only recalculate when inputs change
  const predictedDates = useMemo(() => {
    if (!initialized) return [];
    return generatePredictions(selectedDates, cycleLength, periodLength, 3);
  }, [selectedDates, cycleLength, periodLength, initialized]);

  return {
    selectedDates,
    cycleLength,
    periodLength,
    isNewUser,
    toggleDate,
    saveSettings,
    completeOnboarding,
    initialized,
    predictedDates,
  };
}
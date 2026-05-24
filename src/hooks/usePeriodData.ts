import { storage, STORAGE_KEYS } from "@/lib/db/storage";
import { useCallback, useEffect, useState } from "react";

export function usePeriodData() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const [storedDates, storedCycle, storedPeriod, storedNewUser] =
        await Promise.all([
          storage.getString(STORAGE_KEYS.SELECTED_DATES),
          storage.getNumber(STORAGE_KEYS.CYCLE_LENGTH),
          storage.getNumber(STORAGE_KEYS.PERIOD_LENGTH),
          storage.getString(STORAGE_KEYS.IS_NEW_USER),
        ]);

      if (storedDates) setSelectedDates(JSON.parse(storedDates));
      if (storedCycle) setCycleLength(storedCycle);
      if (storedPeriod) setPeriodLength(storedPeriod);
      setIsNewUser(storedNewUser === null ? true : JSON.parse(storedNewUser));
      setInitialized(true);
    };
    loadInitialData();
  }, []);

  const toggleDate = useCallback(async (dateKey: string) => {
    setSelectedDates((prev) => {
      const updated = prev.includes(dateKey)
        ? prev.filter((d) => d !== dateKey)
        : [...prev, dateKey];
      storage.setString(STORAGE_KEYS.SELECTED_DATES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const saveSettings = useCallback((cycle: number, period: number) => {
    setCycleLength(cycle);
    setPeriodLength(period);
    storage.setNumber(STORAGE_KEYS.CYCLE_LENGTH, cycle);
    storage.setNumber(STORAGE_KEYS.PERIOD_LENGTH, period);
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsNewUser(false);
    storage.setString(STORAGE_KEYS.IS_NEW_USER, JSON.stringify(false));
  }, []);

  return {
    selectedDates,
    cycleLength,
    periodLength,
    isNewUser,
    toggleDate,
    saveSettings,
    completeOnboarding,
    initialized,
  };
}

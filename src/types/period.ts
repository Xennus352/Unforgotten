/**
 * Period tracking type definitions
 * Centralized types for maintainability and consistent interfaces
 */

export type DateKey = `${number}-${string}-${string}`;

export interface CycleGroup {
  startDate: DateKey;
  endDate: DateKey;
  dates: DateKey[];
}

export interface PeriodSettings {
  cycleLength: number;
  periodLength: number;
}

export interface PeriodStorage {
  selectedDates: DateKey[];
  cycleLength: number;
  periodLength: number;
  isNewUser: boolean;
}

export interface CalendarDay {
  dateKey: DateKey | `placeholder-${string}`;
  day: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isPredicted: boolean;
  isWeekend: boolean;
}
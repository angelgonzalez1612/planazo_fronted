import type { EventItem } from "@/data/types";

// CDMX has used a fixed UTC-6 offset year-round since Mexico abolished DST
// in most of the country in 2022 — matches the offset already used in events.json.
const CDMX_OFFSET = "-06:00";

function isLastSundayOfMonth(date: Date): boolean {
  if (date.getDay() !== 0) return false;
  const nextWeek = new Date(date);
  nextWeek.setDate(date.getDate() + 7);
  return nextWeek.getMonth() !== date.getMonth();
}

interface DayTime {
  hour: number;
  minute: number;
}

function parseTime(text: string): DayTime | null {
  const match = text.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

// `dateLabel` is the human-authored source of truth (e.g. "Sábado · 10:00–19:00"
// or "Viernes · 20:30") — parsed rather than duplicated into a separate field.
function parseTimeRange(dateLabel: string): { start: DayTime | null; end: DayTime | null } {
  const rangeMatch = dateLabel.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
  if (rangeMatch) {
    return { start: parseTime(rangeMatch[1]), end: parseTime(rangeMatch[2]) };
  }
  return { start: parseTime(dateLabel), end: null };
}

function toIso(date: Date, time: DayTime): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(time.hour).padStart(2, "0");
  const mm = String(time.minute).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:00${CDMX_OFFSET}`;
}

/**
 * Recurring events (weekly markets, danzón nights, lucha libre) go stale fast if
 * `startDate` is a hardcoded date — Google ends up crawling a "scheduled" event
 * that already happened. This computes the next real occurrence at request time
 * from `recurringDays` (or the Ciclotón's "last Sunday" rule) plus the time-of-day
 * already published in `dateLabel`, so the JSON-LD always points forward.
 */
export function nextEventOccurrence(
  event: EventItem,
  now: Date,
): { startDate: string; endDate?: string } {
  const { start, end } = parseTimeRange(event.dateLabel);
  const startTime = start ?? { hour: 0, minute: 0 };
  const isCicloton = event.slug === "cicloton-cdmx";
  const recurringDays = event.recurringDays ?? [];

  if (!isCicloton && recurringDays.length === 0) {
    return { startDate: event.startDate };
  }

  const candidate = new Date(now);
  candidate.setHours(startTime.hour, startTime.minute, 0, 0);

  for (let i = 0; i < 60; i++) {
    const matchesDay = isCicloton
      ? isLastSundayOfMonth(candidate)
      : recurringDays.includes(candidate.getDay());
    if (matchesDay && candidate.getTime() >= now.getTime()) {
      return {
        startDate: toIso(candidate, startTime),
        endDate: end ? toIso(candidate, end) : undefined,
      };
    }
    candidate.setDate(candidate.getDate() + 1);
    candidate.setHours(startTime.hour, startTime.minute, 0, 0);
  }

  return { startDate: event.startDate };
}

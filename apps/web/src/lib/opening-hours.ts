import type { OpeningHour } from "@/data/types";

// Monday-first order, used only to expand "X a Y" ranges (e.g. "martes a
// jueves" walks forward through this array, wrapping past domingo if needed).
const WEEK_MON_FIRST = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const DAY_SCHEMA: Record<string, string> = {
  lunes: "https://schema.org/Monday",
  martes: "https://schema.org/Tuesday",
  miércoles: "https://schema.org/Wednesday",
  jueves: "https://schema.org/Thursday",
  viernes: "https://schema.org/Friday",
  sábado: "https://schema.org/Saturday",
  domingo: "https://schema.org/Sunday",
};

function normalizeDay(token: string): string | null {
  let t = token.trim().toLowerCase();
  if (t === "sábados") t = "sábado"; // the only day name in the data that appears pluralized
  return t in DAY_SCHEMA ? t : null;
}

function expandRange(fromRaw: string, toRaw: string): string[] {
  const from = normalizeDay(fromRaw);
  const to = normalizeDay(toRaw);
  if (!from || !to) return [];
  const start = WEEK_MON_FIRST.indexOf(from);
  const end = WEEK_MON_FIRST.indexOf(to);
  const days: string[] = [];
  for (let i = start; ; i = (i + 1) % 7) {
    days.push(WEEK_MON_FIRST[i]);
    if (i === end) break;
  }
  return days;
}

/**
 * `day` is free-text Spanish written for humans (e.g. "Martes a sábado",
 * "Desayuno: miércoles a domingo", "Viernes y sábado", "Martes a jueves y
 * domingo") — parsed here into schema.org dayOfWeek values rather than
 * duplicated into a second structured field.
 */
function parseDayLabel(rawLabel: string): string[] {
  // Strip a leading meal-type label ("Desayuno: ", "Comida y cena: ") —
  // the day range after the colon is what actually matters for scheduling.
  const label = rawLabel.includes(":") ? rawLabel.split(":").slice(1).join(":").trim() : rawLabel.trim();
  const lower = label.toLowerCase();

  if (lower.includes("todos los días")) {
    return [...WEEK_MON_FIRST];
  }

  const rangeAndExtra = lower.match(/^([a-záéíóúñ]+)\s+a\s+([a-záéíóúñ]+)\s+y\s+([a-záéíóúñ]+)$/);
  if (rangeAndExtra) {
    const [, from, to, extra] = rangeAndExtra;
    const extraDay = normalizeDay(extra);
    return [...expandRange(from, to), ...(extraDay ? [extraDay] : [])];
  }

  const range = lower.match(/^([a-záéíóúñ]+)\s+a\s+([a-záéíóúñ]+)$/);
  if (range) {
    return expandRange(range[1], range[2]);
  }

  const twoDays = lower.match(/^([a-záéíóúñ]+)\s+y\s+([a-záéíóúñ]+)$/);
  if (twoDays) {
    return [normalizeDay(twoDays[1]), normalizeDay(twoDays[2])].filter((d): d is string => d !== null);
  }

  const single = normalizeDay(lower);
  return single ? [single] : [];
}

export function buildOpeningHoursSpecification(openingHours?: OpeningHour[]) {
  if (!openingHours || openingHours.length === 0) return undefined;

  const specs = openingHours
    .filter((h) => !h.closed)
    .flatMap((h) => {
      const dayOfWeek = parseDayLabel(h.day)
        .map((d) => DAY_SCHEMA[d])
        .filter((d): d is string => Boolean(d));
      if (dayOfWeek.length === 0) return [];
      return [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek,
          opens: h.opens,
          closes: h.closes,
        },
      ];
    });

  return specs.length > 0 ? specs : undefined;
}

// Trick: round-tripping through a Mexico City-formatted string makes the
// Date's local getters (getDay, getDate, getHours...) read Mexico City wall
// time regardless of the server's actual system timezone.
export function mexicoCityNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }),
  );
}

export const DAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function formatMexicoDay(date: Date): string {
  const day = DAY_NAMES[date.getDay()];
  const month = date.toLocaleDateString("es-MX", {
    month: "long",
    timeZone: "America/Mexico_City",
  });
  return `${day} ${date.getDate()} de ${month}`;
}

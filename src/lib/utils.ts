import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeWords(value: string): string {
  return String(value || "").replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

export function formatDateDMY(value: unknown): string {
  if (value === null || value === undefined) return "-";

  const text = String(value).trim();
  if (!text) return "-";

  // Preserve calendar date correctly for ISO date-only values.
  const isoDateOnlyMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateOnlyMatch) {
    const [, year, month, day] = isoDateOnlyMatch;
    return `${day}/${month}/${year}`;
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    const dmyMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, "0");
      const month = dmyMatch[2].padStart(2, "0");
      const year = dmyMatch[3];
      return `${day}/${month}/${year}`;
    }
    return text;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

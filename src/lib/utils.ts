import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeWords(value: string): string {
  return String(value || "").replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

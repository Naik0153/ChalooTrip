import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CrowdLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCrowdColor(level: CrowdLevel): string {
  switch (level) {
    case 'Low':
      return '#10b981'; // emerald-500
    case 'Moderate':
      return '#f59e0b'; // amber-500
    case 'Busy':
      return '#f97316'; // orange-500
    case 'Surge':
      return '#ef4444'; // red-500
  }
}

export function getCrowdBadgeClass(level: CrowdLevel): string {
  switch (level) {
    case 'Low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'Moderate':
      return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    case 'Busy':
      return 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800';
    case 'Surge':
      return 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800 animate-pulse';
  }
}

export function formatWaitTime(minutes: number): string {
  if (minutes <= 5) return 'Minimal wait (<5 mins)';
  if (minutes < 60) return `~${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `~${hours}h ${remaining}m` : `~${hours} hours`;
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function generateBookingRef(prefix: string = 'YT'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = prefix + '-';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

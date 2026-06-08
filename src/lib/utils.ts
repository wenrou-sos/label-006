import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWaitTime(totalMinutes: number): string {
  if (totalMinutes <= 0) return "即将叫号";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `约 ${minutes} 分钟`;
  if (minutes === 0) return `约 ${hours} 小时`;
  return `约 ${hours} 小时 ${minutes} 分钟`;
}

export function estimateWaitTime(
  waitingCount: number,
  avgServiceMinutes: number,
  servingWindows: number = 2
): number {
  if (waitingCount <= 0) return 0;
  const effectiveWindows = Math.max(1, servingWindows);
  return Math.ceil((waitingCount * avgServiceMinutes) / effectiveWindows);
}

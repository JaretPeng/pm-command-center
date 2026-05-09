import type { ProjectHealth } from "@/types/domain";
import { cn } from "@/lib/utils";

export function healthLabel(h: ProjectHealth) {
  const map: Record<ProjectHealth, string> = {
    excellent: "优秀",
    good: "良好",
    warning: "预警",
    critical: "危急",
  };
  return map[h];
}

export function healthBadgeClass(h: ProjectHealth) {
  return cn(
    "border-transparent",
    h === "excellent" &&
      "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
    h === "good" && "bg-sky-500/15 text-sky-900 dark:text-sky-100",
    h === "warning" &&
      "bg-amber-500/15 text-amber-900 dark:text-amber-100",
    h === "critical" && "bg-red-500/15 text-red-900 dark:text-red-100",
  );
}

export function riskSeverityClass(s: string) {
  return cn(
    s === "low" && "text-emerald-600 dark:text-emerald-400",
    s === "medium" && "text-amber-600 dark:text-amber-400",
    (s === "high" || s === "critical") &&
      "text-red-600 dark:text-red-400",
  );
}

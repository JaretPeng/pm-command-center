"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SCHEDULE_LINKS = [
  {
    year: "2026年",
    href: "https://shimo.zhenguanyu.com/sheets/AlOr0eYp8mbJFNr8/pM2Hz/",
  },
  {
    year: "2025年",
    href: "https://shimo.zhenguanyu.com/sheets/qnvK1x6BGdNGcz9O/pr1Ge/",
  },
] as const;

/** A 线项目总览 · Operation Scheme：排课预排表（石墨），默认折叠链接 */
export function AlineSchedulePlanningBlock() {
  const [open, setOpen] = useState(false);
  const uid = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
    >
      <Card className="glass-card overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-border/80 bg-background px-3 py-3 sm:gap-2.5 sm:px-5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${uid}-schedule-panel`}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/50 text-foreground shadow-sm",
              "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
              aria-hidden
            />
            <span className="sr-only">{open ? "折叠排课链接" : "展开排课链接"}</span>
          </button>
          <h3
            id={`${uid}-schedule-heading`}
            className="min-w-0 text-sm font-semibold text-foreground sm:text-base"
          >
            A线排课规划
          </h3>
        </div>
        {open ? (
          <div
            id={`${uid}-schedule-panel`}
            role="region"
            aria-labelledby={`${uid}-schedule-heading`}
            className="px-4 py-4 sm:px-5"
          >
            <ul className="space-y-4">
              {SCHEDULE_LINKS.map((item) => (
                <li key={item.href} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{item.year}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all font-mono text-[13px] font-medium leading-relaxed text-primary underline-offset-2 hover:underline sm:text-sm"
                  >
                    {item.href}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}

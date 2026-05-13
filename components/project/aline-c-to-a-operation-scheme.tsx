"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CtoAOperationFlowDiagram } from "@/components/project/c-to-a-operation-flow-diagram";
import { cn } from "@/lib/utils";

/** A 线项目总览 · Operation Scheme：C 线转 A 线路径（矢量图，任意缩放清晰） */
export function AlineCtoAOperationSchemeBlock() {
  const [pathOpen, setPathOpen] = useState(false);
  const panelId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
    >
      <Card className="glass-card overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-border/80 bg-background px-3 py-3 sm:gap-2.5 sm:px-5">
          <button
            type="button"
            id={`${panelId}-toggle`}
            aria-expanded={pathOpen}
            aria-controls={`${panelId}-panel`}
            onClick={() => setPathOpen((o) => !o)}
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/50 text-foreground shadow-sm",
              "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", pathOpen && "rotate-180")}
              aria-hidden
            />
            <span className="sr-only">{pathOpen ? "折叠路径图" : "展开路径图"}</span>
          </button>
          <h3
            id={`${panelId}-heading`}
            className="min-w-0 text-sm font-semibold text-foreground sm:text-base"
          >
            C线转A线 运营方案
          </h3>
        </div>
        {pathOpen ? (
          <div
            id={`${panelId}-panel`}
            role="region"
            aria-labelledby={`${panelId}-heading`}
            className="p-3 sm:p-4"
          >
            <div className="overflow-x-auto rounded-lg border border-border/60 bg-white/90 p-2 dark:bg-slate-950/40">
              <div className="min-w-[960px]">
                <CtoAOperationFlowDiagram />
              </div>
            </div>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}

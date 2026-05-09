"use client";

import { Briefcase, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/hooks/use-view-mode";

export function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-1">
      <Button
        type="button"
        size="sm"
        variant={mode === "executive" ? "default" : "ghost"}
        className={cn("gap-1.5", mode === "executive" && "shadow-sm")}
        onClick={() => onChange("executive")}
      >
        <Briefcase className="h-3.5 w-3.5" />
        Executive
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === "delivery" ? "default" : "ghost"}
        className={cn("gap-1.5", mode === "delivery" && "shadow-sm")}
        onClick={() => onChange("delivery")}
      >
        <Truck className="h-3.5 w-3.5" />
        Delivery
      </Button>
    </div>
  );
}

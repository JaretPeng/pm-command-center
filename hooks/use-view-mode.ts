"use client";

import { useCallback, useEffect, useState } from "react";

export type ViewMode = "executive" | "delivery";

const KEY = "pmcc_view_mode";

export function useViewMode() {
  const [mode, setModeState] = useState<ViewMode>("executive");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem(KEY) as ViewMode | null;
    if (s === "executive" || s === "delivery") setModeState(s);
    setReady(true);
  }, []);

  const setMode = useCallback((m: ViewMode) => {
    setModeState(m);
    localStorage.setItem(KEY, m);
  }, []);

  return { mode, setMode, ready };
}

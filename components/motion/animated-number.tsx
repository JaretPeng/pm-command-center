"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (reduced) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }
    const start = fromRef.current;
    const c = animate(start, value, {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.5,
      onUpdate: (v) => {
        fromRef.current = v;
        setDisplay(v);
      },
      onComplete: () => {
        fromRef.current = value;
        setDisplay(value);
      },
    });
    return () => c.stop();
  }, [value, reduced]);

  const n = Math.round(display);
  return <span>{format ? format(n) : n}</span>;
}

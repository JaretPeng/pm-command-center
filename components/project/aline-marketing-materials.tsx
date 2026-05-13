"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const IMAGE_ITEMS = [
  "学习收获图",
  "毕业证书示意图",
  "硬件介绍图",
  "学习手册介绍图",
  "续报福利宣传图",
] as const;

const VIDEO_ITEMS = [
  "课程介绍视频",
  "硬件项目展示视频",
  "硬件课前准备视频",
  "课后巩固练习视频",
  "随材开箱视频",
  "产品演绎视频",
] as const;

const MATERIAL_SHEET_HREF =
  "https://shimo.zhenguanyu.com/sheets/AroGpYy6DEEJIN1Z/HAerz/";

function Lane({
  title,
  items,
  laneClass,
  titleClass,
}: {
  title: string;
  items: readonly string[];
  laneClass: string;
  titleClass: string;
}) {
  return (
    <div
      className={`flex min-h-[4.5rem] flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-stretch sm:gap-0 sm:p-0 ${laneClass}`}
    >
      <div
        className={`flex shrink-0 items-center justify-center border-b px-3 py-2 sm:w-[7.5rem] sm:border-b-0 sm:border-r sm:py-4 ${titleClass}`}
      >
        <span className="text-center text-sm font-bold tracking-wide">{title}</span>
      </div>
      <div className="flex flex-1 flex-wrap content-center gap-2 p-3 sm:p-4">
        {items.map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-md border border-border/80 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A 线项目总览 · Operation Scheme：营销物料（双泳道 + 石墨地址），默认折叠 */
export function AlineMarketingMaterialsBlock() {
  const [open, setOpen] = useState(false);
  const uid = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
    >
      <Card className="glass-card overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-border/80 bg-background px-3 py-3 sm:gap-2.5 sm:px-5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${uid}-marketing-panel`}
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
            <span className="sr-only">{open ? "折叠营销物料" : "展开营销物料"}</span>
          </button>
          <h3
            id={`${uid}-marketing-heading`}
            className="min-w-0 text-sm font-semibold text-foreground sm:text-base"
          >
            营销物料
          </h3>
        </div>
        {open ? (
          <div
            id={`${uid}-marketing-panel`}
            role="region"
            aria-labelledby={`${uid}-marketing-heading`}
            className="space-y-0"
          >
            <div className="space-y-3 p-4 sm:p-5">
              <Lane
                title="图片物料"
                items={IMAGE_ITEMS}
                laneClass="border-violet-200/80 bg-violet-50/60 dark:border-violet-900/50 dark:bg-violet-950/30"
                titleClass="border-violet-200/80 bg-violet-100/90 text-violet-950 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-100"
              />
              <Lane
                title="视频物料"
                items={VIDEO_ITEMS}
                laneClass="border-sky-200/80 bg-sky-50/60 dark:border-sky-900/50 dark:bg-sky-950/30"
                titleClass="border-sky-200/80 bg-sky-100/90 text-sky-950 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-100"
              />
            </div>
            <div className="border-t border-border/80 bg-muted/20 px-4 py-3 sm:px-5">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-foreground">物料获取地址：</span>
                <a
                  href={MATERIAL_SHEET_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-mono text-[13px] font-semibold text-primary underline-offset-2 hover:underline sm:text-sm"
                >
                  {MATERIAL_SHEET_HREF}
                </a>
              </p>
            </div>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}

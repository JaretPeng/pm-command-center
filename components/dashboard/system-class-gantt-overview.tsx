"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

/** 与石墨「2025-2026年系统班项目甘特图总览」对齐的刻度范围（用于百分比定位） */
const RANGE_START = new Date("2025-01-01T00:00:00");
const RANGE_END = new Date("2027-02-01T00:00:00");

type BarTone = "blue" | "green" | "purple" | "orange" | "pink";

const toneClass: Record<BarTone, string> = {
  blue: "bg-sky-500/75 text-sky-950 shadow-sm dark:bg-sky-400/55 dark:text-sky-50",
  green:
    "bg-emerald-500/75 text-emerald-950 shadow-sm dark:bg-emerald-400/55 dark:text-emerald-50",
  purple:
    "bg-violet-500/75 text-violet-50 shadow-sm dark:bg-violet-400/60 dark:text-violet-950",
  orange:
    "bg-orange-500/75 text-orange-950 shadow-sm dark:bg-orange-400/60 dark:text-orange-950",
  pink: "bg-pink-500/75 text-pink-950 shadow-sm dark:bg-pink-400/55 dark:text-pink-50",
};

function barPercent(startIso: string, endIso: string): { left: number; width: number } {
  const r0 = RANGE_START.getTime();
  const r1 = RANGE_END.getTime();
  const span = r1 - r0;
  const t0 = new Date(startIso).getTime();
  const t1 = new Date(endIso).getTime();
  const left = Math.max(0, ((t0 - r0) / span) * 100);
  const right = Math.min(100, ((t1 - r0) / span) * 100);
  return { left, width: Math.max(right - left, 0.35) };
}

type BarSeg = { start: string; end: string; tone: BarTone; label: string };

type GanttRow = {
  name: string;
  bars: BarSeg[];
};

/** 依据石墨甘特截图整理的 24 行；日期为示意对齐，以内部排期为准时可替换 */
const ROWS: GanttRow[] = [
  {
    name: "C2-v6.0迭代",
    bars: [
      {
        start: "2025-02-05",
        end: "2025-10-29",
        tone: "blue",
        label: "直播课/硬件赛手 02.05–10.29",
      },
    ],
  },
  {
    name: "A+ 2.0迭代",
    bars: [
      {
        start: "2025-05-22",
        end: "2025-11-05",
        tone: "blue",
        label: "直播课/手册 05.22–11.05",
      },
    ],
  },
  {
    name: "C3-v6.0迭代",
    bars: [
      {
        start: "2025-06-23",
        end: "2025-11-20",
        tone: "blue",
        label: "直播课/手册/随材 06.23–11.20",
      },
    ],
  },
  {
    name: "C1-v7.0 AI课迭代",
    bars: [
      {
        start: "2025-05-08",
        end: "2026-10-31",
        tone: "blue",
        label:
          "AI录播课至 2026.10；原计划 9 月底受排期影响延期（以产研为准）",
      },
    ],
  },
  {
    name: "C7-v5.0手册迭代",
    bars: [
      {
        start: "2025-04-10",
        end: "2025-09-20",
        tone: "blue",
        label: "手册 04.10–09.20",
      },
    ],
  },
  {
    name: "C5-v5.0手册迭代",
    bars: [
      {
        start: "2025-06-03",
        end: "2025-11-03",
        tone: "blue",
        label: "手册 06.03–11.03",
      },
    ],
  },
  {
    name: "C1启航手册迭代",
    bars: [
      {
        start: "2025-07-01",
        end: "2025-12-13",
        tone: "blue",
        label: "手册、赛考手册 07.01–12.13",
      },
    ],
  },
  {
    name: "C1 Debug小课",
    bars: [
      {
        start: "2025-05-07",
        end: "2025-10-26",
        tone: "blue",
        label: "Debug 小课+大赛 05.07–10.26",
      },
    ],
  },
  {
    name: "C线毕业证书迭代",
    bars: [
      {
        start: "2025-02-01",
        end: "2025-08-31",
        tone: "blue",
        label: "寄语视频拍摄，上线时间待确认",
      },
    ],
  },
  {
    name: "C4-v6.0",
    bars: [
      {
        start: "2025-11-01",
        end: "2026-06-30",
        tone: "green",
        label: "C4 95 期等；12 月启动交付→6 月",
      },
    ],
  },
  {
    name: "C5-v6.0",
    bars: [
      {
        start: "2026-01-01",
        end: "2026-10-31",
        tone: "green",
        label: "C5 81 期等；4 月立项",
      },
    ],
  },
  {
    name: "C6-v6.0",
    bars: [
      {
        start: "2026-07-01",
        end: "2027-01-31",
        tone: "green",
        label: "承接 C5 81 期后段；约 27 年 3 月底开课",
      },
    ],
  },
  {
    name: "其他-赠课制作",
    bars: [
      {
        start: "2025-03-01",
        end: "2025-06-30",
        tone: "green",
        label: "【C0 类 C1 8 课时】1–5 月交付",
      },
      {
        start: "2026-01-01",
        end: "2026-09-30",
        tone: "green",
        label: "【C1 类 C2 10 课时】4–9 月交付",
      },
    ],
  },
  {
    name: "制作硬件模拟器",
    bars: [
      {
        start: "2025-02-01",
        end: "2025-12-31",
        tone: "purple",
        label: "交付中（教学内部方案制定）",
      },
    ],
  },
  {
    name: "AI编程助手",
    bars: [
      {
        start: "2025-02-01",
        end: "2025-12-31",
        tone: "purple",
        label: "待重启",
      },
    ],
  },
  {
    name: "搭建用户激励体系",
    bars: [
      {
        start: "2025-02-01",
        end: "2025-12-31",
        tone: "purple",
        label: "1 期已交付 / 2 期方案盘点",
      },
    ],
  },
  {
    name: "A1（YBC硬件）迭代",
    bars: [
      {
        start: "2025-02-01",
        end: "2025-08-31",
        tone: "orange",
        label: "售卖/上线期次与交付 1–5 月",
      },
    ],
  },
  {
    name: "A2 2.0手册制作",
    bars: [
      {
        start: "2025-03-01",
        end: "2026-03-31",
        tone: "orange",
        label: "两次待定；3 月启动→次年 3 月",
      },
    ],
  },
  {
    name: "A4课程制作",
    bars: [
      {
        start: "2025-03-01",
        end: "2025-08-31",
        tone: "orange",
        label: "A4 1 期 6 月开课；3–8 月交付",
      },
    ],
  },
  {
    name: "A5课程制作",
    bars: [
      {
        start: "2025-10-01",
        end: "2026-07-31",
        tone: "orange",
        label: "A5 1 期 10 月开课；4–10 月交付",
      },
    ],
  },
  {
    name: "A7课程制作",
    bars: [
      {
        start: "2025-11-01",
        end: "2026-10-31",
        tone: "orange",
        label: "A7 1 期 11 月开课；5 月起交付",
      },
    ],
  },
  {
    name: "A8课程制作",
    bars: [
      {
        start: "2025-11-01",
        end: "2026-12-31",
        tone: "orange",
        label: "A8 1 期 11 月开课；4–12 月交付",
      },
    ],
  },
  {
    name: "A6课程制作",
    bars: [
      {
        start: "2026-08-01",
        end: "2027-01-31",
        tone: "orange",
        label: "A6 1 期 3 月开课；10 月起交付",
      },
    ],
  },
  {
    name: "OJ平台",
    bars: [
      {
        start: "2025-07-01",
        end: "2025-12-31",
        tone: "pink",
        label: "二期功能交付；约 4 月中旬节点（以实际为准）",
      },
    ],
  },
];

/** 时间轴上某日左边缘在总宽度上的百分比（与条形图一致） */
function timelinePct(iso: string): number {
  return barPercent(iso, iso).left;
}

/** 两行轴：上行年份跨月；下行仅月份数字，避免 YYYY.MM 挤在一行 */
function MonthAxis() {
  const yearBands: { year: number; left: number; width: number }[] = [
    {
      year: 2025,
      left: timelinePct("2025-01-01"),
      width: timelinePct("2026-01-01") - timelinePct("2025-01-01"),
    },
    {
      year: 2026,
      left: timelinePct("2026-01-01"),
      width: timelinePct("2027-01-01") - timelinePct("2026-01-01"),
    },
    {
      year: 2027,
      left: timelinePct("2027-01-01"),
      width: Math.max(0, timelinePct("2027-02-01") - timelinePct("2027-01-01")),
    },
  ].filter((b) => b.width > 0.05);

  const monthCells: { key: string; left: number; width: number; label: string }[] = [];
  const pushMonthRange = (y: number, mStart: number, mEnd: number) => {
    for (let m = mStart; m <= mEnd; m++) {
      const start = `${y}-${String(m).padStart(2, "0")}-01`;
      const nextM = m === 12 ? 1 : m + 1;
      const nextY = m === 12 ? y + 1 : y;
      const end = `${nextY}-${String(nextM).padStart(2, "0")}-01`;
      const left = timelinePct(start);
      const right = Math.min(100, timelinePct(end));
      if (right - left > 0.02) {
        monthCells.push({
          key: `${y}-${m}`,
          left,
          width: right - left,
          label: String(m).padStart(2, "0"),
        });
      }
    }
  };
  pushMonthRange(2025, 1, 12);
  pushMonthRange(2026, 1, 12);
  pushMonthRange(2027, 1, 1);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-md border border-border/50">
      <div className="relative h-5 border-b border-border/50 bg-muted/25">
        {yearBands.map((b) => (
          <div
            key={b.year}
            className="absolute top-0 flex h-full items-center justify-center border-r border-border/40 text-[11px] font-semibold tabular-nums text-muted-foreground sm:text-xs"
            style={{ left: `${b.left}%`, width: `${b.width}%` }}
          >
            {b.year}
          </div>
        ))}
      </div>
      <div className="relative h-5 bg-muted/10">
        {monthCells.map((cell) => (
          <div
            key={cell.key}
            className="absolute top-0 flex h-full items-center justify-center border-r border-border/25 text-[9px] font-medium tabular-nums text-muted-foreground sm:text-[10px]"
            style={{ left: `${cell.left}%`, width: `${cell.width}%` }}
          >
            {cell.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SystemClassGanttOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 }}
    >
      <Card className="glass-card overflow-hidden p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">2025-2026 年系统班项目甘特图总览</h3>
            <p className="text-xs text-muted-foreground">
              矢量示意 · 与石墨总览对齐；可横向滚动查看。若需替换为高清截图，将 PNG 放入{" "}
              <code className="rounded bg-muted px-1">public/images/</code>{" "}
              并改用图片模式即可。
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground sm:justify-end">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-sky-500/75" /> C 线迭代
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-emerald-500/75" /> 新课/赠课
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-violet-500/75" /> 工具/体系
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-orange-500/75" /> A 线
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-4 rounded-sm bg-pink-500/75" /> OJ
            </span>
          </div>
        </div>

        <ScrollArea className="mt-3 w-full">
          <div className="min-w-[640px] pr-3">
            {/* 与泳道同列网格：时间轴百分比与条形图同属第二列，避免整行宽度错位 */}
            <div className="mb-2 grid grid-cols-[minmax(9rem,11rem)_1fr] items-stretch gap-2 sm:grid-cols-[minmax(11rem,13rem)_1fr]">
              <div className="min-w-0 shrink-0" aria-hidden />
              <MonthAxis />
            </div>
            <div className="space-y-1.5">
              {ROWS.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[minmax(9rem,11rem)_1fr] items-center gap-2 border-b border-border/40 py-1.5 text-[11px] last:border-0 sm:grid-cols-[minmax(11rem,13rem)_1fr] sm:text-xs"
                >
                  <p className="truncate font-medium leading-tight text-foreground/90">
                    {row.name}
                  </p>
                  <div className="relative h-8 min-w-0 rounded-md bg-muted/25">
                    {row.bars.map((b, bi) => {
                      const { left, width } = barPercent(b.start, b.end);
                      return (
                        <div
                          key={bi}
                          title={b.label}
                          className={`absolute top-1 flex h-6 max-w-full items-center overflow-hidden rounded px-1 text-[9px] font-medium leading-tight sm:px-1.5 sm:text-[10px] ${toneClass[b.tone]}`}
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            minWidth: "2.25rem",
                          }}
                        >
                          <span className="line-clamp-2">{b.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

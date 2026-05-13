"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SALES_STRATEGY_HREF =
  "https://shimo.zhenguanyu.com/sheets/3jMXY2pe1enEcOD6/vK744/";

/** A 线项目总览 · Operation Scheme：售卖规则（默认折叠） */
export function AlineSalesRulesBlock() {
  const [open, setOpen] = useState(false);
  const uid = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="glass-card overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-border/80 bg-background px-3 py-3 sm:gap-2.5 sm:px-5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${uid}-sales-rules-panel`}
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
            <span className="sr-only">{open ? "折叠售卖规则" : "展开售卖规则"}</span>
          </button>
          <h3
            id={`${uid}-sales-rules-heading`}
            className="min-w-0 text-sm font-semibold text-foreground sm:text-base"
          >
            售卖规则
          </h3>
        </div>
        {open ? (
          <div
            id={`${uid}-sales-rules-panel`}
            role="region"
            aria-labelledby={`${uid}-sales-rules-heading`}
            className="max-h-[min(78vh,720px)] space-y-6 overflow-y-auto px-4 py-4 sm:px-5"
          >
            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">【售卖策略】</h4>
              <p>
                <a
                  href={SALES_STRATEGY_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  《C++业务线售卖策略》
                </a>
              </p>
              <a
                href={SALES_STRATEGY_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all font-mono text-[13px] font-medium leading-relaxed text-primary underline-offset-2 hover:underline sm:text-sm"
              >
                {SALES_STRATEGY_HREF}
              </a>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">【限购规则】</h4>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>系统限购逻辑：班课 id 不能重复购买。（同 C 线）</li>
                <li>
                  猿编程 app：不支持高级算法【上】、高级算法【下】、A+1、A+2、A+3、X2、X5、X10
                  的续报。
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">【退费规则】</h4>
              <p className="rounded-md border border-border/80 bg-muted/30 px-3 py-2 font-mono text-xs leading-relaxed text-foreground sm:text-[13px]">
                退费金额 = 实付金额 - (实付金额 / 总直播课次 * 已上直播课次) - 随材费用 -
                礼品费用
              </p>
              <p className="text-xs font-medium text-muted-foreground">退费细则：</p>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>
                  系统班 C 线 / A 线 / L 线 / S 线全级别课程，如果用户在「第三次课铃响前」申请退费，则不扣除前两次课的课时费。
                </li>
                <li>
                  随材扣费规则不变，仍取决于用户是否可自费无损寄回，且随材是否不影响二次使用，如无法完成则需扣除随材费用。
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">【调班规则】</h4>
              <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground/90">*临调：</p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>同 C 线现行临调规则。</li>
                  <li>
                    若用户有临时特殊情况，无法学习临近的 1
                    次课，可以向班主任申请临调到下一次直播。
                  </li>
                  <li>
                    比如：原计划周一下午上课，但因事，可以临调到周一晚上。
                  </li>
                </ul>
                <p className="font-medium text-foreground/90">*跨期调课：</p>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>
                    用户若无法按照原计划学习当期课程，可以申请跨期调课到其他期次。
                  </li>
                  <li>
                    比如原计划学期 7 月课程，因 7
                    月用户节奏发生变化，可以申请调整到 8 月学习。
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">【跳级规则】</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                暂无法跳级至 A2 及以上级别。
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">【重修规则】</h4>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>跟 C 线规则一样，A 线没有重修概念。</li>
                <li>
                  除非用户主动且强烈提出「重新学习」等类似需求，班主任劝阻无效的情况下，为避免产生不必要的退课/客诉，可特殊申请重修。
                </li>
                <li>
                  A 线特殊情况申请重修的原则与之前 L 线一致，需要满足以下 2 个条件：
                  <ul className="mt-2 list-[circle] space-y-1 pl-5">
                    <li>当前课程进度超过 3/4；</li>
                    <li>学员超过 50% 的课程未出勤。</li>
                  </ul>
                </li>
                <li>
                  满足条件后，且组长、主管知悉同意，按照 C 线规则操作；如有需要，对接「王薏」老师操作。
                </li>
              </ul>
            </section>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type {
  ProjectDetail,
  RetrospectiveRefundReductionPlan,
} from "@/types/domain";
import { formatDate } from "@/lib/utils";
import { FishboneDiagram } from "@/components/project/fishbone";

function RefundReductionPlanCard({ plan }: { plan: RetrospectiveRefundReductionPlan }) {
  const prefix = (s: string | undefined) => (s?.trim() ? s.trim() : "方案-");
  return (
    <Card className="glass-card p-5 md:p-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {plan.documentTitle}
      </h2>

      <div className="mt-6 rounded-xl border border-border/70 bg-muted/10 p-4 md:p-5">
        <dl className="space-y-4 text-sm leading-relaxed">
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">场景</dt>
            <dd className="mt-1.5 text-foreground/90">{plan.context.scenario}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">冲突</dt>
            <dd className="mt-1.5 text-foreground/90">{plan.context.conflict}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-muted-foreground">问题</dt>
            <dd className="mt-1.5">
              <ul className="list-disc space-y-1.5 pl-5 text-foreground/90">
                {plan.context.problems.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plan.phases.map((ph) => (
          <div
            key={ph.name}
            className="rounded-xl border border-border/80 bg-background/30 p-4 shadow-sm"
          >
            <p className="text-xs font-semibold tracking-wide text-primary/90">
              {prefix(ph.schemePrefix)}
              {ph.name}
            </p>
            <p className="mt-2 text-sm font-medium text-foreground">
              目标：{ph.goal}
            </p>
            <Separator className="my-4" />
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">家长侧</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-foreground/90">
                  {ph.forParents.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">学员侧</p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-foreground/90">
                  {ph.forStudents.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function safeHttpsEmbedUrl(raw: string | undefined): string | null {
  const t = (raw ?? "").trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function RetrospectiveTab({
  project,
  lineNav,
}: {
  project: ProjectDetail;
  /** 与 URL `?nav=` 一致；null/空串表示「项目总览」 */
  lineNav?: string | null;
}) {
  const isALineProjectOverview =
    project.slug === "a-line" && (lineNav == null || lineNav === "");
  const wiki = project.retrospectiveOverviewWikiEmbed;
  const wikiSrc =
    isALineProjectOverview && wiki
      ? safeHttpsEmbedUrl(wiki.embedUrl)
      : null;
  const wikiTitle = wiki?.title ?? "嵌入文档";
  const wikiH = wiki?.heightPx ?? 640;
  const showWikiLinkOnly = wiki?.displayMode === "link";

  const localDash = project.retrospectiveLocalDashboard;
  const refundPlan = project.retrospectiveRefundReductionPlan;
  const iframeMinH = localDash?.minHeight ?? 920;
  const retrospectives = Array.isArray(project.retrospectives)
    ? project.retrospectives
    : [];

  return (
    <div className="space-y-4">
      {wikiSrc ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card overflow-hidden p-0">
            <div className="border-b border-border/80 bg-muted/20 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">{wikiTitle}</p>
            </div>
            {showWikiLinkOnly ? (
              <div
                className="flex flex-col items-center justify-center gap-4 bg-muted/20 px-5 py-14"
                style={{ minHeight: Math.min(wikiH, 360) }}
              >
                <a
                  href={wiki?.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  在飞书中打开
                </a>
              </div>
            ) : (
              <div className="relative w-full bg-muted/30">
                {/*
                  不设 sandbox：过严 sandbox 会加剧飞书 OAuth/会话在 iframe 内失败。
                  embedUrl 来自项目数据，仅信任来源时使用。
                */}
                <iframe
                  title={wikiTitle}
                  src={wikiSrc}
                  className="block w-full border-0"
                  style={{ minHeight: wikiH }}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="clipboard-read; clipboard-write; fullscreen"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 border-t border-border/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="break-all font-mono text-[12px] text-muted-foreground">
                {wiki?.embedUrl}
              </p>
              <a
                href={wiki?.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium shadow-sm hover:bg-muted/50"
              >
                在飞书中打开
              </a>
            </div>
          </Card>
        </motion.div>
      ) : null}

      {localDash ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card overflow-hidden p-0">
            <div className="border-b border-border/80 bg-muted/20 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">
                {localDash.title}
              </p>
              {localDash.blurb ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {localDash.blurb}
                </p>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  以下为第六期退费深度分析看板（总览、归因、直播间、时间维度、解决方案），在站内同源嵌入，图表与 Tab 与独立 HTML 一致。
                </p>
              )}
            </div>
            <div className="relative w-full bg-background/40">
              <iframe
                title={localDash.title}
                src={localDash.src}
                className="block w-full border-0"
                style={{ minHeight: iframeMinH }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-2 border-t border-border/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="break-all font-mono text-[12px] text-muted-foreground">
                {localDash.src}
              </p>
              <a
                href={localDash.src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium shadow-sm hover:bg-muted/50"
              >
                新窗口全屏打开
              </a>
            </div>
          </Card>
        </motion.div>
      ) : null}

      {localDash && refundPlan ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <RefundReductionPlanCard plan={refundPlan} />
        </motion.div>
      ) : null}

      {retrospectives.length > 0 ? (
      <div className="grid gap-3">
        {retrospectives.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Card className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(r.date)}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    问题背景
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.context}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Root Cause
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {r.rootCause.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    影响分析
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.impact}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    解决方案
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {r.actions.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    经验沉淀
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {r.lessons.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                {r.followUp ? (
                  <div className="md:col-span-2 rounded-lg border bg-muted/15 p-3 text-sm">
                    <span className="font-medium">后续优化：</span>
                    {r.followUp}
                  </div>
                ) : null}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      ) : null}

      {project.deepDive ? (
        <div className="space-y-4">
          <Card className="glass-card p-5">
            <p className="text-sm font-semibold">专业复盘案例 · RCA</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Timeline · 文本 · 鱼骨图
            </p>
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p className="font-medium">{project.deepDive.title}</p>
              <p className="text-muted-foreground">
                {project.deepDive.problemBackground}
              </p>
              <div className="rounded-lg border bg-muted/10 p-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Root Cause 摘要
                </p>
                <p className="mt-2">{project.deepDive.rootCauseSummary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Timeline
                </p>
                <div className="mt-2 space-y-2">
                  {project.deepDive.timeline.map((t) => (
                    <div
                      key={t.date}
                      className="flex gap-3 rounded-lg border px-3 py-2"
                    >
                      <span className="w-28 shrink-0 text-xs text-muted-foreground">
                        {formatDate(t.date)}
                      </span>
                      <span className="text-sm">{t.event}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  解决方案
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {project.deepDive.solution.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              {project.deepDive.metrics?.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.deepDive.metrics.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>

          <FishboneDiagram dive={project.deepDive} />
        </div>
      ) : null}
    </div>
  );
}

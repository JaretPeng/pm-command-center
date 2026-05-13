"use client";

import dynamic from "next/dynamic";
import { Fragment, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/domain";
import { CourseSystemPlanningDiagram } from "@/components/project/course-system-planning-diagram";

const AlineProductCompositionPricing = dynamic(
  () =>
    import("@/components/project/aline-product-composition-pricing").then(
      (m) => m.AlineProductCompositionPricing,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        加载产品构成与定价…
      </div>
    ),
  },
);

const AlineCtoAOperationSchemeBlock = dynamic(
  () =>
    import("@/components/project/aline-c-to-a-operation-scheme").then(
      (m) => m.AlineCtoAOperationSchemeBlock,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        加载 C 线转 A 线方案…
      </div>
    ),
  },
);

const AlineSchedulePlanningBlock = dynamic(
  () =>
    import("@/components/project/aline-schedule-planning").then(
      (m) => m.AlineSchedulePlanningBlock,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        加载 A 线排课规划…
      </div>
    ),
  },
);

const AlineSalesRulesBlock = dynamic(
  () =>
    import("@/components/project/aline-sales-rules").then(
      (m) => m.AlineSalesRulesBlock,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        加载售卖规则…
      </div>
    ),
  },
);

const AlineMarketingMaterialsBlock = dynamic(
  () =>
    import("@/components/project/aline-marketing-materials").then(
      (m) => m.AlineMarketingMaterialsBlock,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        加载营销物料…
      </div>
    ),
  },
);

/** A 线仅「项目总览」（无侧栏 nav）时在 Operation Scheme 展示额外模块 */
function showAlineOperationSchemeOverviewExtras(
  slug: string,
  lineNav: string | null | undefined,
): boolean {
  return slug === "a-line" && (lineNav == null || lineNav === "");
}

export function OperationSchemeTab({
  project,
  lineNav,
}: {
  project: ProjectDetail;
  /** 侧栏子项目 `?nav=`；仅 A 线项目总览（无 nav）时用于追加专属运营模块 */
  lineNav?: string | null;
}) {
  const block = project.operationScheme;
  const showAlineExtras = showAlineOperationSchemeOverviewExtras(
    project.slug,
    lineNav,
  );

  const sections = useMemo(
    () => block?.sections ?? [],
    [block?.sections],
  );

  const curriculumIdx = useMemo(
    () =>
      sections.findIndex(
        (sec) =>
          sec.diagram === "courseSystem" ||
          (typeof sec.title === "string" &&
            sec.title.includes("课程体系规划")),
      ),
    [sections],
  );

  const hasConfiguredScheme = Boolean(block?.sections?.length);

  if (!showAlineExtras && !hasConfiguredScheme) {
    return (
      <Card className="glass-card p-6">
        <p className="text-sm font-medium">Operation Scheme</p>
        <p className="mt-2 text-sm text-muted-foreground">
          尚未配置运营方案内容。请在{" "}
          <code className="rounded bg-muted px-1">
            data/projects/{project.slug}.json
          </code>{" "}
          中增加 <code className="rounded bg-muted px-1">operationScheme</code>{" "}
          字段（含 <code className="rounded bg-muted px-1">sections</code> 等）。
        </p>
      </Card>
    );
  }

  function renderSectionCard(
    sec: (typeof sections)[number],
    idx: number,
    delayIdx: number,
  ) {
    return (
      <motion.div
        key={`${sec.title ?? "section"}-${idx}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delayIdx * 0.04 }}
        className={
          sec.imageSrc || sec.diagram === "courseSystem"
            ? "md:col-span-2"
            : undefined
        }
      >
        <Card className="glass-card h-full p-5">
          <h3 className="text-sm font-semibold">{sec.title ?? "（未命名板块）"}</h3>
          {sec.links?.length ? (
            <ul className="mt-3 space-y-2">
              {sec.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {sec.diagram === "courseSystem" ? (
            <CourseSystemPlanningDiagram />
          ) : null}
          {sec.imageSrc && sec.diagram !== "courseSystem" ? (
            <div className="mt-3 overflow-hidden rounded-lg border bg-muted/20 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- 动态 public 路径 */}
              <img
                src={sec.imageSrc}
                alt={sec.title}
                className="mx-auto max-h-[min(70vh,640px)] w-full object-contain"
              />
            </div>
          ) : null}
          {sec.content?.trim() ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {sec.content}
            </p>
          ) : null}
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((sec, idx) => (
            <Fragment key={`${sec.title ?? "section"}-${idx}`}>
              {renderSectionCard(sec, idx, idx)}
              {showAlineExtras &&
              curriculumIdx >= 0 &&
              idx === curriculumIdx ? (
                <motion.div
                  key="aline-pricing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 1) * 0.04 }}
                  className="md:col-span-2"
                >
                  <AlineProductCompositionPricing />
                </motion.div>
              ) : null}
            </Fragment>
          ))}
          {showAlineExtras && curriculumIdx < 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2"
            >
              <AlineProductCompositionPricing />
            </motion.div>
          ) : null}
        </div>
      ) : null}

      {showAlineExtras ? <AlineCtoAOperationSchemeBlock /> : null}
      {showAlineExtras ? <AlineSchedulePlanningBlock /> : null}
      {showAlineExtras ? <AlineSalesRulesBlock /> : null}
      {showAlineExtras ? <AlineMarketingMaterialsBlock /> : null}
    </div>
  );
}

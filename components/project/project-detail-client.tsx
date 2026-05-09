"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { ProjectDetail } from "@/types/domain";
import { getALineNavLabel } from "@/config/a-line-sidebar";
import { getCLineNavLabel } from "@/config/c-line-sidebar";
import {
  PROJECT_TAB_LIST,
  resolveProjectTabParam,
  type ProjectTabId,
} from "@/config/project-tabs";
import { ProjectHero } from "@/components/project/project-hero";
import { OverviewTab } from "@/components/project/tabs/overview-tab";
import { MilestonesTab } from "@/components/project/tabs/milestones-tab";
import { TimelineTab } from "@/components/project/tabs/timeline-tab";
import { TeamTab } from "@/components/project/tabs/team-tab";
import { DocumentsTab } from "@/components/project/tabs/documents-tab";
import { OperationSchemeTab } from "@/components/project/tabs/operation-scheme-tab";
import { RetrospectiveTab } from "@/components/project/tabs/retrospective-tab";

export function ProjectDetailClient({ project }: { project: ProjectDetail }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = useMemo(
    () => resolveProjectTabParam(searchParams.get("tab")),
    [searchParams],
  );

  const sideNavSubLabel = useMemo(() => {
    const nav = searchParams.get("nav");
    if (project.slug === "a-line") return getALineNavLabel(nav);
    if (project.slug === "c3-v6") return getCLineNavLabel(nav);
    return undefined;
  }, [project.slug, searchParams]);

  function onTab(next: ProjectTabId) {
    const p = new URLSearchParams(searchParams.toString());
    if (next === "overview") {
      p.delete("tab");
    } else {
      p.set("tab", next);
    }
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          总控台
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{project.name}</span>
      </div>

      {sideNavSubLabel ? (
        <div className="rounded-lg border border-primary/25 bg-primary/[0.06] px-3 py-2 text-sm">
          <span className="text-muted-foreground">侧栏子项目 · </span>
          <span className="font-medium text-foreground">{sideNavSubLabel}</span>
        </div>
      ) : null}

      <ProjectHero project={project} />

      <div
        className="flex w-full flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/30 p-2"
        role="tablist"
      >
        {PROJECT_TAB_LIST.map((t) => (
          <Button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            variant={tab === t.id ? "default" : "ghost"}
            size="sm"
            className="px-3"
            onClick={() => onTab(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === "overview" ? <OverviewTab project={project} /> : null}
          {tab === "milestones" ? <MilestonesTab project={project} /> : null}
          {tab === "timeline" ? <TimelineTab project={project} /> : null}
          {tab === "team" ? <TeamTab project={project} /> : null}
          {tab === "operation-scheme" ? (
            <OperationSchemeTab project={project} />
          ) : null}
          {tab === "documents" ? <DocumentsTab project={project} /> : null}
          {tab === "retrospective" ? (
            <RetrospectiveTab project={project} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

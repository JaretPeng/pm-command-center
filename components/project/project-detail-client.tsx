"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { ProjectDetail } from "@/types/domain";
import { getALineNavLabel } from "@/config/a-line-sidebar";
import { getCLineNavLabel } from "@/config/c-line-sidebar";
import {
  projectTabsForSlug,
  resolveProjectTabForSlug,
  type ProjectTabId,
} from "@/config/project-tabs";
import {
  PM_SEARCH_SYNC_EVENT,
  readLocationSearchQuery,
} from "@/lib/url-search";
import { ProjectHero } from "@/components/project/project-hero";
import { OverviewTab } from "@/components/project/tabs/overview-tab";
import { MilestonesTab } from "@/components/project/tabs/milestones-tab";
import { TimelineTab } from "@/components/project/tabs/timeline-tab";
import { TeamTab } from "@/components/project/tabs/team-tab";
import { DocumentsTab } from "@/components/project/tabs/documents-tab";
import { OperationSchemeTab } from "@/components/project/tabs/operation-scheme-tab";
import { RetrospectiveTab } from "@/components/project/tabs/retrospective-tab";

export function ProjectDetailClient({
  project,
  initialSearchQuery,
}: {
  project: ProjectDetail;
  /** 与 `window.location.search` 一致，不含前导 `?` */
  initialSearchQuery: string;
}) {
  const pathname = usePathname();

  const [urlQuery, setUrlQuery] = useState(initialSearchQuery);

  const parseNavTab = useCallback(
    (q: string) => {
      const sp = new URLSearchParams(q);
      return {
        nav: sp.get("nav"),
        tab: sp.get("tab"),
      };
    },
    [],
  );

  /** Tab 仅用本地 state + history.replaceState，避免 router.replace 触发 RSC 重拉取（部分环境下会 500） */
  const [tab, setTab] = useState<ProjectTabId>(() => {
    const { nav, tab: t } = parseNavTab(initialSearchQuery);
    return resolveProjectTabForSlug(project.slug, nav, t);
  });

  /** 侧栏 Link 软导航后，服务端会带上新的 initialSearchQuery */
  useEffect(() => {
    setUrlQuery(initialSearchQuery);
    const { nav, tab: t } = parseNavTab(initialSearchQuery);
    setTab(resolveProjectTabForSlug(project.slug, nav, t));
  }, [initialSearchQuery, project.slug, parseNavTab]);

  /** 浏览器前进/后退，或本页 replaceState 后触发的同步 */
  useEffect(() => {
    const syncFromWindow = () => {
      const q = readLocationSearchQuery();
      setUrlQuery(q);
      const { nav, tab: t } = parseNavTab(q);
      setTab(resolveProjectTabForSlug(project.slug, nav, t));
    };
    window.addEventListener("popstate", syncFromWindow);
    window.addEventListener(PM_SEARCH_SYNC_EVENT, syncFromWindow);
    return () => {
      window.removeEventListener("popstate", syncFromWindow);
      window.removeEventListener(PM_SEARCH_SYNC_EVENT, syncFromWindow);
    };
  }, [project.slug, parseNavTab]);

  const sideNavSubLabel = useMemo(() => {
    const nav = new URLSearchParams(urlQuery).get("nav");
    if (project.slug === "a-line") return getALineNavLabel(nav);
    if (project.slug === "c3-v6") return getCLineNavLabel(nav);
    return undefined;
  }, [project.slug, urlQuery]);

  const lineNav = useMemo(
    () => new URLSearchParams(urlQuery).get("nav"),
    [urlQuery],
  );

  function onTab(next: ProjectTabId) {
    setTab(next);
    const p = new URLSearchParams(
      window.location.search.startsWith("?")
        ? window.location.search.slice(1)
        : "",
    );
    if (next === "overview") {
      p.delete("tab");
    } else {
      p.set("tab", next);
    }
    const qs = p.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    window.history.replaceState(window.history.state, "", url);
    setUrlQuery(readLocationSearchQuery());
    window.dispatchEvent(new Event(PM_SEARCH_SYNC_EVENT));
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
        {projectTabsForSlug(project.slug, lineNav).map((t) => (
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
            <OperationSchemeTab project={project} lineNav={lineNav} />
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

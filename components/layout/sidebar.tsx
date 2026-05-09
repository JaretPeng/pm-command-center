"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Command,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { aLineSidebar, aLineNavHref } from "@/config/a-line-sidebar";
import { cLineSidebar, cLineNavHref } from "@/config/c-line-sidebar";

function navInGroup(
  nav: string | null,
  items: readonly { id: string }[],
): boolean {
  if (!nav) return false;
  return items.some((i) => i.id === nav);
}

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navActive = searchParams.get("nav");

  const onALine =
    pathname === "/projects/a-line" || pathname?.startsWith("/projects/a-line/");
  const [aLineOpen, setALineOpen] = useState(onALine);

  const onCLine =
    pathname === "/projects/c3-v6" ||
    pathname?.startsWith("/projects/c3-v6/");
  const [cLineOpen, setCLineOpen] = useState(onCLine);

  /** 「已完结项目」默认收起，点击标题展开 */
  const [aCompletedOpen, setACompletedOpen] = useState(false);
  const [cCompletedOpen, setCCompletedOpen] = useState(false);

  useEffect(() => {
    if (onALine) setALineOpen(true);
  }, [onALine]);

  useEffect(() => {
    if (onCLine) setCLineOpen(true);
  }, [onCLine]);

  useEffect(() => {
    if (!onALine || !navActive) return;
    const g = aLineSidebar.groups.find((x) => x.id === "completed");
    if (g && navInGroup(navActive, g.items)) setACompletedOpen(true);
  }, [navActive, onALine]);

  useEffect(() => {
    if (!onCLine || !navActive) return;
    const g = cLineSidebar.groups.find((x) => x.id === "completed");
    if (g && navInGroup(navActive, g.items)) setCCompletedOpen(true);
  }, [navActive, onCLine]);

  const dashActive = pathname === "/";

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded border border-primary/20 bg-primary/10 text-primary">
          <Command className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight">PM Command</p>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            项目全景
          </p>
        </div>
      </div>
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 border-l-2 py-2 pl-2 pr-3 text-sm transition-colors",
              dashActive
                ? "border-primary bg-primary/[0.08] font-semibold text-primary"
                : "border-transparent text-foreground/80 hover:bg-muted hover:text-foreground",
            )}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            总控台
          </Link>

          {/* A线产品：二级 + 三级 */}
          <div className="rounded-md border border-transparent">
            <button
              type="button"
              onClick={() => setALineOpen((o) => !o)}
              className={cn(
                "flex w-full items-center gap-2 border-l-2 py-2 pl-2 pr-2 text-left text-sm transition-colors",
                onALine
                  ? "border-primary bg-primary/[0.08] font-semibold text-primary"
                  : "border-transparent text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
              aria-expanded={aLineOpen}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  !aLineOpen && "-rotate-90",
                )}
              />
              <FolderKanban className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{aLineSidebar.label}</span>
            </button>

            {aLineOpen ? (
              <div className="mb-1 mt-1 space-y-3 border-l border-border/80 pb-1 pl-4 ml-2">
                <Link
                  href={aLineSidebar.basePath}
                  className={cn(
                    "block rounded-md py-1.5 pl-2 text-xs transition-colors",
                    onALine && !navActive
                      ? "bg-muted/80 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  项目总览
                </Link>

                {aLineSidebar.groups.map((group) =>
                  group.id === "completed" ? (
                    <div key={group.id}>
                      <button
                        type="button"
                        onClick={() => setACompletedOpen((o) => !o)}
                        className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-expanded={aCompletedOpen}
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-transform",
                            !aCompletedOpen && "-rotate-90",
                          )}
                        />
                        <span className="min-w-0">{group.label}</span>
                      </button>
                      {aCompletedOpen ? (
                        <ul className="mt-1 space-y-0.5">
                          {group.items.map((item) => {
                            const href = aLineNavHref(item.id);
                            const childActive =
                              onALine && navActive === item.id;
                            return (
                              <li key={item.id}>
                                <Link
                                  href={href}
                                  className={cn(
                                    "block rounded-md py-1.5 pl-2 text-xs leading-snug transition-colors",
                                    childActive
                                      ? "bg-primary/10 font-medium text-primary"
                                      : "text-foreground/85 hover:bg-muted",
                                  )}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <div key={group.id}>
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {group.label}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {group.items.map((item) => {
                          const href = aLineNavHref(item.id);
                          const childActive =
                            onALine && navActive === item.id;
                          return (
                            <li key={item.id}>
                              <Link
                                href={href}
                                className={cn(
                                  "block rounded-md py-1.5 pl-2 text-xs leading-snug transition-colors",
                                  childActive
                                    ? "bg-primary/10 font-medium text-primary"
                                    : "text-foreground/85 hover:bg-muted",
                                )}
                              >
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </div>

          {/* C线产品：二级 + 三级（路由仍为 /projects/c3-v6） */}
          <div className="rounded-md border border-transparent">
            <button
              type="button"
              onClick={() => setCLineOpen((o) => !o)}
              className={cn(
                "flex w-full items-center gap-2 border-l-2 py-2 pl-2 pr-2 text-left text-sm transition-colors",
                onCLine
                  ? "border-primary bg-primary/[0.08] font-semibold text-primary"
                  : "border-transparent text-foreground/80 hover:bg-muted hover:text-foreground",
              )}
              aria-expanded={cLineOpen}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  !cLineOpen && "-rotate-90",
                )}
              />
              <FolderKanban className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{cLineSidebar.label}</span>
            </button>

            {cLineOpen ? (
              <div className="mb-1 mt-1 space-y-3 border-l border-border/80 pb-1 pl-4 ml-2">
                <Link
                  href={cLineSidebar.basePath}
                  className={cn(
                    "block rounded-md py-1.5 pl-2 text-xs transition-colors",
                    onCLine && !navActive
                      ? "bg-muted/80 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  项目总览
                </Link>

                {cLineSidebar.groups.map((group) =>
                  group.id === "completed" ? (
                    <div key={group.id}>
                      <button
                        type="button"
                        onClick={() => setCCompletedOpen((o) => !o)}
                        className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-expanded={cCompletedOpen}
                      >
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-transform",
                            !cCompletedOpen && "-rotate-90",
                          )}
                        />
                        <span className="min-w-0">{group.label}</span>
                      </button>
                      {cCompletedOpen ? (
                        <ul className="mt-1 space-y-0.5">
                          {group.items.map((item) => {
                            const href = cLineNavHref(item.id);
                            const childActive =
                              onCLine && navActive === item.id;
                            return (
                              <li key={item.id}>
                                <Link
                                  href={href}
                                  className={cn(
                                    "block rounded-md py-1.5 pl-2 text-xs leading-snug transition-colors",
                                    childActive
                                      ? "bg-primary/10 font-medium text-primary"
                                      : "text-foreground/85 hover:bg-muted",
                                  )}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <div key={group.id}>
                      <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {group.label}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {group.items.map((item) => {
                          const href = cLineNavHref(item.id);
                          const childActive =
                            onCLine && navActive === item.id;
                          return (
                            <li key={item.id}>
                              <Link
                                href={href}
                                className={cn(
                                  "block rounded-md py-1.5 pl-2 text-xs leading-snug transition-colors",
                                  childActive
                                    ? "bg-primary/10 font-medium text-primary"
                                    : "text-foreground/85 hover:bg-muted",
                                )}
                              >
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ),
                )}
              </div>
            ) : null}
          </div>
        </nav>
        <Separator className="my-4" />
        <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">提示</p>
          <p className="mt-1 leading-relaxed">
            使用 <kbd className="rounded border bg-background px-1">⌘K</kbd>{" "}
            打开全局搜索
          </p>
        </div>
      </ScrollArea>
    </aside>
  );
}

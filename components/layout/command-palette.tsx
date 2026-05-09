"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { projectDetailHref } from "@/config/project-tabs";
import { searchEverything, type SearchHit } from "@/lib/search";
import type { ProjectDetail } from "@/types/domain";
import { FileText, FolderOpen } from "lucide-react";

export function CommandPalette({
  projects,
  open,
  onOpenChange,
}: {
  projects: ProjectDetail[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const hits = useMemo(() => searchEverything(projects, q).slice(0, 12), [projects, q]);

  function go(h: SearchHit) {
    if (h.type === "project") {
      router.push(projectDetailHref(h.slug));
    } else {
      router.push(projectDetailHref(h.slug, "documents"));
    }
    onOpenChange(false);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>全局搜索</DialogTitle>
          <DialogDescription>搜索项目与文档</DialogDescription>
        </DialogHeader>
        <div className="border-b px-3 py-2">
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="输入关键词…"
            className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <ScrollArea className="max-h-[min(420px,60vh)]">
          <div className="p-2">
            {hits.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                {q.trim() ? "未找到匹配项" : "输入以搜索项目或文档"}
              </p>
            ) : (
              hits.map((h) => (
                <button
                  key={`${h.type}-${h.slug}-${h.title}`}
                  type="button"
                  onClick={() => go(h)}
                  className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted"
                >
                  <span className="mt-0.5 text-muted-foreground">
                    {h.type === "project" ? (
                      <FolderOpen className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium leading-snug">
                      {h.title}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {h.subtitle}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="border-t px-3 py-2 text-xs text-muted-foreground">
          导航 · Esc 关闭
        </div>
      </DialogContent>
    </Dialog>
  );
}

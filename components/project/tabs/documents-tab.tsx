"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DocCategory, DocumentItem, ProjectDetail } from "@/types/domain";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LS_FAV = "pmcc_doc_favorites";
const LS_RECENT = "pmcc_doc_recent";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function DocumentsTab({ project }: { project: ProjectDetail }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<DocCategory | "all">("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readJson<string[]>(LS_FAV, []));
    setRecent(readJson<string[]>(LS_RECENT, []));
  }, []);

  const filtered = useMemo(() => {
    return project.documents.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      const blob = `${d.title} ${(d.tags ?? []).join(" ")} ${d.owner ?? ""} ${d.department ?? ""}`.toLowerCase();
      return blob.includes(q.trim().toLowerCase());
    });
  }, [project.documents, cat, q]);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeJson(LS_FAV, next);
      return next;
    });
  }

  function touchRecent(id: string) {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8);
      writeJson(LS_RECENT, next);
      return next;
    });
  }

  const recentDocs = useMemo(() => {
    return recent
      .map((id) => project.documents.find((d) => d.id === id))
      .filter(Boolean) as DocumentItem[];
  }, [recent, project.documents]);

  return (
    <div className="space-y-4">
      <Card className="glass-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold">文档中心</h3>
            <p className="text-xs text-muted-foreground">
              Notion 风格 · 搜索 · 分类 · 收藏（本地）
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索标题 / 部门"
              className="sm:w-[260px]"
            />
            <Select
              value={cat}
              onValueChange={(v) => setCat(v as typeof cat)}
            >
              <SelectTrigger className="h-9 sm:w-[180px]">
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="project_doc">项目文档</SelectItem>
                <SelectItem value="operations">运营方案</SelectItem>
                <SelectItem value="gantt">甘特</SelectItem>
                <SelectItem value="syllabus">课程大纲</SelectItem>
                <SelectItem value="qa">QA</SelectItem>
                <SelectItem value="retrospective">复盘</SelectItem>
                <SelectItem value="data">数据监控</SelectItem>
                <SelectItem value="product">产品功能</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {recentDocs.length ? (
          <div className="mt-4 rounded-lg border bg-muted/15 p-3">
            <p className="text-xs font-medium text-muted-foreground">最近访问</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recentDocs.map((d) => (
                <Badge key={d.id} variant="secondary">
                  {d.title}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4 divide-y rounded-xl border">
          {filtered.map((d, idx) => {
            const rowShell =
              "flex w-full items-start gap-3 px-4 py-3 hover:bg-muted/30";
            const body = (
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium leading-snug">{d.title}</p>
                  <Badge variant="outline">{d.category}</Badge>
                  {d.href ? (
                    <span className="text-xs text-muted-foreground">↗ 外链</span>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>更新 {formatDate(d.updatedAt)}</span>
                  {(d.department ?? d.owner) ? (
                    <>
                      <span>·</span>
                      <span>
                        {d.department
                          ? `部门 · ${d.department}`
                          : (d.owner ?? "")}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            );
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={rowShell}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-0.5 h-8 w-8 shrink-0"
                  onClick={() => toggleFavorite(d.id)}
                  aria-label="收藏"
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      favorites.includes(d.id)
                        ? "fill-amber-400 text-amber-500"
                        : "text-muted-foreground",
                    )}
                  />
                </Button>
                {d.href ? (
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => touchRecent(d.id)}
                    className="min-w-0 flex-1 text-left text-foreground no-underline outline-none ring-offset-background hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {body}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => touchRecent(d.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    {body}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

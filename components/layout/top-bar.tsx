"use client";

import { Bell, Filter, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { TimeHorizon } from "@/lib/filters";
import type { RiskSeverity } from "@/types/domain";
import { useEffect, useState } from "react";

export type TopBarFilterState = {
  status: string;
  risk: RiskSeverity | "any";
  tag: string;
  horizon: TimeHorizon;
};

const defaultFilter: TopBarFilterState = {
  status: "all",
  risk: "any",
  tag: "all",
  horizon: "all",
};

export function useTopBarFilters() {
  const [filters, setFilters] = useState<TopBarFilterState>(defaultFilter);
  return { filters, setFilters };
}

export function TopBar({
  pmName,
  title,
  stats,
  onOpenCommand,
  tags,
  filterState,
  onFilterChange,
  showSearch = true,
}: {
  pmName: string;
  title: string;
  stats: {
    total: number;
    active: number;
    done: number;
    riskProjects: number;
    milestoneOpen: number;
  };
  onOpenCommand: () => void;
  tags: string[];
  filterState: TopBarFilterState;
  onFilterChange: (f: TopBarFilterState) => void;
  showSearch?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 dark:shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {pmName}
            </h1>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              项目 {stats.total} · 进行中 {stats.active} · 已完成 {stats.done} ·
              风险项 {stats.riskProjects} · 里程碑 {stats.milestoneOpen}
            </span>
          </div>
        </div>
        {showSearch && (
          <div className="hidden w-full max-w-sm lg:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="h-9 cursor-pointer pl-8"
                placeholder="搜索项目、文档…"
                onFocus={onOpenCommand}
                onClick={onOpenCommand}
                readOnly
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={onOpenCommand}
            aria-label="打开搜索"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <Filter className="mr-1.5 h-3.5 w-3.5" />
                筛选
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">时间维度</Label>
                  <Select
                    value={filterState.horizon}
                    onValueChange={(v) =>
                      onFilterChange({
                        ...filterState,
                        horizon: v as TimeHorizon,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="month">近 30 天</SelectItem>
                      <SelectItem value="quarter">近 90 天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">风险</Label>
                  <Select
                    value={filterState.risk}
                    onValueChange={(v) =>
                      onFilterChange({
                        ...filterState,
                        risk: v as RiskSeverity | "any",
                      })
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">全部</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">标签</Label>
                  <Select
                    value={filterState.tag}
                    onValueChange={(v) =>
                      onFilterChange({ ...filterState, tag: v })
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {tags.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Select
            value={filterState.horizon}
            onValueChange={(v) =>
              onFilterChange({
                ...filterState,
                horizon: v as TimeHorizon,
              })
            }
          >
            <SelectTrigger className="hidden h-9 w-[110px] sm:flex">
              <SelectValue placeholder="时间" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部时间</SelectItem>
              <SelectItem value="month">本月视角</SelectItem>
              <SelectItem value="quarter">本季视角</SelectItem>
            </SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>通知中心</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>示例：里程碑评审提醒、风险升级、文档更新。</p>
                <p className="text-xs">
                  后续可接入 Webhook / 消息队列实现真实推送。
                </p>
              </div>
            </SheetContent>
          </Sheet>
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="切换主题"
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="hidden h-4 w-4 dark:inline-block" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

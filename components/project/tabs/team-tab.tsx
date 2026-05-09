"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/domain";

export function TeamTab({ project }: { project: ProjectDetail }) {
  const grouped = project.team.reduce<Record<string, typeof project.team>>(
    (acc, m) => {
      acc[m.role] = acc[m.role] ?? [];
      acc[m.role].push(m);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-4">
      <Card className="glass-card p-4">
        <h3 className="text-sm font-semibold">组织协同结构</h3>
        <p className="text-xs text-muted-foreground">
          角色分组 · 交付项 · 当前状态
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {Object.entries(grouped).map(([role, members], gi) => (
            <div key={role} className="rounded-xl border bg-muted/10 p-4">
              <p className="text-xs font-semibold text-muted-foreground">{role}</p>
              <div className="mt-3 space-y-3">
                {members.map((m, i) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 + i * 0.04 }}
                    className="flex gap-3 rounded-lg border bg-background/60 p-3"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{m.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{m.name}</p>
                        <Badge variant="outline">{m.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        模块：{m.modules.join(" · ")}
                      </p>
                      <p className="mt-2 text-xs">
                        交付：{m.deliverables.join(" · ")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="glass-card p-4">
        <h3 className="text-sm font-semibold">协作网络（示意）</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          以角色分组呈现协同关系；后续可接入图谱组件深化连线。
        </p>
      </Card>
    </div>
  );
}

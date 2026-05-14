/** C线产品侧栏：二级类目 + 三级项目（nav 参数与 /projects/c3-v6 联动；数据仍为 c3-v6.json） */

import type { LineNavItem } from "@/config/a-line-sidebar";

export const cLineSidebar = {
  /** 与现有项目 slug、路由一致 */
  basePath: "/projects/c3-v6",
  label: "C线产品",
  groups: [
    {
      id: "current",
      label: "现行项目",
      items: [
        { id: "c1-v7-course", label: "C1-v7.0课程迭代" },
        { id: "c4-v6-course", label: "C4-v6.0课程迭代" },
        { id: "c5-v6-course", label: "C5-v6.0课程迭代" },
        { id: "ai-new-course", label: "AI新赠课制作" },
        { id: "ai-coding-assistant", label: "AI编程助手开发" },
      ] satisfies LineNavItem[],
    },
    {
      id: "completed",
      label: "已完结项目",
      items: [
        { id: "c2-v6-course", label: "C2-v6.0课程迭代" },
        { id: "c3-v6-course", label: "C3-v6.0课程迭代" },
        { id: "c-line-manual", label: "C线手册迭代" },
        { id: "c-line-diploma", label: "C线毕业证书迭代" },
        { id: "c-line-renewal-gift", label: "C线续报赠课" },
      ] satisfies LineNavItem[],
    },
  ],
} as const;

export function cLineNavHref(navId: string) {
  const q = new URLSearchParams({ nav: navId });
  return `${cLineSidebar.basePath}?${q.toString()}`;
}

export function getCLineNavLabel(navId: string | null): string | undefined {
  if (!navId) return undefined;
  for (const g of cLineSidebar.groups) {
    const hit = g.items.find((i) => i.id === navId);
    if (hit) return hit.label;
  }
  return undefined;
}

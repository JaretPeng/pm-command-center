/** A线产品侧栏：二级类目 + 三级项目（nav 参数与 /projects/a-line 联动） */

export type LineNavItem = { id: string; label: string };

export const aLineSidebar = {
  basePath: "/projects/a-line",
  label: "A线产品",
  groups: [
    {
      id: "current",
      label: "现行项目",
      items: [
        { id: "a1-ybc-hardware", label: "A1 YBC硬件课迭代" },
        { id: "a-line-manual", label: "A线手册制作" },
        { id: "a4-course", label: "A4课程制作" },
        { id: "a5-course", label: "A5课程制作" },
        { id: "a8-course", label: "A8课程制作" },
      ] satisfies LineNavItem[],
    },
    {
      id: "completed",
      label: "已完结项目",
      items: [
        { id: "a-plus-1-course", label: "A+1课程制作" },
        { id: "a1-course-done", label: "A1课程制作" },
        { id: "a2-course-done", label: "A2课程制作" },
        { id: "a-line-cert", label: "A线证书迭代" },
      ] satisfies LineNavItem[],
    },
  ],
} as const;

export function aLineNavHref(navId: string) {
  const q = new URLSearchParams({ nav: navId });
  return `${aLineSidebar.basePath}?${q.toString()}`;
}

export function getALineNavLabel(navId: string | null): string | undefined {
  if (!navId) return undefined;
  for (const g of aLineSidebar.groups) {
    const hit = g.items.find((i) => i.id === navId);
    if (hit) return hit.label;
  }
  return undefined;
}

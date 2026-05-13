/**
 * 与 App Router `searchParams` 对象互转；避免在客户端使用 `useSearchParams` 触发 CSR bailout。
 */
export const PM_SEARCH_SYNC_EVENT = "pm-command-search-sync";

export function stringifySearchParams(
  sp: Record<string, string | string[] | undefined> | undefined | null,
): string {
  if (!sp || typeof sp !== "object") return "";
  const u = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) u.append(key, v);
    } else {
      u.set(key, value);
    }
  }
  return u.toString();
}

/** 当前页 query（不含 `?`），仅在浏览器环境调用 */
export function readLocationSearchQuery(): string {
  if (typeof window === "undefined") return "";
  const s = window.location.search;
  return s.startsWith("?") ? s.slice(1) : s;
}

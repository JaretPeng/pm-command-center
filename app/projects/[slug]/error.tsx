"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** 项目详情段内渲染或流式传输失败时兜底，避免仅看到浏览器默认 Internal Server Error */
export default function ProjectSlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[projects/[slug]/error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center">
      <p className="text-lg font-semibold text-destructive">
        项目页渲染出错
      </p>
      <p className="text-sm text-muted-foreground">
        可尝试返回首页或重试。若反复出现，请打开开发者工具 Console
        查看第一条报错，并把 digest（若有）一并反馈。
      </p>
      {process.env.NODE_ENV === "development" && error.message ? (
        <pre className="max-h-40 overflow-auto rounded-md border bg-muted/50 p-3 text-left text-xs text-muted-foreground">
          {error.message}
        </pre>
      ) : null}
      {error.digest ? (
        <p className="text-xs text-muted-foreground">digest: {error.digest}</p>
      ) : null}
      <div className="flex justify-center gap-2">
        <Button type="button" variant="outline" onClick={() => reset()}>
          重试
        </Button>
      </div>
    </div>
  );
}

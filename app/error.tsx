"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center">
      <p className="text-lg font-semibold text-destructive">页面出错了</p>
      <p className="text-sm text-muted-foreground">
        开发环境可先执行{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          npm run dev:clean
        </code>{" "}
        清缓存后重试；若仍失败，请查看终端中的报错栈。
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

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        页面不存在
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        请检查链接，或返回项目总控台。
      </p>
      <Button asChild className="mt-6">
        <Link href="/">返回总控台</Link>
      </Button>
    </div>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * framer-motion / Radix：纳入 Next 编译，减少服务端 vendor-chunks 引用缺失
   *（如 motion-dom.js、@radix-ui.js 等 ENOENT）。
   */
  transpilePackages: [
    "framer-motion",
    "motion-dom",
    "motion-utils",
    "@radix-ui/react-avatar",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-label",
    "@radix-ui/react-popover",
    "@radix-ui/react-scroll-area",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-tabs",
    "@radix-ui/react-tooltip",
  ],
  /** Recharts 依赖 lodash；外置可避免部分环境下失效的 vendor-chunks 引用 */
  serverExternalPackages: ["lodash"],
  /** 服务端读 `data/projects` 时，避免 serverless 产物漏打包导致 ENOENT → 500 */
  outputFileTracingIncludes: {
    "/": ["./data/projects/**/*"],
    "/projects/[slug]": ["./data/projects/**/*"],
    "/api/projects": ["./data/projects/**/*"],
    "/api/projects/[slug]": ["./data/projects/**/*"],
  },
};

export default nextConfig;

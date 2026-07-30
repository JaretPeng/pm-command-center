import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * 开发时若用 127.0.0.1 打开（而 dev 绑定 0.0.0.0 / localhost），
   * Next 15+ 会拦截跨源 _next 资源，导致 hydration 失败、链接/Tab 点击无效。
   */
  allowedDevOrigins: ["127.0.0.1"],
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

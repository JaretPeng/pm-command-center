import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** 将 framer-motion 及其子包纳入 Next 编译，避免 Webpack 拆出缺失的 vendor-chunks/motion-dom.js */
  transpilePackages: ["framer-motion", "motion-dom", "motion-utils"],
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

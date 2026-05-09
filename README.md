# PM Command Center（项目全景驾驶舱）

企业级「项目管理驾驶舱 + 项目成果门户 + 项目全景系统」：多项目总控台、双项目详情（7 个 Tab）、JSON 数据驱动、深浅色主题、Recharts 指标、自研甘特、Netlify 一键部署。

项目详情 Tab 顺序：**Overview → Milestones → Timeline → Team → Operation Scheme → Documents → Retrospective**（`?tab=` 与 [`config/project-tabs.ts`](config/project-tabs.ts) 一致；历史链接 `tab=risks` / `tab=metrics` 会打开 Overview）。

## 环境要求

- Node.js 20+（与 `netlify.toml` 中 `NODE_VERSION` 一致）
- npm 9+

## 安装与本地运行

```bash
cd pm-command-center
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。

生产构建与本地预览生产包：

```bash
npm run build
npm run start
```

`next build` 会生成可部署的 HTML/静态资源与 API 路由；本地 `out/` 纯静态导出本仓库**未默认启用**（与 `app/api` 并存时通常使用 Netlify Next 插件运行完整 Next 运行时）。

## Netlify 部署

1. 将本目录推送到 Git 仓库，在 [Netlify](https://www.netlify.com/) 中 **New site from Git**。
2. **Build command**: `npm run build`
3. **Publish directory**: 使用官方 Next 插件时由插件接管；本仓库已包含 [`netlify.toml`](netlify.toml) 与 `@netlify/plugin-nextjs`。
4. 在 Netlify 站点设置中可选配置环境变量（见 `.env.example`）。

> 首次构建需安装依赖；确保 Netlify 使用 Node 20（已在 `netlify.toml` 指定）。

## 项目结构（概要）

- [`app/`](app/) — App Router：`/` 总控台，[`app/projects/[slug]`](app/projects/[slug]/page.tsx) 项目详情。
- [`app/api/projects`](app/api/projects/route.ts) — 读取与数据层一致的 JSON，便于未来替换为数据库。
- [`data/projects/`](data/projects/) — 本地 JSON 数据源（`index.json` + 各 `slug.json`）。
- [`types/domain.ts`](types/domain.ts) — 领域类型定义。
- [`lib/load-projects.ts`](lib/load-projects.ts) — 服务端读取 JSON（`server-only`）。
- [`components/dashboard/`](components/dashboard/) — KPI、项目卡、时间轴、风险等。
- [`components/project/`](components/project/) — 详情 Hero、Tab 面板、鱼骨图等。
- [`components/gantt/`](components/gantt/) — 甘特视图（SVG）。

## 数据结构说明

核心实体见 [`types/domain.ts`](types/domain.ts)：`ProjectDetail`、`Milestone`、`GanttItem`、`TeamMember`、`DocumentItem`、`RiskItem`、`MetricBlock`、`OperationSchemeBlock`、`RetrospectiveItem`、`RetrospectiveDeepDive` 等（风险与指标数据仍在 JSON 中，详情页不再单独 Tab）。

聚合列表入口：[`data/projects/index.json`](data/projects/index.json) 中的 `projects` 数组（摘要字段与卡片一致）。

完整项目：`data/projects/<slug>.json`，例如：

- [`data/projects/a-line.json`](data/projects/a-line.json)
- [`data/projects/c3-v6.json`](data/projects/c3-v6.json)

## 如何新增项目

1. 复制任意 `data/projects/*.json` 为模板，新建 `data/projects/<slug>.json`，填写完整 `ProjectDetail` 字段。
2. 在 [`data/projects/index.json`](data/projects/index.json) 的 `projects` 数组中追加一条 **摘要**（与卡片字段一致：`slug`、`name`、`progress`、`tags` 等）。
3. 将 [`app/projects/[slug]/page.tsx`](app/projects/[slug]/page.tsx) 中 `generateStaticParams` 增加 `{ slug: "<slug>" }`（或使用动态 `generateStaticParams` 从索引读取）。
4. 可选：在 [`components/layout/sidebar.tsx`](components/layout/sidebar.tsx) 添加导航链接。

## 如何新增模块 / Tab 字段

1. 在 [`types/domain.ts`](types/domain.ts) 中扩展对应接口（如为 `ProjectDetail` 增加 `customModule`）。
2. 在相应 JSON 中增加字段，保持与类型一致。
3. 在 [`config/project-tabs.ts`](config/project-tabs.ts) 与 [`components/project/project-detail-client.tsx`](components/project/project-detail-client.tsx) 增加 Tab id，并新建面板组件于 [`components/project/tabs/`](components/project/tabs/)。

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint |

## API

- `GET /api/projects` — 返回 PM 信息、摘要列表与全量详情（便于后续接前端或外部系统）。
- `GET /api/projects/<slug>` — 返回单个项目详情。

## 许可

内部/个人使用示例项目；可按需修改与再发行。

export type ProjectHealth = "excellent" | "good" | "warning" | "critical";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type MilestoneStatus =
  | "planned"
  | "in_progress"
  | "done"
  | "at_risk"
  | "delayed";

export type DocCategory =
  | "project_doc"
  | "operations"
  | "gantt"
  | "syllabus"
  | "qa"
  | "retrospective"
  | "data"
  | "product";

export type TeamStatus = "active" | "busy" | "blocked" | "offline";

/** Hero 课程体系条卡片角标图标（映射 Lucide） */
export type HeroCurriculumIcon =
  | "terminal"
  | "code"
  | "trendingUp"
  | "box"
  | "fileText"
  | "helpCircle";

export interface HeroCurriculumModule {
  code: string;
  line1: string;
  line2?: string;
  icon: HeroCurriculumIcon;
}

export interface HeroCurriculumStrip {
  title: string;
  moreLabel?: string;
  moreHref?: string;
  modules: HeroCurriculumModule[];
}

export interface ProjectSummary {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: string;
  phase: string;
  progress: number;
  riskLevel: RiskSeverity;
  owner: string;
  startDate: string;
  milestoneCount: number;
  blockerCount: number;
  tags: string[];
  health: ProjectHealth;
  delayed?: boolean;
  highPriority?: boolean;
}

export interface Milestone {
  id: string;
  name: string;
  owner: string;
  dueDate: string;
  status: MilestoneStatus;
  risk?: RiskSeverity;
  modules: string[];
  description?: string;
  projectSlug?: string;
  projectName?: string;
}

export interface GanttDependency {
  from: string;
  to: string;
}

export interface GanttItem {
  id: string;
  name: string;
  lane: string;
  start: string;
  end: string;
  progress: number;
  phase?: "phase1" | "phase2" | "ongoing";
  dependencies?: GanttDependency[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  modules: string[];
  status: TeamStatus;
  deliverables: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: DocCategory;
  /** 可选；用于搜索等，列表不再展示 */
  tags?: string[];
  updatedAt: string;
  /** 兼容旧数据；无 department 时 UI 可回退显示 */
  owner?: string;
  /** 责任部门（优先于 owner 展示） */
  department?: string;
  excerpt?: string;
  favorite?: boolean;
  /** 外链（飞书/石墨等）；存在时列表行点击在新标签页打开 */
  href?: string;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: RiskSeverity;
  status: string;
  impact: string;
  owner: string;
  mitigation: string;
  progress: string;
}

export interface MetricSeries {
  id: string;
  name: string;
  unit?: string;
  data: { period: string; value: number }[];
}

export interface MetricBlock {
  kpis: {
    id: string;
    label: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "flat";
  }[];
  series: MetricSeries[];
}

export interface StructureNode {
  id: string;
  label: string;
  sublabel?: string;
}

export interface StructureEdge {
  from: string;
  to: string;
}

export interface ProjectStructure {
  nodes: StructureNode[];
  edges: StructureEdge[];
}

/** Timeline 页：嵌入外部甘特（如石墨「嵌入」链接）；无法嵌入时用 JSON `gantt` 兜底 */
export interface TimelineEmbedBlock {
  title?: string;
  caption?: string;
  /** 石墨或允许 iframe 的 HTTPS 地址（需在石墨侧开启嵌入/发布） */
  embedUrl: string;
  /** iframe 高度，默认 560 */
  heightPx?: number;
  /** 为 true 时隐藏下方基于 JSON 的自绘甘特，仅显示嵌入 */
  hideBuiltInGantt?: boolean;
}

/** Overview 页展示的视频：本地 `public` 文件、YouTube 嵌入，或允许 iframe 的 HTTPS 页面（如飞书知识库） */
export interface OverviewVideoBlock {
  /** file：填写放在 `public/` 下的路径，如 `/videos/demo.mp4`；youtube / embed 见 `src` */
  mode: "file" | "youtube" | "embed";
  /** file 模式为 MP4/WebM 等 URL；youtube 为 11 位 ID 或完整链接；embed 为可 iframe 的 HTTPS 地址（如飞书 wiki） */
  src: string;
  poster?: string;
  title?: string;
  caption?: string;
  /** embed 模式：iframe 最小高度（px），默认 480 */
  embedHeightPx?: number;
}

/** 复盘卡片内可选表格（列标题 + 行数据，均为纯文本） */
export interface RetrospectiveItemTable {
  title: string;
  columns: string[];
  /** 每行列数应与 columns 一致 */
  rows: string[][];
  footnote?: string;
}

export interface RetrospectiveItem {
  id: string;
  title: string;
  date: string;
  context: string;
  rootCause: string[];
  impact: string;
  actions: string[];
  lessons: string[];
  followUp?: string;
  /** 置于「影响分析」与「解决方案」之间：分班衔接、损益测算等 */
  supplementTables?: RetrospectiveItemTable[];
}

/** Retrospective Tab：同源 `public/` 下的静态 HTML 看板（可 iframe 完整保留 Chart.js 等交互） */
export interface RetrospectiveLocalDashboard {
  title: string;
  /** 以 `/` 开头的站内路径，如 `/dashboards/foo.html` */
  src: string;
  blurb?: string;
  /** iframe 最小高度（px），默认 920 */
  minHeight?: number;
}

/**
 * 仅 A 线「项目总览」（URL 无 `?nav=`）时，在 Retrospective Tab 顶部、退费看板上方展示的飞书/wiki 嵌入。
 * 带 `?nav=` 的侧栏子项目不展示。
 */
export interface RetrospectiveOverviewWikiEmbed {
  title: string;
  /** 飞书知识库/wiki 等 HTTPS 链接（需在飞书侧允许嵌入或对外可读） */
  embedUrl: string;
  caption?: string;
  /** iframe 最小高度（px），默认 640 */
  heightPx?: number;
  /**
   * `iframe`：页内嵌入（外站域名下扫码登录可能被浏览器拦截第三方 Cookie，飞书接口偶发 `{"code":1,"msg":"Failed"}`）。
   * `link`：不嵌入 iframe，仅展示说明与「在飞书中打开」——需登录或稳定查看时用此模式。
   * @default "iframe"
   */
  displayMode?: "iframe" | "link";
}

/** 退费看板后的「降退费解决方案」等结构化文案 */
export interface RetrospectiveRefundReductionPhase {
  /** 阶段名，如「维稳期」「建联期」 */
  name: string;
  /** 展示为「方案-{name}」；可与 document 内章节标题一致 */
  schemePrefix?: string;
  /** 本阶段目标 */
  goal: string;
  /** 面向家长的动作要点 */
  forParents: string[];
  /** 面向学员的动作要点 */
  forStudents: string[];
}

export interface RetrospectiveRefundReductionPlan {
  /** 模块主标题，如「降退费解决方案」 */
  documentTitle: string;
  context: {
    scenario: string;
    conflict: string;
    problems: string[];
  };
  phases: RetrospectiveRefundReductionPhase[];
}

export interface FishboneBranch {
  category: string;
  causes: string[];
}

/** 运营方案 Tab 内置矢量图类型 */
export type OperationSchemeDiagramId =
  | "courseSystem"
  | "a1YbcProductPricing"
  /** C 线项目总览：价值探索—待办—验证—指标闭环路径图 */
  | "clineValueLoopOps"
  /** 搭建 OJ 平台：猿编程 OJ 运营方案核心链路示意 */
  | "ojPlatformOperations"
  /** 搭建 OJ 平台：YBC OJ vs 核桃（HT）OJ 一、二期对比表 */
  | "ojProductComparison";

/** 运营方案 Tab：外联一行（石墨、飞书等） */
export interface OperationSchemeLink {
  label: string;
  href: string;
}

/** 运营方案 Tab 内容 */
export interface OperationSchemeSection {
  title: string;
  /** 正文；可与 imageSrc / diagram 同时存在，或仅图时留空字符串 */
  content: string;
  /** 可选：外联列表（如课程大纲文档） */
  links?: OperationSchemeLink[];
  /** 可选：配图 URL，须为站内路径（如 `/images/...` 指向 `public/`） */
  imageSrc?: string;
  /** 可选：内置矢量示意图（与 imageSrc 二选一即可，优先渲染 diagram） */
  diagram?: OperationSchemeDiagramId;
}

export interface OperationSchemeBlock {
  summary?: string;
  /** 各板块正文；可仅填 summary 留空 sections，页面会提示补充 */
  sections?: OperationSchemeSection[];
}

export interface RetrospectiveDeepDive {
  id: string;
  title: string;
  problemBackground: string;
  timeline: { date: string; event: string }[];
  rootCauseSummary: string;
  fishbone: {
    problemStatement: string;
    branches: FishboneBranch[];
  };
  solution: string[];
  metrics?: string[];
}

export interface ProjectDetail extends ProjectSummary {
  endDate?: string;
  version?: string;
  /** 若填写，Hero 区用多段正文替代「摘要 + 项目目标/关键成果」两栏 */
  heroNarrative?: string[];
  /** 若填写，Hero 底部元信息行仅显示日历 + 该文案（不展示负责人 / 版本 / 风险） */
  heroDateCaption?: string;
  /** 为 true 时不渲染 Hero 主卡底部日期 / 负责人 / 版本 / 风险整行 */
  heroHideBottomMeta?: boolean;
  /** 若填写，Hero 右侧卡片显示「项目动态」及环形分布，替代完成度饼图 */
  heroDynamics?: {
    inProgress: number;
    completed: number;
    pending: number;
    risk: number;
  };
  /** Hero 标题行：在 status / health 旁追加 outline 标签（如子项目「智能硬件」） */
  heroTagBadges?: string[];
  /** Hero 右侧动态卡片标题，默认「项目动态」 */
  heroDynamicsCardTitle?: string;
  /** 环形图中心第二行文案，默认「项目合计」 */
  heroDynamicsTotalLabel?: string;
  /** 动态卡片底部四宫格标题，未填则沿用「进行中项目」等 */
  heroDynamicsStatLabels?: {
    inProgress?: string;
    completed?: string;
    pending?: string;
    risk?: string;
  };
  /** 动态卡片四宫格数字后的单位，默认「个」 */
  heroDynamicsValueUnit?: string;
  /** Hero 主卡内：横向课程体系条（如 A1–A8「高级算法」） */
  heroCurriculumStrip?: HeroCurriculumStrip;
  /** 可选：Hero 叙事块末尾展示的外链（如 https://oj.example.com） */
  heroFooterUrl?: string;
  executiveSummary: string;
  objectives: string[];
  background: string[];
  valueProps: { title: string; description: string; metric?: string }[];
  keyOutcomes: string[];
  structure: ProjectStructure;
  milestones: Milestone[];
  gantt: GanttItem[];
  team: TeamMember[];
  documents: DocumentItem[];
  risks: RiskItem[];
  metrics: MetricBlock;
  retrospectives: RetrospectiveItem[];
  deepDive?: RetrospectiveDeepDive;
  collaborators?: number;
  overviewVideo?: OverviewVideoBlock;
  timelineEmbed?: TimelineEmbedBlock;
  operationScheme?: OperationSchemeBlock;
  /** 为 true 时 Overview 不展示「项目结构图」（如 A 线以文档化背景/目标/成果为主） */
  overviewHideStructureDiagram?: boolean;
  /** Retrospective Tab：站内静态 HTML 看板（iframe 嵌入） */
  retrospectiveLocalDashboard?: RetrospectiveLocalDashboard;
  /**
   * 仅 A 线项目总览 Retrospective：飞书嵌入（见 `RetrospectiveOverviewWikiEmbed`），渲染在
   * `retrospectiveLocalDashboard` 之上；其他 `nav` 下不展示。
   */
  retrospectiveOverviewWikiEmbed?: RetrospectiveOverviewWikiEmbed;
  /** 有退费看板时，紧接在看板 iframe 之后展示的降退费策略模块 */
  retrospectiveRefundReductionPlan?: RetrospectiveRefundReductionPlan;
}

export interface ProjectIndexFile {
  pm: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  projects: ProjectSummary[];
}

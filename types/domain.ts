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

/** Overview 页展示的视频（本地 public 文件或 YouTube 嵌入） */
export interface OverviewVideoBlock {
  /** file：填写放在 `public/` 下的路径，如 `/videos/demo.mp4` */
  mode: "file" | "youtube";
  /** file 模式为 MP4/WebM 等 URL；youtube 模式可为 11 位视频 ID 或完整 watch/embed 链接 */
  src: string;
  poster?: string;
  title?: string;
  caption?: string;
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
}

/** Retrospective Tab 顶部：外链数据看板（如 Moxt）；多数站点禁止 iframe 嵌入，仅提供新窗口打开 */
export interface RetrospectiveBoardLink {
  title: string;
  href: string;
  /** 副文案，如嵌入限制说明 */
  blurb?: string;
}

export interface FishboneBranch {
  category: string;
  causes: string[];
}

/** 运营方案 Tab 内置矢量图类型 */
export type OperationSchemeDiagramId = "courseSystem";

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
  /** 若填写，Hero 右侧卡片显示「项目动态」及环形分布，替代完成度饼图 */
  heroDynamics?: {
    inProgress: number;
    completed: number;
    pending: number;
    risk: number;
  };
  /** Hero 主卡内：横向课程体系条（如 A1–A8「高级算法」） */
  heroCurriculumStrip?: HeroCurriculumStrip;
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
  /** Retrospective Tab 顶部外链看板（如 Moxt） */
  retrospectiveBoard?: RetrospectiveBoardLink;
}

export interface ProjectIndexFile {
  pm: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  projects: ProjectSummary[];
}

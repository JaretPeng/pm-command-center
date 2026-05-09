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
  tags: string[];
  updatedAt: string;
  owner: string;
  excerpt?: string;
  favorite?: boolean;
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

export interface FishboneBranch {
  category: string;
  causes: string[];
}

/** 运营方案 Tab 内容 */
export interface OperationSchemeSection {
  title: string;
  content: string;
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
}

export interface ProjectIndexFile {
  pm: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  projects: ProjectSummary[];
}

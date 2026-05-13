"use client";

/**
 * C 线转 A 线运营路径：橙 / 蓝 / 红分区；避免标题、泳道字、边标签与线重叠
 */
export function CtoAOperationFlowDiagram() {
  /** 顶部留白：标题 → 副标题 → 红区，互不压盖 */
  const TITLE_Y = 22;
  const SUB_Y = 40;
  const RED_BAND_Y = 56;
  const RED_BAND_H = 78;
  const END_C_H = 46;
  const endCY = RED_BAND_Y + (RED_BAND_H - END_C_H) / 2 + 2;

  const LANE_Y = RED_BAND_Y + RED_BAND_H + 10;
  /** 泳道再加大：更高 + 更贴左右边，中间留白略收 */
  const LANE_H = 252;
  const Y_MAIN = LANE_Y + LANE_H / 2 + 2;

  const H_BOX = 56;
  const W_BOX = 148;
  const W_END = 128;
  const H_REC = 52;
  const COL = 172;
  const X0 = 68;

  const cx = (i: number) => X0 + i * COL;
  const c0 = cx(0);
  const c1 = cx(1);
  const c2 = cx(2);
  const c3 = cx(3);
  const c4 = cx(4);
  const c5 = cx(5);

  const endCCenter = (c1 + c2) / 2 + 20;

  const yHi = LANE_Y + 22;
  const yLo = LANE_Y + LANE_H + 36;

  const dw = 46;
  const dh = 38;

  const rect = (cxn: number, y: number, w: number, h: number, fill: string, stroke: string) => {
    const x = cxn - w / 2;
    return { x, y, w, h, fill, stroke };
  };

  const diamondPts = (cxn: number, cy: number) =>
    `${cxn},${cy - dh} ${cxn + dw},${cy} ${cxn},${cy + dh} ${cxn - dw},${cy}`;

  const endC = rect(endCCenter, endCY, 236, END_C_H, "#FEE2E2", "#DC2626");

  const start = rect(c0, Y_MAIN - H_BOX / 2, W_BOX, H_BOX, "#FFEDD5", "#EA580C");
  const intro = rect(c2, Y_MAIN - H_BOX / 2, W_BOX, H_BOX, "#FFEDD5", "#EA580C");
  /** 推荐框：浅底 + 深蓝字，避免白字难辨认 */
  const recAp = rect(c4, yHi - H_REC / 2, W_END, H_REC, "#BFDBFE", "#1D4ED8");
  const endAp = rect(c5, yHi - H_REC / 2, W_END, H_REC, "#DBEAFE", "#2563EB");
  const recA1 = rect(c4, yLo - H_REC / 2, W_END, H_REC, "#93C5FD", "#1E40AF");
  const endA1 = rect(c5, yLo - H_REC / 2, W_END, H_REC, "#DBEAFE", "#2563EB");

  /** 蓝泳道单独加高：覆盖上支路推荐框、下支路与「良好」标签 */
  const laneSplit = c3 - dw - 8;
  const SVG_W = 1180;
  const laneBlueTop = Math.min(LANE_Y, yHi - H_REC / 2 - 18);
  const laneBlueBottom =
    Math.max(LANE_Y + LANE_H, yLo + H_REC / 2 + 12, yLo + 52) + 18;
  const laneOrange = { x: 4, y: LANE_Y, w: laneSplit - 4, h: LANE_H };
  const laneBlue = {
    x: laneSplit,
    y: laneBlueTop,
    w: SVG_W - 8 - laneSplit,
    h: laneBlueBottom - laneBlueTop,
  };
  const SVG_H = Math.max(568, laneBlueBottom + 52, LANE_Y + LANE_H + 100);
  const LEGEND_Y = SVG_H - 36;

  const gapToBox = 6;

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="h-auto w-full max-w-full select-none"
      role="img"
      aria-label="C线转A线运营方案流程图"
      style={{ fontFamily: "system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}
    >
      <defs>
        <marker id="c2a-m-or" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#EA580C" />
        </marker>
        <marker id="c2a-m-bl" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#2563EB" />
        </marker>
        <marker id="c2a-m-re" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#DC2626" />
        </marker>
        <marker id="c2a-m-sl" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="#64748b" />
        </marker>
        <filter id="c2a-sh" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect
        x="0"
        y="0"
        width={SVG_W}
        height={SVG_H}
        rx="12"
        className="fill-slate-50 dark:fill-slate-950/85"
      />

      {/* —— 标题区（单独一层，与下方红区分离） —— */}
      <text
        x={SVG_W / 2}
        y={TITLE_Y}
        textAnchor="middle"
        className="fill-slate-800 text-[14px] font-semibold dark:fill-slate-100"
      >
        C线转A线 · 运营路径
      </text>
      <text
        x={SVG_W / 2}
        y={SUB_Y}
        textAnchor="middle"
        className="fill-slate-500 text-[10px] dark:fill-slate-400"
      >
        从左到右：C 线侧评估与沟通 → 分流「留 C」或「转 A」
      </text>

      {/* —— 泳道底（无大块说明文字，避免与节点叠字） —— */}
      <rect
        x={laneOrange.x}
        y={laneOrange.y}
        width={laneOrange.w}
        height={laneOrange.h}
        rx="10"
        fill="#FFF7ED"
        stroke="#FDBA74"
        strokeWidth="1"
        opacity={0.98}
      />
      <text
        x={laneOrange.x + 10}
        y={laneOrange.y + 16}
        className="fill-orange-900 text-[10px] font-semibold dark:fill-orange-200"
      >
        ① C线侧（橙）
      </text>

      <rect
        x={laneBlue.x}
        y={laneBlue.y}
        width={laneBlue.w}
        height={laneBlue.h}
        rx="10"
        fill="#EFF6FF"
        stroke="#BFDBFE"
        strokeWidth="1"
        opacity={0.98}
      />
      <text
        x={laneBlue.x + laneBlue.w - 10}
        y={laneBlue.y + 16}
        textAnchor="end"
        className="fill-blue-900 text-[10px] font-semibold dark:fill-blue-200"
      >
        ② 转 A（蓝）
      </text>

      {/* 泳道角标说明：放在左右下角空白处 */}
      <text
        x={laneOrange.x + 10}
        y={laneOrange.y + laneOrange.h - 8}
        className="fill-orange-800/85 text-[9px] dark:fill-orange-300/90"
      >
        入线 → 评估 → 介绍班型
      </text>
      <text
        x={laneBlue.x + laneBlue.w - 10}
        y={laneBlue.y + laneBlue.h - 8}
        textAnchor="end"
        className="fill-blue-800/85 text-[9px] dark:fill-blue-300/90"
      >
        测试 → 推荐班型 → 单报
      </text>

      {/* —— 留 C 红区（整体下移，不与标题叠） —— */}
      <rect
        x={endC.x - 28}
        y={RED_BAND_Y}
        width={endC.w + 56}
        height={RED_BAND_H}
        rx="10"
        fill="#FEF2F2"
        stroke="#FECACA"
        strokeWidth="1"
      />
      <text
        x={endC.x + endC.w / 2}
        y={RED_BAND_Y + 18}
        textAnchor="middle"
        className="fill-red-800 text-[10px] font-semibold dark:fill-red-300"
      >
        留 C 线 · 出口
      </text>

      {/* —— 连线层（先于节点绘制，线不穿字） —— */}
      <g className="c2a-edges">
        <line
          x1={start.x + start.w}
          y1={Y_MAIN}
          x2={c1 - dw}
          y2={Y_MAIN}
          stroke="#EA580C"
          strokeWidth="2"
          markerEnd="url(#c2a-m-or)"
        />
        <path
          d={`M ${c1} ${Y_MAIN - dh} L ${c1} ${endC.y + endC.h} L ${endC.x + endC.w / 2} ${endC.y + endC.h}`}
          fill="none"
          stroke="#DC2626"
          strokeWidth="2.25"
          markerEnd="url(#c2a-m-re)"
        />
        <line
          x1={c1 + dw}
          y1={Y_MAIN}
          x2={intro.x}
          y2={Y_MAIN}
          stroke="#EA580C"
          strokeWidth="2"
          markerEnd="url(#c2a-m-or)"
        />
        <path
          d={`M ${c2} ${intro.y} L ${c2} ${endC.y + endC.h} L ${endC.x + endC.w / 2} ${endC.y + endC.h}`}
          fill="none"
          stroke="#DC2626"
          strokeWidth="2.25"
          markerEnd="url(#c2a-m-re)"
        />
        <line
          x1={intro.x + intro.w}
          y1={Y_MAIN}
          x2={c3 - dw}
          y2={Y_MAIN}
          stroke="#2563EB"
          strokeWidth="2"
          markerEnd="url(#c2a-m-bl)"
        />
        <path
          d={`M ${c3} ${Y_MAIN - dh} L ${c3} ${yHi} L ${recAp.x} ${yHi}`}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          markerEnd="url(#c2a-m-bl)"
        />
        <path
          d={`M ${c3} ${Y_MAIN + dh} L ${c3} ${yLo} L ${recA1.x} ${yLo}`}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2"
          markerEnd="url(#c2a-m-bl)"
        />
        <line
          x1={recAp.x + recAp.w}
          y1={yHi}
          x2={endAp.x - gapToBox}
          y2={yHi}
          stroke="#64748b"
          strokeWidth="1.75"
          markerEnd="url(#c2a-m-sl)"
        />
        <line
          x1={recA1.x + recA1.w}
          y1={yLo}
          x2={endA1.x - gapToBox}
          y2={yLo}
          stroke="#64748b"
          strokeWidth="1.75"
          markerEnd="url(#c2a-m-sl)"
        />
      </g>

      {/* —— 节点层 —— */}
      <g filter="url(#c2a-sh)">
        <rect {...endC} rx="10" strokeWidth="2" />
        <text
          x={endC.x + endC.w / 2}
          y={endC.y + endC.h / 2 + 5}
          textAnchor="middle"
          className="fill-red-900 text-[12px] font-bold dark:fill-red-100"
        >
          单报C线
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <rect {...start} rx="10" strokeWidth="2" />
        <text x={c0} y={Y_MAIN - 2} textAnchor="middle" className="fill-orange-950 text-[11px] font-bold">
          C6–C7
        </text>
        <text x={c0} y={Y_MAIN + 14} textAnchor="middle" className="fill-orange-900 text-[10px]">
          五年级以上
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <polygon points={diamondPts(c1, Y_MAIN)} fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />
        <text x={c1} y={Y_MAIN - 8} textAnchor="middle" className="fill-orange-950 text-[10px] font-semibold">
          班主任评估
        </text>
        <text x={c1} y={Y_MAIN + 8} textAnchor="middle" className="fill-orange-950 text-[10px] font-semibold">
          转A可能性
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <rect {...intro} rx="10" strokeWidth="2" />
        <text x={c2} y={Y_MAIN + 5} textAnchor="middle" className="fill-orange-950 text-[11px] font-bold">
          介绍A线与C线
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <polygon points={diamondPts(c3, Y_MAIN)} fill="#BFDBFE" stroke="#2563EB" strokeWidth="2" />
        <text x={c3} y={Y_MAIN - 4} textAnchor="middle" className="fill-blue-950 text-[9px] font-semibold">
          数学+逻辑
        </text>
        <text x={c3} y={Y_MAIN + 10} textAnchor="middle" className="fill-blue-950 text-[9px] font-semibold">
          测试
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <rect {...recAp} rx="10" strokeWidth="1.5" />
        <text
          x={recAp.x + recAp.w / 2}
          y={recAp.y + recAp.h / 2 + 5}
          textAnchor="middle"
          className="fill-blue-950 text-[11px] font-bold"
        >
          推荐A+1转线
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <rect {...endAp} rx="10" strokeWidth="2" />
        <text
          x={endAp.x + endAp.w / 2}
          y={endAp.y + endAp.h / 2 + 5}
          textAnchor="middle"
          className="fill-blue-950 text-[11px] font-bold"
        >
          单报A+1
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <rect {...recA1} rx="10" strokeWidth="1.5" />
        <text
          x={recA1.x + recA1.w / 2}
          y={recA1.y + recA1.h / 2 + 5}
          textAnchor="middle"
          className="fill-blue-950 text-[11px] font-bold"
        >
          推荐A1转线
        </text>
      </g>

      <g filter="url(#c2a-sh)">
        <rect {...endA1} rx="10" strokeWidth="2" />
        <text
          x={endA1.x + endA1.w / 2}
          y={endA1.y + endA1.h / 2 + 5}
          textAnchor="middle"
          className="fill-blue-950 text-[11px] font-bold"
        >
          单报A1
        </text>
      </g>

      {/* —— 边标签（最后绘制；位置避开箭头与节点） —— */}
      <g className="c2a-edge-labels pointer-events-none">
        <rect
          x={c1 - dw - 62}
          y={Y_MAIN - dh - 24}
          width="52"
          height="18"
          rx="4"
          fill="#FEE2E2"
          stroke="#F87171"
          strokeWidth="1"
        />
        <text
          x={c1 - dw - 36}
          y={Y_MAIN - dh - 12}
          textAnchor="middle"
          className="fill-red-800 text-[9px] font-semibold dark:fill-red-200"
        >
          无可能
        </text>

        <rect
          x={(c1 + dw + intro.x) / 2 - 28}
          y={Y_MAIN + 18}
          width="56"
          height="18"
          rx="4"
          fill="#FFEDD5"
          stroke="#FB923C"
          strokeWidth="1"
        />
        <text
          x={(c1 + dw + intro.x) / 2}
          y={Y_MAIN + 30}
          textAnchor="middle"
          className="fill-orange-900 text-[9px] font-semibold"
        >
          有可能
        </text>

        <rect
          x={c2 - 96}
          y={(intro.y + endC.y + endC.h) / 2 - 9}
          width="88"
          height="18"
          rx="4"
          fill="#FEE2E2"
          stroke="#F87171"
          strokeWidth="1"
        />
        <text
          x={c2 - 52}
          y={(intro.y + endC.y + endC.h) / 2 + 3}
          textAnchor="middle"
          className="fill-red-800 text-[9px] font-semibold dark:fill-red-200"
        >
          对A不感兴趣
        </text>

        <rect
          x={(intro.x + intro.w + c3 - dw) / 2 - 34}
          y={Y_MAIN + 18}
          width="68"
          height="18"
          rx="4"
          fill="#DBEAFE"
          stroke="#60A5FA"
          strokeWidth="1"
        />
        <text
          x={(intro.x + intro.w + c3 - dw) / 2}
          y={Y_MAIN + 30}
          textAnchor="middle"
          className="fill-blue-900 text-[9px] font-semibold dark:fill-blue-200"
        >
          对A感兴趣
        </text>

        <rect
          x={c3 + dw + 8}
          y={(Y_MAIN - dh + yHi) / 2 - 9}
          width="44"
          height="18"
          rx="4"
          fill="#DBEAFE"
          stroke="#60A5FA"
          strokeWidth="1"
        />
        <text
          x={c3 + dw + 30}
          y={(Y_MAIN - dh + yHi) / 2 + 3}
          textAnchor="middle"
          className="fill-blue-900 text-[9px] font-semibold dark:fill-blue-200"
        >
          优秀
        </text>

        <rect
          x={c3 + dw + 8}
          y={yLo + 30}
          width="44"
          height="18"
          rx="4"
          fill="#DBEAFE"
          stroke="#60A5FA"
          strokeWidth="1"
        />
        <text
          x={c3 + dw + 30}
          y={yLo + 42}
          textAnchor="middle"
          className="fill-blue-900 text-[9px] font-semibold dark:fill-blue-200"
        >
          良好
        </text>
      </g>

      <g transform={`translate(40, ${LEGEND_Y})`}>
        <rect x="0" y="-10" width="14" height="14" rx="3" fill="#FFEDD5" stroke="#EA580C" strokeWidth="1.5" />
        <text x="22" y="1" className="fill-slate-600 text-[10px] dark:fill-slate-400">
          橙：C线侧沟通与判断
        </text>
        <rect x="168" y="-10" width="14" height="14" rx="3" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
        <text x="190" y="1" className="fill-slate-600 text-[10px] dark:fill-slate-400">
          蓝：转A测试与班型动作
        </text>
        <rect x="360" y="-10" width="14" height="14" rx="3" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
        <text x="382" y="1" className="fill-slate-600 text-[10px] dark:fill-slate-400">
          红：留在C线 · 单报C
        </text>
      </g>
    </svg>
  );
}

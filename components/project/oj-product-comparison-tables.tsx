"use client";

import type { ReactNode } from "react";

function Mark({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-emerald-600 dark:text-emerald-400" aria-label="具备">
      ✅
    </span>
  ) : (
    <span className="text-red-600 dark:text-red-400" aria-label="缺失或不足">
      ❌
    </span>
  );
}

function Cell({ children }: { children: ReactNode }) {
  return (
    <td className="border border-border/80 bg-background/40 p-2.5 align-top text-[12px] leading-relaxed text-muted-foreground sm:p-3 sm:text-[13px] sm:leading-relaxed">
      {children}
    </td>
  );
}

function Th({
  children,
  narrow,
}: {
  children: ReactNode;
  narrow?: boolean;
}) {
  return (
    <th
      scope="col"
      className={`border border-border/80 bg-muted/50 px-2.5 py-2 text-left text-[11px] font-semibold text-foreground sm:px-3 sm:text-xs ${
        narrow ? "w-[5.5rem] sm:w-24" : ""
      }`}
    >
      {children}
    </th>
  );
}

export function OjProductComparisonTables() {
  return (
    <div className="mt-2 space-y-8">
      <section className="min-w-0">
        <h4 className="mb-2 text-xs font-semibold tracking-tight text-foreground sm:text-sm">
          一期产品对比分析
        </h4>
        <div className="overflow-x-auto rounded-xl border border-border/80">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <Th narrow>分析维度</Th>
                <Th narrow>子维度</Th>
                <Th>猿编程 OJ（YBC）</Th>
                <Th>核桃编程 OJ（HT）</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Cell>
                  <span className="font-medium text-foreground">功能</span>
                </Cell>
                <Cell>
                  <span className="font-medium text-foreground/90">比赛积分</span>
                </Cell>
                <Cell>
                  <Mark ok /> 具备比赛积分排行榜
                </Cell>
                <Cell>
                  <Mark ok={false} /> 无积分排行榜
                </Cell>
              </tr>
              <tr>
                <Cell>功能</Cell>
                <Cell>
                  <span className="font-medium text-foreground/90">AI 智能推题</span>
                </Cell>
                <Cell>
                  <Mark ok /> 四类策略：「用户训练」「用户做题记录」「新题推荐」「全局推荐」，可个性化、有针对性
                </Cell>
                <Cell>
                  <Mark ok={false} /> 仅两类：「真题」「新题」，面向全部用户推送，缺少个性化与针对性
                </Cell>
              </tr>
              <tr>
                <Cell>内容</Cell>
                <Cell>
                  <span className="font-medium text-foreground/90">精选训练</span>
                </Cell>
                <Cell>
                  <p>
                    <Mark ok /> 覆盖基础语法、CSP-J、CSP-S 全部算法与数据结构
                  </p>
                  <p className="mt-1.5">
                    <Mark ok /> 题目按难度分级，覆盖各知识点常见考法
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 题目暂缺题解说明
                  </p>
                </Cell>
                <Cell>
                  <p>
                    <Mark ok={false} /> 题目未按难度梳理
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 分类仅到 CSP-J；题目缺视频题解，部分缺文字题解
                  </p>
                </Cell>
              </tr>
              <tr>
                <Cell>内容</Cell>
                <Cell>
                  <span className="font-medium text-foreground/90">题库</span>
                </Cell>
                <Cell>
                  <p>
                    <Mark ok /> 覆盖各难度，满足分层学员练习
                  </p>
                  <p className="mt-1.5">
                    <Mark ok /> 知识点标签更准，筛选更高效
                  </p>
                  <p className="mt-1.5">
                    <Mark ok /> 题面含说明与「知识点串讲」
                  </p>
                  <p className="mt-1.5">
                    <Mark ok /> 综合题含中文伪代码，便于翻译为代码
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 当前 2500+ 题
                  </p>
                </Cell>
                <Cell>
                  <p>
                    <Mark ok /> 33715 题
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 外导题未充分筛查，重复题较多
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 题目缺少知识点标签
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 题面无「知识点串讲」
                  </p>
                </Cell>
              </tr>
              <tr>
                <Cell>运营</Cell>
                <Cell>
                  <span className="font-medium text-foreground/90">
                    联动公立校 &amp; 书籍作者
                  </span>
                </Cell>
                <Cell>
                  <Mark ok /> 已与 3 所中小学、1 位 C++ 图书作者建立合作
                </Cell>
                <Cell>
                  <p>
                    <Mark ok /> 据公开信息与调研，核桃侧针对 OJ 的专项动作尚不具体
                  </p>
                  <p className="mt-1.5">
                    <Mark ok /> 核桃教研出版《全国青少年 CSP-J 编程大赛真题解析》等，联合创始人兼 CTO
                    王宇航任总策划，图书配套核桃 OJ 在线测评（教材与 OJ 联动）
                  </p>
                </Cell>
              </tr>
              <tr>
                <Cell>运营</Cell>
                <Cell>
                  <span className="font-medium text-foreground/90">自媒体运营</span>
                </Cell>
                <Cell>
                  <Mark ok /> 新开微信公众号、B 站、抖音账号运营
                </Cell>
                <Cell>
                  <Mark ok={false} /> 仅运营官方微信公众号
                </Cell>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="min-w-0">
        <h4 className="mb-2 text-xs font-semibold tracking-tight text-foreground sm:text-sm">
          二期产品对比分析
        </h4>
        <div className="overflow-x-auto rounded-xl border border-border/80">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr>
                <Th narrow>分析维度</Th>
                <Th>猿编程 OJ（YBC）</Th>
                <Th>核桃编程 OJ（HT）</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Cell>
                  <span className="font-medium text-foreground">功能</span>
                </Cell>
                <Cell>
                  在一期能力基础上：<Mark ok /> 上线 VS Code 插件等工程化学习体验
                </Cell>
                <Cell>
                  <span className="text-muted-foreground/80">—</span>
                </Cell>
              </tr>
              <tr>
                <Cell>内容</Cell>
                <Cell>
                  在一期能力基础上：
                  <Mark ok /> 精选题单持续更新<strong className="text-foreground/90">文字与视频题解</strong>
                </Cell>
                <Cell>
                  <Mark ok={false} /> 题目缺少视频题解，部分题目缺少文字题解
                </Cell>
              </tr>
              <tr>
                <Cell>运营</Cell>
                <Cell>
                  <p>
                    <Mark ok /> 签约 NOI 金牌选手：首页导师介绍，并组织相关活动 / 课程
                  </p>
                  <p className="mt-1.5">
                    <Mark ok /> 合作拓展至 15 所中小学、5 位 C++ 图书作者
                  </p>
                  <p className="mt-1.5">
                    <Mark ok /> 建设专业问答社区：提问、解题、发文、分享学习与比赛经验
                  </p>
                </Cell>
                <Cell>
                  <p>
                    <Mark ok={false} /> 无独立活动 / 课程栏目
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 未见核桃 OJ 与校队的清晰合作披露
                  </p>
                  <p className="mt-1.5">
                    <Mark ok={false} /> 社区以灌水闲聊与学术交流为主，非问答型专业社区
                  </p>
                </Cell>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

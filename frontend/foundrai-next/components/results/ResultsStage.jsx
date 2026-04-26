"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText,
  ExternalLink,
  Zap,
  RotateCcw,
  GitBranch,
  Loader2,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { AGENTS, PLAN_SECTIONS } from "@/lib/utils";
import { FeedCard } from "@/components/active/LiveFeed";

// ─── Agent strip ───────────────────────────────────────────────────────────
function AgentStrip() {
  const { agentStates, consensusScore } = useAppStore();
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.06] flex-shrink-0 flex-wrap">
      <span className="text-[10px] font-semibold text-slate-600 tracking-widest">
        AGENTS
      </span>
      {["CEO", "Developer", "Finance", "Marketing", "Risk", "Synthesis"].map(
        (id) => {
          const cfg = AGENTS[id];
          const st = agentStates[id];
          return (
            <div
              key={id}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium"
              style={{
                borderColor: `${cfg.color}40`,
                background: `${cfg.color}10`,
                color: cfg.color,
              }}
            >
              {cfg.emoji} {cfg.label}
              {st?.score !== undefined && (
                <span className="opacity-60 text-[10px] ml-0.5">
                  • {st.score}/10
                </span>
              )}
            </div>
          );
        },
      )}
      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <div className="text-[9px] text-slate-600 font-fira tracking-widest">
            CONSENSUS
          </div>
          <div className="text-lg font-extrabold text-white leading-none">
            {consensusScore.toFixed(1)}
            <span className="text-xs text-slate-600 font-normal"> /10</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          ALL ALIGNED
        </div>
      </div>
    </div>
  );
}

// ─── Tab content — falls back to livingDoc if finalPlan section is empty ───
function TabContent({ sectionKey, plan, agentId }) {
  const cfg = AGENTS[agentId];
  // BUGFIX: If _parse_plan() missed a section in finalPlan (e.g. Marketing/Risk),
  // fall back to livingDoc which was filled progressively during simulation.
  const { livingDoc } = useAppStore();
  const content = plan?.[sectionKey] || livingDoc?.[sectionKey] || "";
  const paras = content.split("\n").filter((p) => p.trim());

  return (
    <div className="animate-fade-in p-5 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{cfg?.emoji}</span>
        <div>
          <div
            className="text-xs font-bold tracking-widest"
            style={{ color: cfg?.color }}
          >
            {cfg?.label?.toUpperCase()}
          </div>
          <div className="text-slate-600 text-[11px]">{cfg?.role}</div>
        </div>
      </div>

      {paras.length > 0 ? (
        <div className="space-y-3">
          {paras.map((p, i) => {
            // Render markdown table rows as a simple table
            if (p.trim().startsWith("|") && p.trim().endsWith("|")) {
              return null; // handled below as a block
            }
            // Bullet points
            if (p.trim().startsWith("- ") || p.trim().startsWith("* ")) {
              return (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-600 mt-0.5 flex-shrink-0">•</span>
                  <p
                    className="text-sm text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: p
                        .slice(2)
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-white font-semibold">$1</strong>',
                        ),
                    }}
                  />
                </div>
              );
            }
            return (
              <p
                key={i}
                className="text-sm text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: p.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="text-white font-semibold">$1</strong>',
                  ),
                }}
              />
            );
          })}

          {/* Render any markdown table found in the content */}
          {(() => {
            const tableLines = paras.filter(
              (p) => p.trim().startsWith("|") && p.trim().endsWith("|"),
            );
            if (tableLines.length < 2) return null;
            const [headerRow, , ...dataRows] = tableLines; // skip separator row
            const headers = headerRow.split("|").filter((c) => c.trim());
            const rows = dataRows.map((r) =>
              r.split("|").filter((c) => c.trim()),
            );
            return (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      {headers.map((h, i) => (
                        <th
                          key={i}
                          className="text-left px-3 py-2 font-semibold text-slate-300 border-b border-white/[0.1] bg-white/[0.03]"
                        >
                          {h.trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className={ri % 2 === 0 ? "bg-white/[0.01]" : ""}
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-3 py-2 text-slate-400 border-b border-white/[0.04]"
                          >
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-3 rounded skeleton-shimmer ${i === 4 ? "w-1/2" : i === 3 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Deploy panel ──────────────────────────────────────────────────────────
function DeployPanel() {
  const { idea, finalPlan, deploymentUrl } = useAppStore();

  const defaultName =
    idea
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 4)
      .join("-") || "my-startup";

  const [repoName, setRepoName] = useState(defaultName);
  const [deploying, setDeploying] = useState(false);
  const [repoUrl, setRepoUrl] = useState(deploymentUrl || "");
  const [error, setError] = useState("");

  const handleInput = (v) =>
    setRepoName(
      v
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-/, ""),
    );

  const handleDeploy = async () => {
    if (!repoName.trim() || deploying) return;
    setDeploying(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/approve-deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_name: repoName.trim(),
          idea,
          plan: finalPlan || {},
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const url = data.repo_url || `https://github.com/your-org/${repoName}`;
      setRepoUrl(url);
      useAppStore.getState().handleEvent({ type: "deployment_complete", url });
    } catch (e) {
      setError(e.message || "Deployment failed");
    } finally {
      setDeploying(false);
    }
  };

  if (repoUrl)
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="text-emerald-400 text-xs font-bold mb-2">
          ✅ Repo created!
        </div>
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-400 hover:text-indigo-300 text-xs font-fira underline break-all flex items-center gap-1"
        >
          <ExternalLink size={11} />
          {repoUrl}
        </a>
      </div>
    );

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
      <div className="text-[10px] font-semibold text-slate-500 tracking-widest font-fira">
        DEPLOY TO GITHUB
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 focus-within:border-indigo-500/40 transition-colors">
        <GitBranch size={13} className="text-slate-600 flex-shrink-0" />
        <span className="text-slate-600 text-xs font-fira whitespace-nowrap">
          your-org /
        </span>
        <input
          type="text"
          value={repoName}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="my-startup"
          disabled={deploying}
          className="flex-1 bg-transparent text-white text-xs font-fira outline-none placeholder-slate-700 min-w-0"
        />
      </div>
      <div className="space-y-0.5 text-[10px] text-slate-700 font-fira">
        <p>→ README.md with real tech stack table + full plan</p>
        <p>→ docker-compose.yml with real services</p>
        <p>→ .env.example + app/main.py + requirements.txt</p>
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 font-fira">
          ⚠️ {error}
        </div>
      )}
      <button
        onClick={handleDeploy}
        disabled={!repoName.trim() || deploying}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-all"
      >
        {deploying ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Creating Repo…
          </>
        ) : (
          <>
            <GitBranch size={13} />
            Create Project & Push Code
          </>
        )}
      </button>
    </div>
  );
}

// ─── Markdown table → HTML table helper ───────────────────────────────────
function buildHtmlTable(tableLines) {
  if (tableLines.length < 2) return "";
  const headers = tableLines[0].split("|").filter((c) => c.trim());
  const dataRows = tableLines
    .slice(2)
    .map((r) => r.split("|").filter((c) => c.trim()));
  const headHtml = headers.map((h) => `<th>${h.trim()}</th>`).join("");
  const bodyHtml = dataRows
    .map((r) => `<tr>${r.map((c) => `<td>${c.trim()}</td>`).join("")}</tr>`)
    .join("");
  return `<table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
}

// ─── Render mixed markdown (paras + bullets + tables) to HTML ──────────────
function renderMarkdownToHtml(text) {
  const lines = text.split("\n");
  let html = "";
  let tableBuffer = [];
  let ulOpen = false;

  const flushTable = () => {
    if (tableBuffer.length >= 2) {
      html += buildHtmlTable(tableBuffer);
    }
    tableBuffer = [];
  };
  const flushUl = () => {
    if (ulOpen) {
      html += "</ul>";
      ulOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushUl();
      continue;
    }

    // Markdown table row
    if (line.startsWith("|") && line.endsWith("|")) {
      flushUl();
      tableBuffer.push(line);
      continue;
    }

    // Flush table if we hit non-table content
    if (tableBuffer.length) {
      flushTable();
    }

    // Bullet point
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!ulOpen) {
        html += "<ul>";
        ulOpen = true;
      }
      const inner = line
        .slice(2)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      html += `<li>${inner}</li>`;
      continue;
    }

    flushUl();
    const inner = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html += `<p>${inner}</p>`;
  }

  flushUl();
  if (tableBuffer.length) flushTable();
  return html;
}

// ─── PDF builder — includes full discussion + real tech table ──────────────
function buildAndDownloadPdf(idea, consensusScore, finalPlan, livingDoc, feed) {
  // Best-content getter: finalPlan first, then livingDoc fallback
  const get = (key) => finalPlan?.[key] || livingDoc?.[key] || "";

  // ── Plan sections HTML ─────────────────────────────────────────────────
  const planSectionsHtml = PLAN_SECTIONS.map((s) => {
    const cfg = AGENTS[s.agent];
    const content = get(s.key);
    if (!content) return "";
    return `
      <div class="section">
        <h2>${cfg?.emoji || ""} ${s.label}</h2>
        <div class="agent-tag" style="color:${cfg?.color}">${cfg?.label} — ${cfg?.role}</div>
        <div class="content">${renderMarkdownToHtml(content)}</div>
      </div>`;
  })
    .filter(Boolean)
    .join("");

  // ── Full agent discussion log ──────────────────────────────────────────
  const discussionItems = feed
    .filter(
      (e) => !["agent_thinking", "ping", "consensus_update"].includes(e.type),
    )
    .map((e) => {
      const cfg = e.agent ? AGENTS[e.agent] : null;
      const typeMap = {
        proposal: "PROPOSAL",
        critique: "CRITIQUE",
        revision: "REVISION",
        re_score: "RE-SCORE",
        final_plan: "SYNTHESIS",
        consensus_reached: "CONSENSUS",
        monitor_alert: "MONITOR",
        auto_revision: "AUTO-REVISION",
      };
      const badge = typeMap[e.type] || e.type.toUpperCase();

      if (e.type === "phase_change") {
        const labels = {
          1: "CEO Proposal",
          2: "Parallel Critique",
          3: "Negotiation & Revision",
          4: "Synthesis",
        };
        return `<div class="phase-divider">⚙️ PHASE ${e.phase} — ${labels[e.phase] || ""}</div>`;
      }
      if (e.type === "consensus_reached") {
        return `<div class="event consensus"><strong>✅ CONSENSUS REACHED — Score: ${e.final_score}/10</strong><br>Threshold 7.5 crossed.</div>`;
      }
      if (!e.content) return "";

      const scoreStr =
        e.score !== undefined
          ? ` — <strong style="color:${e.score >= 7.5 ? "#059669" : e.score >= 5 ? "#d97706" : "#dc2626"}">${e.score}/10</strong>`
          : "";
      const roundStr = e.round ? ` [ROUND ${e.round}]` : "";
      const toolStr = e.tool_name
        ? ` <span class="tool-tag">via ${e.tool_name}</span>`
        : "";

      return `
        <div class="event" style="border-left-color:${cfg?.color || "#334155"}">
          <div class="event-header">
            ${cfg?.emoji || "⚙️"} <span style="color:${cfg?.color || "#64748b"}">${cfg?.label || "SYSTEM"}</span>
            <span class="badge">[${badge}]</span>${roundStr}${toolStr}${scoreStr}
          </div>
          <div class="event-content">${e.content}</div>
        </div>`;
    })
    .filter(Boolean)
    .join("");

  const discussionHtml = discussionItems
    ? `<div class="section"><h2>🗣️ Full Agent Discussion Log</h2><div class="discussion-log">${discussionItems}</div></div>`
    : "";

  // ── HTML document ──────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<title>FoundrAI Business Plan — ${idea}</title>
<style>
  body { font-family:'Helvetica Neue',Arial,sans-serif; max-width:860px; margin:0 auto; padding:48px 40px; color:#1e293b; font-size:14px; line-height:1.6; }
  .header { border-bottom:3px solid #6366f1; padding-bottom:20px; margin-bottom:32px; }
  h1 { font-size:30px; color:#1e293b; margin:0 0 8px; }
  .meta { color:#64748b; font-size:13px; }
  .score-badge { display:inline-block; background:#6366f1; color:white; padding:3px 14px; border-radius:20px; font-weight:700; font-size:13px; margin-left:10px; }
  .section { margin-bottom:36px; page-break-inside:avoid; }
  h2 { font-size:18px; color:#4338ca; margin:0 0 4px; border-left:4px solid #6366f1; padding-left:12px; }
  .agent-tag { font-size:11px; color:#94a3b8; margin-bottom:12px; padding-left:16px; }
  .content p { margin:6px 0; color:#334155; }
  .content ul { margin:6px 0 6px 20px; }
  .content li { color:#334155; margin:4px 0; }
  table { width:100%; border-collapse:collapse; margin:12px 0; font-size:12px; }
  th { background:#f1f5f9; padding:8px 10px; text-align:left; font-weight:700; color:#475569; border:1px solid #e2e8f0; }
  td { padding:7px 10px; border:1px solid #e2e8f0; color:#334155; vertical-align:top; }
  tr:nth-child(even) td { background:#f8fafc; }
  .discussion-log { margin-top:12px; }
  .phase-divider { text-align:center; font-size:11px; font-weight:700; color:#818cf8; letter-spacing:2px; padding:10px 0; border-top:1px dashed #e2e8f0; border-bottom:1px dashed #e2e8f0; margin:16px 0; }
  .event { border-left:3px solid #334155; padding:10px 14px; margin-bottom:12px; background:#f8fafc; border-radius:0 8px 8px 0; page-break-inside:avoid; }
  .event.consensus { border-left-color:#059669; background:#f0fdf4; }
  .event-header { font-size:12px; font-weight:700; margin-bottom:5px; }
  .badge { display:inline-block; background:#e2e8f0; color:#475569; font-size:10px; padding:1px 6px; border-radius:4px; margin:0 4px; }
  .tool-tag { font-size:10px; color:#0891b2; font-style:italic; }
  .event-content { font-size:12px; color:#475569; white-space:pre-wrap; line-height:1.6; font-family:'Courier New',monospace; }
  .footer { margin-top:48px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:11px; color:#94a3b8; text-align:center; }
  @media print { body { padding:20px; } .section { page-break-inside:avoid; } }
</style>
</head><body>
<div class="header">
  <h1>📋 FoundrAI Business Plan</h1>
  <div class="meta"><strong>Idea:</strong> ${idea}<span class="score-badge">Consensus ${consensusScore.toFixed(1)}/10</span></div>
  <div class="meta" style="margin-top:6px">Generated by FoundrAI 2.0 — Autonomous Business Validation Engine</div>
</div>
${planSectionsHtml}
${discussionHtml}
<div class="footer">Generated by FoundrAI 2.0 · All agent critiques grounded in live market data</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win)
    setTimeout(() => {
      win.focus();
      win.print();
    }, 900);
}

// ─── Full feed for right column ────────────────────────────────────────────
function FullFeed() {
  const { feed } = useAppStore();
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-slate-600" />
        <span className="text-[11px] font-semibold text-slate-500 tracking-widest">
          AGENT DISCUSSION
        </span>
        <span className="ml-auto text-[10px] font-fira text-slate-700">
          {feed.length} events
        </span>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {feed.length === 0 ? (
          <p className="text-slate-700 text-xs font-fira text-center mt-8">
            No events recorded.
          </p>
        ) : (
          feed.map((evt) => <FeedCard key={evt.id} event={evt} />)
        )}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────
export default function ResultsStage() {
  const { finalPlan, livingDoc, consensusScore, idea, feed, reset } =
    useAppStore();
  const [activeTab, setActiveTab] = useState("Executive Summary");
  const [fastForwarded, setFastForwarded] = useState(false);

  // Resizable split — left 60%
  const [leftPct, setLeftPct] = useState(60);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const raw = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftPct(Math.min(80, Math.max(30, raw)));
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const activeCfg = PLAN_SECTIONS.find((s) => s.key === activeTab);

  const handleFastForward = () => {
    if (fastForwarded) return;
    setFastForwarded(true);
    const store = useAppStore.getState();
    store.handleEvent({
      type: "monitor_alert",
      id: Date.now(),
      content:
        '🚨 New competitor detected: "Digits" launched on ProductHunt today.',
    });
    store.handleEvent({
      type: "auto_revision",
      id: Date.now() + 1,
      content: "🔄 Strategy section updated. Differentiation angle revised.",
    });
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
      <AgentStrip />

      {/* Resizable two-column layout */}
      <div
        ref={containerRef}
        className="flex flex-1 min-h-0 gap-0"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* LEFT: tabs + plan content */}
        <div
          className="flex flex-col min-w-0 border-r border-white/[0.06]"
          style={{ width: `calc(${leftPct}% - 6px)`, flexShrink: 0 }}
        >
          {/* Tab bar */}
          <div className="flex border-b border-white/[0.06] flex-shrink-0 overflow-x-auto px-3">
            {PLAN_SECTIONS.map((s) => {
              const cfg = AGENTS[s.agent];
              const hasContent = !!(finalPlan?.[s.key] || livingDoc?.[s.key]);
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveTab(s.key)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                    activeTab === s.key
                      ? "text-white"
                      : "border-transparent text-slate-600 hover:text-slate-400"
                  }`}
                  style={
                    activeTab === s.key ? { borderBottomColor: cfg?.color } : {}
                  }
                >
                  {cfg?.emoji} {s.label}
                  {/* green dot if content ready */}
                  {hasContent && (
                    <span className="w-1 h-1 rounded-full bg-emerald-400 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-0">
            <TabContent
              sectionKey={activeTab}
              plan={finalPlan}
              agentId={activeCfg?.agent || "CEO"}
            />
          </div>

          {/* PDF + reset bar */}
          <div className="flex-shrink-0 px-5 py-3 border-t border-white/[0.06] flex items-center gap-3">
            <button
              onClick={() =>
                buildAndDownloadPdf(
                  idea,
                  consensusScore,
                  finalPlan,
                  livingDoc,
                  feed,
                )
              }
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
            >
              <FileText size={14} /> Download PDF + Discussion
            </button>
            <span className="text-[10px] text-slate-700 font-fira">
              full agent log + tech table
            </span>
            <button
              onClick={reset}
              className="ml-auto flex items-center gap-1.5 text-xs text-slate-600 hover:text-white transition-colors"
            >
              <RotateCcw size={12} /> New Simulation
            </button>
          </div>
        </div>

        {/* Drag handle */}
        <div
          className="flex-shrink-0 flex items-center justify-center cursor-col-resize group"
          style={{ width: 12, zIndex: 10 }}
          onMouseDown={onMouseDown}
        >
          <div className="w-0.5 h-16 rounded-full bg-white/10 group-hover:bg-indigo-500/60 transition-colors duration-150" />
        </div>

        {/* RIGHT: full feed + deploy */}
        <div
          className="flex flex-col flex-shrink-0 min-h-0"
          style={{ width: `calc(${100 - leftPct}% - 6px)` }}
        >
          <div className="flex-1 min-h-0 border-b border-white/[0.06]">
            <FullFeed />
          </div>
          <div className="flex-shrink-0 p-4">
            <DeployPanel />
          </div>
        </div>
      </div>

      {/* Monitor bar */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 py-2.5 border-t border-white/[0.06] bg-[#0a0a0f]/80 flex-wrap">
        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          Auto-Monitor Active
        </span>
        <span className="text-slate-700 text-xs">|</span>
        <span className="text-slate-600 text-xs font-fira truncate max-w-[180px]">
          &quot;{idea}&quot;
        </span>
        <span className="text-slate-700 text-xs">|</span>
        <span className="text-slate-700 text-xs">Last checked: 2 mins ago</span>
        <button
          onClick={handleFastForward}
          disabled={fastForwarded}
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500/10 transition-all disabled:opacity-40"
        >
          <Zap size={11} /> Fast-Forward Demo
        </button>
      </div>
    </div>
  );
}

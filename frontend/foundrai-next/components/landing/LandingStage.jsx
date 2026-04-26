"use client";
import { useState } from "react";
import {
  Send,
  Zap,
  Brain,
  Eye,
  Cpu,
  Rocket,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSimulation } from "@/hooks/useSimulation";
import { TICKER_MESSAGES } from "@/lib/utils";
import ParticleBackground from "@/components/ui/ParticleBackground"; // <-- Imported here

const AGENTS = [
  { emoji: "🧠", label: "CEO", color: "#818cf8" },
  { emoji: "⚡", label: "Dev", color: "#60a5fa" },
  { emoji: "📈", label: "CFO", color: "#34d399" },
  { emoji: "🌐", label: "CMO", color: "#fbbf24" },
  { emoji: "⚠️", label: "Risk", color: "#f87171" },
  { emoji: "⚖️", label: "Legal", color: "#a78bfa" },
];

const FEATURES = [
  {
    Icon: Eye,
    title: "Perceive",
    desc: "Web search, GitHub, Reddit, Google Trends, patent databases — all live.",
    tag: "DATA LAYER",
    accent: "#60a5fa",
  },
  {
    Icon: Cpu,
    title: "Reason",
    desc: "4-phase deliberation: proposal, critique, revision, consensus.",
    tag: "CONSENSUS",
    accent: "#fbbf24",
  },
  {
    Icon: Rocket,
    title: "Act",
    desc: "PDF plan, legal report, CFO charts, influencer list, GitHub repo.",
    tag: "DEPLOYMENT",
    accent: "#a78bfa",
  },
];

const STATS = [
  { value: "6", label: "AI Agents" },
  { value: "5+", label: "Data Sources" },
  { value: "7.5", label: "Consensus Threshold" },
  { value: "<3m", label: "Full Validation" },
];

export default function LandingStage() {
  const { idea, setIdea, fastMode, setFastMode, setInputMode, setStage } =
    useAppStore();
  const { run } = useSimulation();
  const [tab, setTab] = useState("prompt");
  const [launching, setLaunching] = useState(false);

  const handleLaunch = async () => {
    if (!idea.trim() || launching) return;
    setLaunching(true);
    await run();
    setLaunching(false);
  };

  const doubled = [...TICKER_MESSAGES, ...TICKER_MESSAGES];

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-28 pt-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234,179,8,0.05) 0%, transparent 60%), #111111",
      }}
    >
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main UI Wrapper (z-10 ensures it sits above particles) */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Agent pills */}
        <div className="flex items-center gap-2 flex-wrap justify-center mb-8 animate-fade-in">
          <span className="data-label mr-2">6 AGENTS ACTIVE</span>
          {AGENTS.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium font-fira"
              style={{
                border: `1px solid ${a.color}30`,
                background: `${a.color}10`,
                color: a.color,
              }}
            >
              {a.emoji} {a.label}
            </div>
          ))}
        </div>

        {/* Hero text */}
        <div className="text-center max-w-4xl mx-auto mb-10 animate-fade-in-up">
          <h1
            className="font-extrabold tracking-tight leading-[1.04] mb-5"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
          >
            <span style={{ color: "#ede8dc" }}>Autonomous Business</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #f59e0b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Validation Engine.
            </span>
          </h1>
          <p
            className="text-lg leading-relaxed max-w-lg mx-auto"
            style={{ color: "rgba(237,232,220,0.4)", fontWeight: 300 }}
          >
            6 AI agents debate your startup with live market data — then deliver
            a validated plan, legal check, and GitHub repo.
          </p>
        </div>

        {/* Input card */}
        <div
          className="w-full max-w-[640px] animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Tab switcher */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-3 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {[
              { key: "prompt", icon: <Zap size={12} />, label: "Quick Prompt" },
              {
                key: "form",
                icon: <FileText size={12} />,
                label: "Build with Form",
              },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={
                  tab === key
                    ? {
                        background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                        color: "#111",
                        boxShadow: "0 0 0 1px rgba(234,179,8,0.25)",
                      }
                    : { color: "rgba(255,255,255,0.3)" }
                }
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Prompt tab */}
          {tab === "prompt" && (
            <div className="animate-fade-in backdrop-blur-md">
              {/* Terminal box */}
              <div
                className="rounded-xl overflow-hidden mb-3 transition-all duration-300"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(17,17,17,0.6)",
                }}
              >
                {/* macOS bar */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex gap-1.5">
                    {[
                      "rgba(255,95,87,0.7)",
                      "rgba(255,189,46,0.7)",
                      "rgba(40,200,64,0.7)",
                    ].map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <span
                    className="font-fira text-[10px] tracking-widest ml-2"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    FOUNDRAI TERMINAL · v2.0
                  </span>
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse-dot"
                    style={{ background: "#fbbf24" }}
                  />
                </div>

                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your startup idea in plain English…"
                  rows={5}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) handleLaunch();
                  }}
                  className="w-full bg-transparent font-fira text-sm resize-none outline-none leading-relaxed"
                  style={{
                    padding: "16px 20px",
                    color: "rgba(237,232,220,0.8)",
                    caretColor: "#fbbf24",
                  }}
                />

                <div
                  className="flex items-center justify-between px-5 py-2.5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="font-fira text-[10px] tracking-widest"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    ⌘ + ↵ to launch
                  </span>
                  <span
                    className="font-fira text-[10px]"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  >
                    {idea.length} chars
                  </span>
                </div>
              </div>

              {/* Mode + Launch */}
              <div className="flex gap-2">
                {[
                  {
                    key: "fast",
                    label: "Fast Mode",
                    sub: "3 agents · ~30s",
                    icon: <Zap size={13} />,
                    active: fastMode,
                    onClick: () => setFastMode(true),
                  },
                  {
                    key: "deep",
                    label: "Deep Mode",
                    sub: "6 agents",
                    icon: <Brain size={13} />,
                    active: !fastMode,
                    onClick: () => setFastMode(false),
                  },
                ].map(({ key, label, sub, icon, active, onClick }) => (
                  <button
                    key={key}
                    onClick={onClick}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-md"
                    style={
                      active
                        ? {
                            border: "1px solid rgba(234,179,8,0.35)",
                            background: "rgba(234,179,8,0.07)",
                            color: "#fbbf24",
                            boxShadow: "0 0 0 1px rgba(234,179,8,0.15)",
                          }
                        : {
                            border: "1px solid rgba(255,255,255,0.07)",
                            background: "rgba(17,17,17,0.6)",
                            color: "rgba(255,255,255,0.3)",
                          }
                    }
                  >
                    <span style={active ? { color: "#fbbf24" } : {}}>
                      {icon}
                    </span>
                    {label}
                    <span
                      className="text-[10px]"
                      style={{
                        color: active
                          ? "rgba(234,179,8,0.5)"
                          : "rgba(255,255,255,0.18)",
                      }}
                    >
                      {sub}
                    </span>
                  </button>
                ))}

                <button
                  onClick={handleLaunch}
                  disabled={!idea.trim() || launching}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                    color: "#111",
                    boxShadow:
                      "0 0 0 1px rgba(234,179,8,0.35), 0 4px 20px rgba(234,179,8,0.12)",
                    opacity: !idea.trim() || launching ? 0.35 : 1,
                    cursor:
                      !idea.trim() || launching ? "not-allowed" : "pointer",
                  }}
                >
                  {launching ? (
                    <>
                      <span
                        className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
                        style={{
                          borderColor: "rgba(17,17,17,0.3)",
                          borderTopColor: "#111",
                        }}
                      />{" "}
                      Launching…
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Launch
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Form tab */}
          {tab === "form" && (
            <div
              className="animate-fade-in rounded-xl p-8 flex flex-col items-center text-center gap-5 backdrop-blur-md"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(17,17,17,0.6)",
              }}
            >
              {/* Field preview grid */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                {[
                  "Startup Name",
                  "Problem",
                  "Solution",
                  "Stage",
                  "Market",
                  "Audience",
                  "Revenue",
                  "Platform",
                  "Legal Risk",
                ].map((f, i) => (
                  <div
                    key={f}
                    className="rounded-lg px-2.5 py-2.5"
                    style={{
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span
                      className="font-fira text-[9px] tracking-wide block"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {f}
                    </span>
                    <div
                      className="h-1 rounded-full mt-1.5"
                      style={{
                        width: i < 3 ? "75%" : "50%",
                        background:
                          i < 3
                            ? "rgba(234,179,8,0.25)"
                            : "rgba(255,255,255,0.06)",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: "rgba(237,232,220,0.8)" }}
                >
                  11-field structured intake
                </p>
                <p
                  className="text-xs leading-relaxed max-w-xs"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Answer targeted questions — we generate the optimal prompt for
                  all 6 agents.
                </p>
              </div>

              <button
                onClick={() => {
                  setInputMode("form");
                  setStage("intake");
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
                  color: "#111",
                  boxShadow:
                    "0 0 0 1px rgba(234,179,8,0.35), 0 4px 20px rgba(234,179,8,0.12)",
                }}
              >
                <FileText size={14} /> Open Intake Form <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          className="flex items-center gap-8 mt-10 animate-fade-in backdrop-blur-sm"
          style={{ animationDelay: "0.2s" }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-bold text-lg font-fira leading-none"
                style={{ color: "#fbbf24" }}
              >
                {value}
              </div>
              <div className="data-label mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl w-full mt-8 animate-fade-in backdrop-blur-sm"
          style={{ animationDelay: "0.25s" }}
        >
          {FEATURES.map(({ Icon, title, desc, tag, accent }) => (
            <div
              key={title}
              className="relative rounded-xl p-5 overflow-hidden group transition-all duration-300"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(17,17,17,0.5)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `${accent}25`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")
              }
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background: `${accent}12`,
                  border: `1px solid ${accent}20`,
                }}
              >
                <Icon size={16} style={{ color: accent }} />
              </div>
              <div
                className="font-bold text-sm mb-2"
                style={{ color: "rgba(237,232,220,0.85)" }}
              >
                {title}
              </div>
              <p
                className="text-[11px] leading-relaxed font-fira mb-4"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {desc}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="h-px flex-1"
                  style={{ background: `${accent}20` }}
                />
                <span
                  className="font-fira text-[9px] tracking-widest"
                  style={{ color: `${accent}60` }}
                >
                  {tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticker (z-20 ensures it's above particles and UI) */}
      <div
        className="fixed bottom-0 left-0 right-0 h-8 overflow-hidden flex items-center z-20 backdrop-blur-md"
        style={{
          background: "rgba(17,17,17,0.85)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center whitespace-nowrap animate-ticker">
          {doubled.map((msg, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5 px-8 font-fira text-[10px] tracking-wide"
              style={{
                color: "rgba(255,255,255,0.2)",
                borderRight: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "rgba(251,191,36,0.5)" }}
              />
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

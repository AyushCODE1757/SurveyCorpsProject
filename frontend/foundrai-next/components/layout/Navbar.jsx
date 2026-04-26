"use client";
import { Zap, Brain, Star } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function Navbar() {
  const { fastMode, setFastMode, stage, converged } = useAppStore();

  return (
    <header
      style={{
        background: "rgba(17,17,17,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
            boxShadow: "0 0 0 1px rgba(234,179,8,0.25)",
          }}
        >
          <span
            className="font-black text-sm leading-none"
            style={{ color: "#111" }}
          >
            F
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-[15px] tracking-tight">
            FoundrAI
          </span>
          <span
            className="font-fira text-[10px] tracking-widest"
            style={{ color: "rgba(251,191,36,0.6)" }}
          >
            v2.0
          </span>
        </div>
        {converged && (
          <>
            <div
              className="w-px h-4"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="font-fira text-[10px] font-semibold tracking-widest text-emerald-400">
                VERIFIED
              </span>
            </div>
          </>
        )}
      </div>

      {/* Center breadcrumb */}
      {stage !== "landing" && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 font-fira text-[11px]">
          {["landing", "intake", "active", "results"].map((s, i, arr) => (
            <span
              key={s}
              style={{
                color:
                  stage === s
                    ? "#fbbf24"
                    : arr.indexOf(stage) > i
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(255,255,255,0.15)",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {i < arr.length - 1 ? " /" : ""}
            </span>
          ))}
        </div>
      )}

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">
        {/* Mode toggle */}
        <div
          className="flex items-center p-0.5 gap-0.5 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            {
              label: "Fast",
              icon: <Zap size={11} />,
              active: fastMode,
              onClick: () => setFastMode(true),
            },
            {
              label: "Deep",
              icon: <Brain size={11} />,
              active: !fastMode,
              onClick: () => setFastMode(false),
            },
          ].map(({ label, icon, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
              style={
                active
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

        {/* Status */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${stage === "active" ? "bg-emerald-400 animate-pulse-dot" : ""}`}
            style={
              stage !== "active" ? { background: "rgba(255,255,255,0.2)" } : {}
            }
          />
          <span
            className="font-fira text-[10px] tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {stage === "active" ? "LIVE" : "IDLE"}
          </span>
        </div>

        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fbbf24";
            e.currentTarget.style.borderColor = "rgba(234,179,8,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          <Star size={11} /> Star
        </button>
      </div>
    </header>
  );
}

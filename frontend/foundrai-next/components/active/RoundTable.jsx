"use client";
import { useAppStore } from "@/store/useAppStore";
import { AGENTS, scoreColor } from "@/lib/utils";
import { ProgressRing } from "@/components/ui/progress-ring";

// Always show ALL 5 agents regardless of fast/deep mode
const ALL_AGENTS = [
  "CEO",
  "Developer",
  "Finance",
  "Marketing",
  "Risk",
  "Legal",
];

// Pure math: evenly space N points on a circle
// startAngle=-90 puts first point at top (12 o'clock)
function getCirclePoints(count, cx, cy, r, startAngle = -90) {
  return Array.from({ length: count }, (_, i) => {
    const deg = startAngle + (360 / count) * i;
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  });
}

function AgentCard({ id, state, x, y, active }) {
  const cfg = AGENTS[id];
  if (!cfg) return null;
  const status = state?.status || "idle";
  const score = state?.score;
  const thinking = status === "thinking";
  const complete = status === "complete";
  const disagree = score !== undefined && score < 6;

  // Dim inactive agents in fast mode
  const opacity = !active ? 0.3 : status === "idle" ? 0.55 : 1;

  const cardW = 110,
    cardH = 124;
  const cx2 = cardW / 2,
    cy2 = cardH / 2;

  return (
    <g
      transform={`translate(${x - cx2}, ${y - cy2})`}
      style={{ opacity, transition: "opacity 0.4s" }}
    >
      {/* Pulse ring when thinking */}
      {thinking && active && (
        <ellipse
          cx={cx2}
          cy={cy2}
          rx={cx2 + 8}
          ry={cy2 + 8}
          fill="none"
          stroke={cfg.color}
          strokeWidth={1.5}
          opacity={0.25}
        >
          <animate
            attributeName="rx"
            values={`${cx2 + 4};${cx2 + 14};${cx2 + 4}`}
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values={`${cy2 + 4};${cy2 + 14};${cy2 + 4}`}
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.25;0.5;0.25"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      {/* Card */}
      <rect
        width={cardW}
        height={cardH}
        rx={14}
        fill="#12121a"
        stroke={
          thinking ? cfg.color : complete ? cfg.color : "rgba(255,255,255,0.08)"
        }
        strokeWidth={thinking || complete ? 1.5 : 1}
        style={{
          filter:
            complete && active
              ? `drop-shadow(0 0 14px ${cfg.color}40)`
              : "none",
          transition: "filter 0.4s",
        }}
      />

      {/* Emoji */}
      <text
        x={cx2}
        y={30}
        textAnchor="middle"
        fontSize={24}
        style={{ userSelect: "none" }}
      >
        {cfg.emoji}
      </text>

      {/* Name */}
      <text
        x={cx2}
        y={52}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={cfg.color}
        fontFamily="Inter, sans-serif"
        letterSpacing={0.4}
      >
        {id.toUpperCase()}
      </text>

      {/* Role */}
      <text
        x={cx2}
        y={66}
        textAnchor="middle"
        fontSize={8}
        fill="rgba(148,163,184,0.6)"
        fontFamily="Inter, sans-serif"
      >
        {cfg.role}
      </text>

      {/* Status pill */}
      <rect
        x={cx2 - 32}
        y={76}
        width={64}
        height={18}
        rx={9}
        fill={
          thinking
            ? "rgba(99,102,241,0.2)"
            : complete
              ? "rgba(16,185,129,0.15)"
              : "rgba(255,255,255,0.04)"
        }
      />
      <text
        x={cx2}
        y={89}
        textAnchor="middle"
        fontSize={7}
        fontWeight={600}
        letterSpacing={0.8}
        fill={thinking ? "#818cf8" : complete ? "#34d399" : "#475569"}
        fontFamily="Inter, sans-serif"
      >
        {thinking ? "THINKING..." : complete ? "COMPLETE" : "WAITING"}
      </text>

      {/* Score chip top-right */}
      {score !== undefined && (
        <>
          <rect
            x={cardW - 38}
            y={4}
            width={34}
            height={17}
            rx={8.5}
            fill={scoreColor(score)}
          />
          <text
            x={cardW - 21}
            y={16}
            textAnchor="middle"
            fontSize={7.5}
            fontWeight={700}
            fill="#0a0a0f"
            fontFamily="Inter, sans-serif"
          >
            {score}/10
          </text>
        </>
      )}

      {/* Shake for disagreement */}
      {disagree && active && (
        <animateTransform
          attributeName="transform"
          type="translate"
          additive="sum"
          values="0,0;-4,0;4,0;-3,0;3,0;0,0"
          dur="0.45s"
          begin="0s"
        />
      )}
    </g>
  );
}

export default function RoundTable() {
  const { agentStates, consensusScore, converged, fastMode } = useAppStore();

  // Always render all 5 agents; mark which ones are "active" in current mode
  const activeSet = new Set(
    fastMode ? ["CEO", "Developer", "Finance"] : ALL_AGENTS,
  );

  const W = 620,
    H = 560;
  const cx = W / 2,
    cy = H / 2;
  const radius = 210; // radius from center to agent card center
  const pts = getCirclePoints(6, cx, cy, radius);

  const color = converged ? "#10b981" : scoreColor(consensusScore);

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        style={{ maxWidth: W, maxHeight: H }}
      >
        {/* Pentagon outline */}
        <polygon
          points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgba(99,102,241,0.07)"
          strokeWidth={1}
          strokeDasharray="5 7"
        />

        {/* Spokes: center → each agent */}
        {pts.map((p, i) => {
          const id = ALL_AGENTS[i];
          const st = agentStates[id];
          const lit = st?.status === "complete" && activeSet.has(id);
          return (
            <line
              key={`spoke-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke={lit ? color : "rgba(255,255,255,0.04)"}
              strokeWidth={lit ? 1.5 : 1}
              strokeDasharray={lit ? "none" : "3 6"}
              style={{ transition: "stroke 0.6s ease" }}
            />
          );
        })}

        {/* Pentagon edges */}
        {pts.map((p, i) => {
          const next = pts[(i + 1) % 5];
          return (
            <line
              key={`edge-${i}`}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(99,102,241,0.08)"
              strokeWidth={1}
              strokeDasharray="3 7"
            />
          );
        })}

        {/* Center hub */}
        <foreignObject x={cx - 82} y={cy - 82} width={164} height={164}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProgressRing score={consensusScore} size={164} stroke={7} />
            </div>
            <div
              style={{ position: "relative", textAlign: "center", zIndex: 1 }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#f1f5f9",
                  lineHeight: 1,
                }}
              >
                {consensusScore > 0 ? consensusScore.toFixed(1) : "—"}
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: "#64748b",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginTop: 3,
                  fontFamily: "Fira Code, monospace",
                }}
              >
                CONSENSUS
              </div>
              {consensusScore > 0 && (
                <div
                  style={{
                    fontSize: 9,
                    color,
                    marginTop: 2,
                    fontFamily: "Fira Code, monospace",
                  }}
                >
                  / 10.0
                </div>
              )}
              {converged && (
                <div
                  style={{
                    fontSize: 10,
                    color: "#10b981",
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  ✅ REACHED
                </div>
              )}
            </div>
          </div>
        </foreignObject>

        {/* Threshold label */}
        <text
          x={cx + 70}
          y={cy - 60}
          fontSize={8}
          fill="#475569"
          fontFamily="Inter, sans-serif"
          letterSpacing={0.5}
        >
          Threshold 7.5
        </text>

        {/* All 5 agent cards */}
        {ALL_AGENTS.map((id, i) => (
          <AgentCard
            key={id}
            id={id}
            state={agentStates[id]}
            x={pts[i].x}
            y={pts[i].y}
            active={activeSet.has(id)}
          />
        ))}
      </svg>
    </div>
  );
}

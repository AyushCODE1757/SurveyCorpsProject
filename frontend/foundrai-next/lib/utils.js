import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score) {
  if (score >= 7.5) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#ef4444";
}

export function scoreColorClass(score) {
  if (score >= 7.5) return "text-emerald-400";
  if (score >= 5) return "text-amber-400";
  return "text-red-400";
}

// Agent config — single source of truth
export const AGENTS = {
  CEO: {
    label: "CEO Agent",
    role: "Strategic Vision",
    emoji: "🧠",
    color: "#6366f1",
    border: "border-indigo-500/40",
    bg: "bg-indigo-500/10",
  },
  Developer: {
    label: "Dev Agent",
    role: "Engineering",
    emoji: "⚡",
    color: "#3b82f6",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
  },
  Finance: {
    label: "CFO Agent",
    role: "Financial Model",
    emoji: "📈",
    color: "#10b981",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
  },
  Marketing: {
    label: "CMO Agent",
    role: "Market Strategy",
    emoji: "🌐",
    color: "#f59e0b",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
  },
  Risk: {
    label: "Risk Agent",
    role: "Risk Assessment",
    emoji: "⚠️",
    color: "#ef4444",
    border: "border-red-500/40",
    bg: "bg-red-500/10",
  },
  Legal: {
    label: "Legal Agent",
    role: "Legal & Compliance",
    emoji: "⚖️",
    color: "#8b5cf6",
    border: "border-violet-500/40",
    bg: "bg-violet-500/10",
  },
  Synthesis: {
    label: "Strategist",
    role: "Synthesis",
    emoji: "✨",
    color: "#22d3ee",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
  },
};

export const PLAN_SECTIONS = [
  { key: "Executive Summary", label: "📋 Executive Summary", agent: "CEO" },
  {
    key: "Marketing Strategy",
    label: "📣 Market Analysis",
    agent: "Marketing",
  },
  { key: "Financial Model", label: "💰 Financial Model", agent: "Finance" },
  { key: "Technology Stack", label: "💻 Tech Stack", agent: "Developer" },
  { key: "Risk Assessment", label: "⚠️ Risk Assessment", agent: "Risk" },
  { key: "Legal Assessment", label: "⚖️ Legal Assessment", agent: "Legal" },
];

export const FORM_OPTIONS = {
  stage: ["Idea", "Building MVP", "Early Revenue", "Scaling"],
  market_type: ["B2B", "B2C", "SaaS", "Marketplace", "D2C"],
  audience: ["Enterprise", "SMBs", "Consumers", "Creators", "Other"],
  revenue: [
    "Subscription",
    "Ads",
    "Commission",
    "One-time Sale",
    "Pre-revenue",
  ],
  platform: ["Web App", "Mobile App (iOS/Android)", "API", "No-Code"],
  sensitivity: ["General Data", "Financial (High risk)", "Health (High risk)"],
  bottleneck: [
    "Tech & Dev",
    "Marketing & Sales",
    "Funding",
    "Legal",
    "Strategy",
  ],
  team_edge: [
    "Tech-Heavy",
    "Marketing-Heavy",
    "Domain Experts",
    "Solo Founder",
  ],
};

export const TICKER_MESSAGES = [
  "🌐 MARKET AGENT: Analyzing SaaS trends in APAC…",
  "🧠 CEO AGENT: Resolving conflict in monetization strategy…",
  "⚡ DEV AGENT: Validating tech stack via GitHub search…",
  "📈 CFO AGENT: Calculating TAM via Google Trends…",
  "⚠️ RISK AGENT: Scanning Reddit for community pain points…",
  "⚖️ LEGAL AGENT: Checking patent landscape…",
  "✨ SYNTHESIS AGENT: Compiling consensus business plan…",
];

export function buildPromptFromForm(form) {
  return [
    `Startup: ${form.name} — ${form.tagline}`,
    `Problem: ${form.problem}`,
    `Solution: ${form.solution}`,
    `Stage: ${form.stage} | Market: ${form.market_type} | Audience: ${form.audience}`,
    `Revenue: ${form.revenue} | Platform: ${form.platform}`,
    `Data Sensitivity: ${form.sensitivity}`,
    `Key bottleneck: ${form.bottleneck} | Team: ${form.team_edge}`,
  ].join("\n");
}

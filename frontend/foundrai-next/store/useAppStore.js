"use client";
import { create } from "zustand";

const INIT = {
  // Navigation
  stage: "landing", // 'landing' | 'intake' | 'active' | 'results'
  inputMode: "prompt", // 'prompt' | 'form'

  // Input
  idea: "",
  fastMode: true,
  documentId: null, // Moved here, defined once
  formData: {
    name: "",
    tagline: "",
    problem: "",
    solution: "",
    stage: "",
    market_type: "",
    audience: "",
    revenue: "",
    platform: "",
    sensitivity: "",
    bottleneck: "",
    team_edge: "",
  },

  // Simulation state
  phase: 0,
  agentStates: {}, // { [agentId]: { status, score, content } }
  feed: [], // all SSE events, persisted across stages
  livingDoc: {}, // { [sectionKey]: string }
  consensusScore: 0,
  converged: false,
  planReady: false,
  simulationDone: false,
  sessionId: null,
  isReplaying: false,

  // Results
  finalPlan: null,
  legalFindings: null, 
  cfoChartData: null, 
  influencers: [], 
  workforcePlan: [], 
  timeline: [], 
  redditPosts: [], 
  pdfReady: false,
  deploymentUrl: "",
};

export const useAppStore = create((set, get) => ({
  ...INIT,

  // ── Setters ──────────────────────────────────────────────────────────────
  setIdea: (idea) => set({ idea }),
  setFastMode: (v) => set({ fastMode: v }),
  setInputMode: (mode) => set({ inputMode: mode }),
  setFormData: (data) => set({ formData: { ...get().formData, ...data } }),
  setStage: (stage) => set({ stage }),
  goToResults: () => set({ stage: "results" }),
  reset: () => set({ ...INIT }),
  setDocumentId: (id) => set({ documentId: id }),
  setReplaying: (v) => set({ isReplaying: v }),

  setSessionId: (id) => {
    set({ sessionId: id });
    if (typeof window !== "undefined") {
      localStorage.setItem("foundrai_session_id", id);
    }
  },

  clearSession: () => {
    set({ sessionId: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("foundrai_session_id");
    }
  },

  // ── SSE event handler ─────────────────────────────────────────────────────
  handleEvent: (data) => {
    if (data.type !== "ping") {
      set((s) => ({
        feed: [
          ...s.feed.slice(-300),
          { ...data, _id: Date.now() + Math.random() },
        ],
      }));
    }

    switch (data.type) {
      case "session_start":
        get().setSessionId(data.session_id);
        break;

      case "replay_complete":
        set({ isReplaying: false });
        break;
        
      case "phase_change":
        set({ phase: data.phase });
        break;

      case "agent_thinking":
        set((s) => ({
          agentStates: {
            ...s.agentStates,
            [data.agent]: { ...s.agentStates[data.agent], status: "thinking" },
          },
        }));
        break;

      case "proposal":
      case "revision":
        set((s) => ({
          agentStates: {
            ...s.agentStates,
            CEO: { status: "complete", content: data.content },
          },
          livingDoc: { ...s.livingDoc, "Executive Summary": data.content },
        }));
        break;

      case "critique":
      case "re_score": {
        const agent = data.agent;
        set((s) => ({
          agentStates: {
            ...s.agentStates,
            [agent]: {
              status: "complete",
              score: data.score,
              content: data.content,
            },
          },
        }));
        const sectionMap = {
          Marketing: "Marketing Strategy",
          Risk: "Risk Assessment",
          Finance: "Financial Model",
          Developer: "Technology Stack",
          Legal: "Legal Assessment",
        };
        if (sectionMap[agent] && data.content) {
          set((s) => ({
            livingDoc: { ...s.livingDoc, [sectionMap[agent]]: data.content },
          }));
        }
        
        if (agent === "Finance" && data.chart_data?.length > 0) {
          set({
            cfoChartData: {
              chart_data: data.chart_data,
              trend: data.trend || "Unknown",
              avg: data.avg || 0,
              peak: data.peak || 0,
              recent: data.recent || 0,
            },
          });
        }
        break;
      }

      case "consensus_update":
        set({ consensusScore: data.score });
        break;

      case "consensus_reached":
        set({ converged: true, consensusScore: data.final_score });
        break;

      case "final_plan":
        set((s) => ({
          finalPlan: data.plan,
          livingDoc: { ...s.livingDoc, ...data.plan },
          planReady: true,
          agentStates: { ...s.agentStates, Synthesis: { status: "complete" } },
        }));
        break;

      case "legal_thinking":
        set((s) => ({
          agentStates: {
            ...s.agentStates,
            Legal: { ...s.agentStates.Legal, status: "thinking" },
          },
        }));
        break;

      case "legal_result":
        set((s) => ({
          legalFindings: {
            risk_score: data.risk_score,
            findings: data.findings,
          },
          agentStates: {
            ...s.agentStates,
            Legal: {
              status: "complete",
              score: data.risk_score,
              content: data.content,
            },
          },
          livingDoc: { ...s.livingDoc, "Legal Assessment": data.content },
        }));
        break;

      case "cfo_chart_data":
        set({ cfoChartData: data });
        break;

      case "influencer_result":
        set({ influencers: data.influencers || [] });
        break;

      case "workforce_plan":
        set({ workforcePlan: data.roles || [] });
        break;

      case "timeline":
        set({ timeline: data.milestones || [] });
        break;

      case "reddit_result":
        set((s) => ({
          redditPosts: [...s.redditPosts, ...(data.posts || [])],
        }));
        break;

      case "pdf_ready":
        set({ pdfReady: true });
        break;

      case "deployment_complete":
        set({ deploymentUrl: data.url || "" });
        break;

      case "system_done":
        set({ simulationDone: true });
        break;

      default:
        break;
    }
  },

  startSimulation: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("foundrai_session_id");
    }
    set({
      stage: "active",
      sessionId: null,
      isReplaying: false,
      phase: 1,
      livingDoc: {},
      agentStates: {},
      feed: [],
      consensusScore: 0,
      converged: false,
      finalPlan: null,
      planReady: false,
      simulationDone: false,
      pdfReady: false,
      deploymentUrl: "",
      legalFindings: null,
      cfoChartData: null,
      influencers: [],
      workforcePlan: [],
      timeline: [],
      redditPosts: [],
      documentId: null, // Reset doc ID on new simulation
    });
  },

  stopSimulation: () => set({ simulationDone: true }),
}));
"use client";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useSimulation() {
  const {
    handleEvent,
    startSimulation,
    setReplaying,
  } = useAppStore();
  const esRef = useRef(null);

  // On mount: check localStorage for an existing session and replay it
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedId = localStorage.getItem("foundrai_session_id");
    if (!savedId) return;

    setReplaying(true);
    // Switch to active stage immediately so user sees their session
    useAppStore.getState().setStage("active");

    const es = new EventSource(`${API_BASE}/session/${savedId}`);
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        handleEvent(data);
        if (data.type === "replay_complete" || data.type === "system_done") {
          es.close();
        }
      } catch {}
    };
    es.onerror = () => {
      // Session expired or not found — clean up silently
      localStorage.removeItem("foundrai_session_id");
      setReplaying(false);
      es.close();
    };

    return () => es.close();
  }, [handleEvent, setReplaying]); 

  async function run() {
    startSimulation();
    if (esRef.current) esRef.current.close();

    // Use .getState() to fetch the absolute freshest values instantly
    // This solves the React stale closure bug
    const state = useAppStore.getState();
    const currentIdea = state.idea;
    const currentFastMode = state.fastMode;
    const currentDocId = state.documentId;

    const body = {
      idea: currentIdea,
      fast: currentFastMode,
      ...(currentDocId ? { document_id: currentDocId } : {}),
    };

    const res = await fetch(`${API_BASE}/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            handleEvent(data);
          } catch {}
        }
      }
    }
  }

  return { run };
}
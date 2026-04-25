"use client";
import { useCallback, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { buildPromptFromForm } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const EVENT_GAP = 700; // ms between visual events — feels deliberate

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SKIP_DELAY = new Set([
  "ping",
  "consensus_update",
  "system_done",
  "pdf_ready",
  "cfo_chart_data",
  "reddit_result",
  "influencer_result",
  "workforce_plan",
  "timeline",
]);

export function useSimulation() {
  const {
    idea,
    fastMode,
    inputMode,
    formData,
    handleEvent,
    startSimulation,
    stopSimulation,
  } = useAppStore();

  const abortRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async () => {
    // Build request body depending on input mode
    const body =
      inputMode === "form"
        ? {
            form_data: formData,
            idea: buildPromptFromForm(formData),
            fast: fastMode,
          }
        : { idea: idea.trim(), fast: fastMode };

    if (!body.idea) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    startSimulation();

    try {
      const res = await fetch(`${API}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const chunks = buf.split("\n\n");
        buf = chunks.pop() ?? "";

        for (const chunk of chunks) {
          if (!chunk.startsWith("data: ")) continue;
          try {
            const evt = JSON.parse(chunk.slice(6));
            handleEvent(evt);
            if (!SKIP_DELAY.has(evt.type)) await sleep(EVENT_GAP);
          } catch {
            /* skip malformed */
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Stream error:", err);
    } finally {
      stopSimulation();
    }
  }, [
    idea,
    fastMode,
    inputMode,
    formData,
    handleEvent,
    startSimulation,
    stopSimulation,
  ]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    stopSimulation();
  }, [stopSimulation]);

  return { run, cancel };
}

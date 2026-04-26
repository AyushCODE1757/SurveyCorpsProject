"""
FoundrAI — Orchestrator
Pure business logic: phase sequencing, consensus gate, SSE formatting.
Context compression: revision loop uses agent summaries (150 tokens) not full outputs.
Session: every run gets a session_id for persistence layer.
"""

import asyncio
import json
from agents import (
    ceo_propose, dev_critique, finance_critique,
    marketing_critique, risk_critique, legal_critique,
    ceo_revise, synthesize,
)
from session_store import SessionStore

CONSENSUS_THRESHOLD = 7.5


def sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


def _emit_tool_events(result: dict, phase: int) -> list[str]:
    events = []
    if result.get("tool_name"):
        events.append(sse({
            "type":  "tool_call",
            "agent": result["agent"],
            "tool":  result["tool_name"],
            "query": result.get("tool_query", ""),
            "phase": phase,
        }))
        events.append(sse({
            "type":    "tool_result",
            "agent":   result["agent"],
            "tool":    result["tool_name"],
            "snippet": result.get("tool_result_snippet", ""),
            "phase":   phase,
        }))
    return events


async def run_simulation_stream(
    idea: str,
    session_id: str,
    fast: bool = False,
    document_id: str | None = None,       # ← NEW: optional user-uploaded doc
):
    """
    Main simulation generator. Yields SSE strings.
    Every event is also persisted to the session store so the frontend
    can replay after a refresh.
    document_id: if present, each agent will query the user's uploaded
                 document for domain-relevant chunks via DocumentStore.
    """
    store = SessionStore()

    async def emit(data: dict) -> str:
        event_str = sse(data)
        await store.append_event(session_id, data)
        return event_str

    yield await emit({"type": "session_start", "session_id": session_id, "fast_mode": fast})
    yield await emit({"type": "system_start", "fast_mode": fast})

    # ── PHASE 1: CEO PROPOSAL ────────────────────────────────────────────────
    yield await emit({"type": "phase_change", "phase": 1, "label": "CEO Proposal"})
    yield await emit({"type": "agent_thinking", "agent": "CEO", "phase": 1})

    ceo_result = await asyncio.to_thread(ceo_propose, idea, fast, document_id)  # ← document_id passed
    for event in _emit_tool_events(ceo_result, 1):
        yield event

    proposal = ceo_result["content"]
    yield await emit({
        "type":        "proposal",
        "agent":       "CEO",
        "phase":       1,
        "content":     proposal,
        "grounded_by": ceo_result.get("tool_name"),
    })

    if ceo_result.get("workforce_plan"):
        yield await emit({"type": "workforce_plan", "roles": ceo_result["workforce_plan"]})
    if ceo_result.get("timeline"):
        yield await emit({"type": "timeline", "milestones": ceo_result["timeline"]})

    # ── PHASE 2: PARALLEL CRITIQUE + LEGAL SCAN ──────────────────────────────
    yield await emit({"type": "phase_change", "phase": 2, "label": "Parallel Critique + Legal Scan"})

    if fast:
        critic_agents = ["Developer", "Finance", "Legal"]
        critique_fns  = [
            asyncio.to_thread(dev_critique,    idea, proposal, True,  document_id),  # ← document_id
            asyncio.to_thread(finance_critique, idea, proposal, True,  document_id),
            asyncio.to_thread(legal_critique,   idea, proposal, True,  document_id),
        ]
    else:
        critic_agents = ["Developer", "Finance", "Marketing", "Risk", "Legal"]
        critique_fns  = [
            asyncio.to_thread(dev_critique,       idea, proposal, False, document_id),  # ← document_id
            asyncio.to_thread(finance_critique,   idea, proposal, False, document_id),
            asyncio.to_thread(marketing_critique, idea, proposal, False, document_id),
            asyncio.to_thread(risk_critique,      idea, proposal, False, document_id),
            asyncio.to_thread(legal_critique,     idea, proposal, False, document_id),
        ]

    for agent in critic_agents:
        yield await emit({"type": "agent_thinking", "agent": agent, "phase": 2})

    critique_results    = await asyncio.gather(*critique_fns)
    all_critiques       = list(critique_results)
    consensus_critiques = [c for c in all_critiques if c["agent"] != "Legal"]

    for c in all_critiques:
        for event in _emit_tool_events(c, 2):
            yield event

        if c["agent"] == "Legal":
            # Legal is a separate gate — emit as legal_result (no score in consensus)
            yield await emit({
                "type":        "legal_result",
                "agent":       "Legal",
                "phase":       2,
                "content":     c["content"],
                "grounded_by": c.get("tool_name"),
                # No score — Legal is not a consensus participant
            })
        else:
            yield await emit({
                "type":        "critique",
                "agent":       c["agent"],
                "phase":       2,
                "content":     c["content"],
                "score":       c.get("score", 5.0),
                "grounded_by": c.get("tool_name"),
                "chart_data":  c.get("chart_data", []),
            })

        # ── Reddit result SSE event (Risk Agent only) ─────────────────────────
        # Emits structured Reddit post cards for the RedditFeed component.
        # Each post: { subreddit, title, body_snippet, score_range, relevance_tag }
        if c["agent"] == "Risk" and c.get("reddit_posts"):
            yield await emit({
                "type":  "reddit_result",
                "posts": c["reddit_posts"],
                "phase": 2,
            })

    avg_score = (
        sum(c["score"] for c in consensus_critiques) / len(consensus_critiques)
        if consensus_critiques else 5.0
    )
    yield await emit({"type": "consensus_update", "score": round(avg_score, 1), "round": 0})

    # ── PHASE 3: ITERATIVE REVISION ──────────────────────────────────────────
    # ceo_revise gets compressed summaries (150 tokens each), not full outputs.
    # document_id is NOT passed here — revision is synthesis of critiques only,
    # no need to re-query the document.
    yield await emit({"type": "phase_change", "phase": 3, "label": "Negotiation & Revision"})

    current_proposal = proposal
    max_rounds       = 1 if fast else 2

    for round_num in range(1, max_rounds + 1):
        if avg_score >= CONSENSUS_THRESHOLD:
            break

        yield await emit({"type": "agent_thinking", "agent": "CEO", "phase": 3})

        revised_result   = await asyncio.to_thread(
            ceo_revise, idea, current_proposal, consensus_critiques, round_num, fast
        )
        current_proposal = revised_result["content"]
        yield await emit({
            "type":    "revision",
            "agent":   "CEO",
            "phase":   3,
            "content": current_proposal,
            "round":   round_num,
        })

        if fast or round_num == max_rounds:
            break

        # Re-score with document_id so rescoring agents still have doc context
        rescore_fns = [
            asyncio.to_thread(dev_critique,    idea, current_proposal, False, document_id),  # ← document_id
            asyncio.to_thread(finance_critique, idea, current_proposal, False, document_id),
        ]
        for a in ["Developer", "Finance"]:
            yield await emit({"type": "agent_thinking", "agent": a, "phase": 3})

        new_scores = await asyncio.gather(*rescore_fns)
        for s in new_scores:
            for event in _emit_tool_events(s, 3):
                yield event
            yield await emit({
                "type":    "re_score",
                "agent":   s["agent"],
                "phase":   3,
                "content": s["content"],
                "score":   s["score"],
            })
            for c in consensus_critiques:
                if c["agent"] == s["agent"]:
                    c["summary"] = s.get("summary", s["content"])
                    c["score"]   = s["score"]

        avg_score = sum(s["score"] for s in new_scores) / len(new_scores)
        yield await emit({"type": "consensus_update", "score": round(avg_score, 1), "round": round_num})

    yield await emit({"type": "consensus_reached", "final_score": round(avg_score, 1)})

    # ── PHASE 4: FINAL SYNTHESIS ─────────────────────────────────────────────
    yield await emit({"type": "phase_change", "phase": 4, "label": "Final Synthesis"})
    yield await emit({"type": "agent_thinking", "agent": "Synthesis", "phase": 4})

    plan = await asyncio.to_thread(synthesize, idea, current_proposal, all_critiques, fast)
    yield await emit({"type": "final_plan", "agent": "Synthesis", "phase": 4, "plan": plan})

    await store.mark_complete(session_id)
    yield await emit({"type": "system_done"})
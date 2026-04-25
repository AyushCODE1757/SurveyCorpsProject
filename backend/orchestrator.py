"""
FoundrAI 2.0 — Orchestrator
Updated with 6 agents including Legal Agent.
"""

import asyncio
import json
from agents import (
    ceo_propose, dev_critique, finance_critique,
    marketing_critique, risk_critique, legal_critique,
    ceo_revise, synthesize
)

CONSENSUS_THRESHOLD = 7.5


def sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


def _emit_tool_events(result: dict, phase: int) -> list[str]:
    events = []
    if result.get("tool_name"):
        events.append(sse({
            "type": "tool_call",
            "agent": result["agent"],
            "tool": result["tool_name"],
            "query": result.get("tool_query", ""),
            "phase": phase,
        }))
        events.append(sse({
            "type": "tool_result",
            "agent": result["agent"],
            "tool": result["tool_name"],
            "snippet": result.get("tool_result_snippet", ""),
            "phase": phase,
        }))
    return events


async def run_simulation_stream(idea: str, fast: bool = False):
    yield sse({"type": "system_start", "fast_mode": fast})

    # ── PHASE 1: CEO PROPOSAL ────────────────────────────────────────────────
    yield sse({"type": "phase_change", "phase": 1, "label": "CEO Proposal"})
    yield sse({"type": "agent_thinking", "agent": "CEO", "phase": 1})

    ceo_result = await asyncio.to_thread(ceo_propose, idea, fast)
    for event in _emit_tool_events(ceo_result, 1): yield event

    proposal = ceo_result["content"]
    yield sse({
        "type": "proposal", "agent": "CEO", "phase": 1,
        "content": proposal,
        "grounded_by": ceo_result.get("tool_name"),
    })

    if ceo_result.get("workforce_plan"):
        yield sse({
            "type": "workforce_plan",
            "roles": ceo_result["workforce_plan"]
        })
    if ceo_result.get("timeline"):
        yield sse({
            "type": "timeline",
            "milestones": ceo_result["timeline"]
        })

    # ── PHASE 2: PARALLEL CRITIQUE + LEGAL SCAN ──────────────────────────────
    yield sse({"type": "phase_change", "phase": 2, "label": "Parallel Critique + Legal Scan"})

    if fast:
        critic_agents = ["Developer", "Finance", "Legal"]
        critique_fns = [
            asyncio.to_thread(dev_critique, idea, proposal, True),
            asyncio.to_thread(finance_critique, idea, proposal, True),
            asyncio.to_thread(legal_critique, idea, proposal, True),
        ]
    else:
        critic_agents = ["Developer", "Finance", "Marketing", "Risk", "Legal"]
        critique_fns = [
            asyncio.to_thread(dev_critique, idea, proposal, False),
            asyncio.to_thread(finance_critique, idea, proposal, False),
            asyncio.to_thread(marketing_critique, idea, proposal, False),
            asyncio.to_thread(risk_critique, idea, proposal, False),
            asyncio.to_thread(legal_critique, idea, proposal, False),
        ]

    for agent in critic_agents:
        yield sse({"type": "agent_thinking", "agent": agent, "phase": 2})

    critique_results = await asyncio.gather(*critique_fns)
    all_critiques = list(critique_results)

    # Separate Legal from consensus agents
    consensus_critiques = [c for c in all_critiques if c["agent"] != "Legal"]
    legal_result = next((c for c in all_critiques if c["agent"] == "Legal"), None)

    for c in all_critiques:
        for event in _emit_tool_events(c, 2): yield event
        yield sse({
            "type": "critique" if c["agent"] != "Legal" else "legal_result",
            "agent": c["agent"], "phase": 2,
            "content": c["content"], 
            "score": c.get("score", 5.0),
            "grounded_by": c.get("tool_name"),
        })

    if consensus_critiques:
        avg_score = sum(c["score"] for c in consensus_critiques) / len(consensus_critiques)
        yield sse({"type": "consensus_update", "score": round(avg_score, 1), "round": 0})
    else:
        avg_score = 5.0

    # ── PHASE 3: ITERATIVE REVISION ──────────────────────────────────────────
    yield sse({"type": "phase_change", "phase": 3, "label": "Negotiation & Revision"})

    current_proposal = proposal
    max_rounds = 1 if fast else 2

    for round_num in range(1, max_rounds + 1):
        if avg_score >= CONSENSUS_THRESHOLD: break

        yield sse({"type": "agent_thinking", "agent": "CEO", "phase": 3})
        revised_result = await asyncio.to_thread(ceo_revise, idea, current_proposal, consensus_critiques, round_num, fast)
        current_proposal = revised_result["content"]
        yield sse({"type": "revision", "agent": "CEO", "phase": 3, "content": current_proposal, "round": round_num})

        if fast or round_num == max_rounds: break

        rescore_fns = [
            asyncio.to_thread(dev_critique, idea, current_proposal, False),
            asyncio.to_thread(finance_critique, idea, current_proposal, False),
        ]
        for a in ["Developer", "Finance"]: yield sse({"type": "agent_thinking", "agent": a, "phase": 3})

        new_scores = await asyncio.gather(*rescore_fns)
        for s in new_scores:
            for event in _emit_tool_events(s, 3): yield event
            yield sse({"type": "re_score", "agent": s["agent"], "phase": 3, "content": s["content"], "score": s["score"]})

        avg_score = sum(s["score"] for s in new_scores) / len(new_scores)
        yield sse({"type": "consensus_update", "score": round(avg_score, 1), "round": round_num})

    yield sse({"type": "consensus_reached", "final_score": round(avg_score, 1)})

    # ── PHASE 4: FINAL SYNTHESIS ─────────────────────────────────────────────
    yield sse({"type": "phase_change", "phase": 4, "label": "Final Synthesis"})
    yield sse({"type": "agent_thinking", "agent": "Synthesis", "phase": 4})

    # Synthesis should consider all critiques including Legal
    plan = await asyncio.to_thread(synthesize, idea, current_proposal, all_critiques, fast)
    yield sse({"type": "final_plan", "agent": "Synthesis", "phase": 4, "plan": plan})

    yield sse({"type": "system_done"})

# """
# FoundrAI — CEO Agent
# Phase 1: propose. Phase 3: revise using compressed critique summaries.
# """

# import re
# import json as _json
# from .base import call_ai, compress_for_passing, build_critique_result
# from rag import query_for_idea
# from tools import search_recent_startups, get_salary_benchmarks


# def ceo_propose(idea: str, fast: bool = False) -> dict:
#     rag_context = query_for_idea(idea)
#     query       = f"recent startups {idea} 2024 2025"
#     tool_result = search_recent_startups.invoke(query)
#     salary_data = get_salary_benchmarks.invoke({"role": "Software Engineer", "location": "USA"})
#     snippet     = (tool_result[:300] + " | " + salary_data[:100])

#     prompt = (
#         f"You are the visionary CEO of a new startup. The idea is: '{idea}'.\n\n"
#         f"[YC & PAUL GRAHAM & FORTUNE 500 KNOWLEDGE BASE]\n{rag_context}\n\n"
#         f"[LIVE MARKET DATA from Tavily web search]\n{tool_result}\n\n"
#         f"[LIVE SALARY DATA for cost estimation]\n{salary_data}\n\n"
#         "Using BOTH the proven VC wisdom above AND the live market/salary data, "
#         "draft a comprehensive business proposal covering:\n"
#         "1. Core value proposition that differentiates from what already exists\n"
#         "2. Target market (be specific — cite a real segment from the data)\n"
#         "3. Go-to-market strategy grounded in what has worked for similar startups\n\n"
#         "Also include a JSON block at the very end wrapped in ```json ... ``` with this exact structure:\n"
#         "{\n"
#         '  "workforce_plan": [{"title": "CTO", "headcount": 1, "phase": "MVP", "monthly_cost": 10000}],\n'
#         '  "timeline": [{"phase": "Month 1-3", "months": "1-3", "deliverables": "MVP launch"}]\n'
#         "}\n"
#         "Output format: The prose proposal, followed by the structured markdown tables, followed by the JSON block."
#     )
#     content = call_ai(prompt, fast)

#     workforce_plan = []
#     timeline       = []
#     json_match     = re.search(r"```json\s*(\{.*?\})\s*```", content, re.DOTALL)
#     if json_match:
#         try:
#             parsed         = _json.loads(json_match.group(1))
#             workforce_plan = parsed.get("workforce_plan", [])
#             timeline       = parsed.get("timeline", [])
#             content        = content[: json_match.start()] + content[json_match.end() :]
#         except Exception:
#             pass

#     content = content.strip()
#     summary = compress_for_passing("CEO", content)

#     return {
#         "agent":               "CEO",
#         "content":             content,
#         "summary":             summary,
#         "tool_name":           "Tavily Web Search + Salary API",
#         "tool_query":          query,
#         "tool_result_snippet": snippet,
#         "rag_used":            True,
#         "workforce_plan":      workforce_plan,
#         "timeline":            timeline,
#     }


# def ceo_revise(
#     idea: str,
#     prev_proposal: str,
#     critiques: list[dict],
#     round_num: int,
#     fast: bool = False,
# ) -> dict:
#     """
#     CONTEXT COMPRESSION IN ACTION:
#     We pass critique["summary"] (150 tokens each) instead of critique["content"]
#     (potentially 600 tokens each). For 4 critique agents this saves ~1800 tokens
#     per revision round while preserving all actionable signal.
#     """
#     critique_text = "\n".join(
#         f"- {c['agent']} (score {c.get('score', '?')}/10): {c.get('summary', c['content'])}"
#         for c in critiques
#     )
#     prompt = (
#         f"You are the CEO revising your startup proposal (round {round_num}).\n"
#         f"Idea: '{idea}'\nPrevious proposal summary: '{prev_proposal[:400]}'\n\n"
#         f"Team critique (compressed for efficiency):\n{critique_text}\n\n"
#         "Write a revised proposal (3-4 sentences of prose) that directly addresses "
#         "each concern. Reference specific improvements to the financial model, "
#         "tech approach, or risk strategy."
#     )
#     content = call_ai(prompt, fast)
#     summary = compress_for_passing("CEO", content)

#     return {
#         "agent":               "CEO",
#         "content":             content,
#         "summary":             summary,
#         "tool_name":           None,
#         "tool_query":          None,
#         "tool_result_snippet": None,
#     }

"""
FoundrAI — CEO Agent
Phase 1: propose. Phase 3: revise using compressed critique summaries.
"""

import re
import json as _json
from .base import call_ai, compress_for_passing
from rag import query_for_idea
from tools import search_recent_startups, get_salary_benchmarks


def ceo_propose(
    idea: str,
    fast: bool = False,
    document_id: str | None = None,    # ← NEW
) -> dict:
    # 1. Knowledge base RAG
    rag_context = query_for_idea(idea)
    rag_context = rag_context[:800] if rag_context else ""
    # 2. Live market + salary tools
    query       = f"recent startups {idea} 2024 2025"
    tool_result = search_recent_startups.invoke(query)
    salary_data = get_salary_benchmarks.invoke({"role": "Software Engineer", "location": "USA"})
    snippet     = (tool_result[:300] + " | " + salary_data[:100])

    # 3. User uploaded document — CEO queries for business-model-relevant chunks only
    user_doc_section = ""
    if document_id:
        from document_store import query_user_document
        user_doc_context = query_user_document(
            document_id,
            specialty_query="value proposition market size business model revenue go-to-market",
        )
        if user_doc_context:
            user_doc_section = (
                f"[USER UPLOADED DOCUMENT — BUSINESS CONTEXT]\n{user_doc_context}\n\n"
            )

    prompt = (
        f"You are the visionary CEO of a new startup. The idea is: '{idea}'.\n\n"
        f"[YC & PAUL GRAHAM & FORTUNE 500 KNOWLEDGE BASE]\n{rag_context}\n\n"
        f"[LIVE MARKET DATA from Tavily web search]\n{tool_result}\n\n"
        f"[LIVE SALARY DATA for cost estimation]\n{salary_data}\n\n"
        f"{user_doc_section}"                                          # ← injected here, empty string if no doc
        "Using BOTH the proven VC wisdom above AND the live market/salary data, "
        "draft a comprehensive business proposal covering:\n"
        "1. Core value proposition that differentiates from what already exists\n"
        "2. Target market (be specific — cite a real segment from the data)\n"
        "3. Go-to-market strategy grounded in what has worked for similar startups\n\n"
        "Also include a JSON block at the very end wrapped in ```json ... ``` with this exact structure:\n"
        "{\n"
        '  "workforce_plan": [{"title": "CTO", "headcount": 1, "phase": "MVP", "monthly_cost": 10000}],\n'
        '  "timeline": [{"phase": "Month 1-3", "months": "1-3", "deliverables": "MVP launch"}]\n'
        "}\n"
        "Output format: The prose proposal, followed by the structured markdown tables, followed by the JSON block."
    )
    content = call_ai(prompt, fast)

    # Parse structured JSON out of the LLM response
    workforce_plan = []
    timeline       = []
    json_match     = re.search(r"```json\s*(\{.*?\})\s*```", content, re.DOTALL)
    if json_match:
        try:
            parsed         = _json.loads(json_match.group(1))
            workforce_plan = parsed.get("workforce_plan", [])
            timeline       = parsed.get("timeline", [])
            content        = content[: json_match.start()] + content[json_match.end() :]
        except Exception:
            pass

    content = content.strip()
    summary = compress_for_passing("CEO", content)

    return {
        "agent":               "CEO",
        "content":             content,
        "summary":             summary,
        "tool_name":           "Tavily Web Search + Salary API",
        "tool_query":          query,
        "tool_result_snippet": snippet,
        "rag_used":            True,
        "workforce_plan":      workforce_plan,
        "timeline":            timeline,
    }


def ceo_revise(
    idea: str,
    prev_proposal: str,
    critiques: list[dict],
    round_num: int,
    fast: bool = False,
    # No document_id here — revision synthesises critique summaries only.
    # Re-querying the document here would add tokens with no new signal.
) -> dict:
    """
    CONTEXT COMPRESSION IN ACTION:
    We pass critique["summary"] (150 tokens each) instead of critique["content"]
    (potentially 600 tokens each). For 4 critique agents this saves ~1800 tokens
    per revision round while preserving all actionable signal.
    """
    critique_text = "\n".join(
        f"- {c['agent']} (score {c.get('score', '?')}/10): {c.get('summary', c['content'])}"
        for c in critiques
    )
    prompt = (
        f"You are the CEO revising your startup proposal (round {round_num}).\n"
        f"Idea: '{idea}'\nPrevious proposal summary: '{prev_proposal[:400]}'\n\n"
        f"Team critique (compressed for efficiency):\n{critique_text}\n\n"
        "Write a revised proposal (3-4 sentences of prose) that directly addresses "
        "each concern. Reference specific improvements to the financial model, "
        "tech approach, or risk strategy."
    )
    content = call_ai(prompt, fast)
    summary = compress_for_passing("CEO", content)

    return {
        "agent":               "CEO",
        "content":             content,
        "summary":             summary,
        "tool_name":           None,
        "tool_query":          None,
        "tool_result_snippet": None,
    }
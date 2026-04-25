# """
# FoundrAI — Marketing Agent
# Critiques market traction potential using live competitor intelligence.
# """

# from .base import call_ai, build_critique_result
# from tools import search_competitors


# def marketing_critique(idea: str, proposal: str, fast: bool = False) -> dict:
#     query       = f"{idea} competitor pricing"
#     tool_result = search_competitors.invoke(query)
#     snippet     = tool_result[:300]

#     prompt = (
#         f"You are the CMO reviewing this startup proposal for market traction potential.\n"
#         f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
#         f"[LIVE COMPETITOR INTELLIGENCE from Tavily]\n{tool_result}\n\n"
#         "Using the real competitor data above, give a 2-3 sentence critique covering:\n"
#         "- Name specific competitors and their pricing or weaknesses (use the data!)\n"
#         "- Best growth channel and our differentiation strategy\n"
#         "End with exactly: [SCORE: X/10]"
#     )
#     raw = call_ai(prompt, fast)

#     return build_critique_result(
#         agent="Marketing",
#         raw=raw,
#         tool_name="Tavily Competitor Intel",
#         tool_query=query,
#         tool_snippet=snippet,
#     )

"""
FoundrAI — Marketing Agent
Critiques market traction potential using live competitor intelligence.
"""

from .base import call_ai, build_critique_result
from tools import search_competitors


def marketing_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    # 1. Live competitor intelligence
    query       = f"{idea} competitor pricing"
    tool_result = search_competitors.invoke(query)
    snippet     = tool_result[:300]

    # 2. User uploaded document — Marketing queries for market-relevant chunks only
    user_doc_section = ""
    if document_id:
        from document_store import query_user_document
        user_doc_context = query_user_document(
            document_id,
            specialty_query="market size competitors customer acquisition growth channels marketing strategy",
        )
        if user_doc_context:
            user_doc_section = (
                f"[USER UPLOADED DOCUMENT — MARKET CONTEXT]\n{user_doc_context}\n\n"
            )

    prompt = (
        f"You are the CMO reviewing this startup proposal for market traction potential.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[LIVE COMPETITOR INTELLIGENCE from Tavily]\n{tool_result}\n\n"
        f"{user_doc_section}"
        "Using the real competitor data above, give a 2-3 sentence critique covering:\n"
        "- Name specific competitors and their pricing or weaknesses (use the data!)\n"
        "- Best growth channel and our differentiation strategy\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw = call_ai(prompt, fast)

    return build_critique_result(
        agent="Marketing",
        raw=raw,
        tool_name="Tavily Competitor Intel",
        tool_query=query,
        tool_snippet=snippet,
    )
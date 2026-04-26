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

# """
# FoundrAI — Marketing Agent
# Critiques market traction potential using live competitor intelligence.
# """

# from .base import call_ai, build_critique_result
# from tools import search_competitors


# def marketing_critique(
#     idea: str,
#     proposal: str,
#     fast: bool = False,
#     document_id: str | None = None,
# ) -> dict:
#     # 1. Live competitor intelligence
#     query       = f"{idea} competitor pricing"
#     tool_result = search_competitors.invoke(query)
#     snippet     = tool_result[:300]

#     # 2. User uploaded document — Marketing queries for market-relevant chunks only
#     user_doc_section = ""
#     if document_id:
#         from document_store import query_user_document
#         user_doc_context = query_user_document(
#             document_id,
#             specialty_query="market size competitors customer acquisition growth channels marketing strategy",
#         )
#         if user_doc_context:
#             user_doc_section = (
#                 f"[USER UPLOADED DOCUMENT — MARKET CONTEXT]\n{user_doc_context}\n\n"
#             )

#     prompt = (
#         f"You are the CMO reviewing this startup proposal for market traction potential.\n"
#         f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
#         f"[LIVE COMPETITOR INTELLIGENCE from Tavily]\n{tool_result}\n\n"
#         f"{user_doc_section}"
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
Critiques market traction potential using live competitor intelligence and influencer data.
"""

import logging
from .base import call_ai, build_critique_result
from tools import search_competitors, search_influencers


def marketing_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    # 1. Live competitor intelligence
    query = f"{idea} competitor pricing"
    try:
        tool_result = search_competitors.invoke(query)
    except Exception as e:
        logging.error(f"Marketing search_competitors failed: {e}")
        tool_result = f"[TOOL ERROR] Competitor search failed: {str(e)}"
    
    snippet = tool_result[:300]

    # 2. Influencer search — results surfaced to frontend as dedicated panel
    try:
        influencer_raw = search_influencers.invoke(idea)
    except Exception as e:
        logging.error(f"Marketing search_influencers failed: {e}")
        influencer_raw = f"[TOOL ERROR] Influencer search failed: {str(e)}"
    
    influencer_list = _parse_influencers(influencer_raw)

    # 3. User uploaded document — Marketing queries for market-relevant chunks only
    user_doc_section = ""
    if document_id:
        try:
            from document_store import query_user_document
            user_doc_context = query_user_document(
                document_id,
                specialty_query="market size competitors customer acquisition growth channels marketing strategy",
            )
            if user_doc_context:
                user_doc_section = (
                    f"[USER UPLOADED DOCUMENT — MARKET CONTEXT]\n{user_doc_context}\n\n"
                )
        except Exception as e:
            logging.error(f"Marketing document query failed: {e}")

    prompt = (
        f"You are the CMO reviewing this startup proposal for market traction potential.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[LIVE COMPETITOR INTELLIGENCE from Tavily]\n{tool_result}\n\n"
        f"[INFLUENCER & COLLABORATOR INTEL]\n{influencer_raw}\n\n"
        f"{user_doc_section}"
        "Using the real data above, provide a detailed and elaborative marketing strategy critique:\n"
        "- Name specific competitors and their pricing or weaknesses (use the data!)\n"
        "- Mention SPECIFIC named influencers or collaborators from the data that we should target.\n"
        "- Outline a detailed growth strategy: top-of-funnel acquisition, conversion tactics, and viral loops.\n"
        "- How do we differentiate and win in this specific landscape?\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw = call_ai(prompt, fast)

    return build_critique_result(
        agent="Marketing",
        raw=raw,
        tool_name="Tavily Competitor & Influencer Intel",
        tool_query=query,
        tool_snippet=snippet,
        extra={"influencers": influencer_list},
    )


def _parse_influencers(raw: str) -> list[dict]:
    """
    Convert the raw Tavily influencer search text into a list of dicts
    the frontend expects: [{name, platform, handle, followers, engagement_rate}].
    Best-effort — returns empty list on any failure.
    """
    if "[TOOL ERROR]" in raw:
        return []
        
    influencers = []
    for line in raw.splitlines():
        line = line.strip().lstrip("•").strip()
        if not line:
            continue
        if line.startswith("Influencer Info:"):
            line = line[len("Influencer Info:"):].strip()
        
        parts = line.split(":", 1)
        name = parts[0].strip()
        desc = parts[1].strip() if len(parts) > 1 else ""
        
        # Don't add if it's just an error message or too short
        if len(name) < 2: continue
        
        influencers.append({
            "name":            name[:60],
            "platform":        "Unknown",
            "handle":          "",
            "followers":       "N/A",
            "engagement_rate": "N/A",
            "description":     desc[:150]
        })
    return influencers[:5]
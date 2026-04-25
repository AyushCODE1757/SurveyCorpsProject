# """
# FoundrAI — Developer Agent
# Critiques technical feasibility using live GitHub data.
# """

# from .base import call_ai, build_critique_result
# from tools import search_github_repos


# def dev_critique(idea: str, proposal: str, fast: bool = False) -> dict:
#     query       = f"{idea} open source"
#     tool_result = search_github_repos.invoke(query)
#     snippet     = tool_result[:300]

#     prompt = (
#         f"You are the Lead Developer reviewing this startup proposal for technical feasibility.\n"
#         f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
#         f"[LIVE GITHUB DATA — similar repos already in this space]\n{tool_result}\n\n"
#         "Using the GitHub data above, give a 2-3 sentence critique covering:\n"
#         "- Whether the tech stack has community support (cite actual repos/languages found)\n"
#         "- Key technical risks or build-vs-buy decisions\n"
#         "End with exactly: [SCORE: X/10]"
#     )
#     raw = call_ai(prompt, fast)

#     return build_critique_result(
#         agent="Developer",
#         raw=raw,
#         tool_name="GitHub Search API",
#         tool_query=query,
#         tool_snippet=snippet,
#     )

"""
FoundrAI — Developer Agent
Critiques technical feasibility using live GitHub data.
"""

from .base import call_ai, build_critique_result
from tools import search_github_repos


def dev_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    # 1. Live GitHub data
    query       = f"{idea} open source"
    tool_result = search_github_repos.invoke(query)
    snippet     = tool_result[:300]

    # 2. User uploaded document — Developer queries for tech-relevant chunks only
    user_doc_section = ""
    if document_id:
        from document_store import query_user_document
        user_doc_context = query_user_document(
            document_id,
            specialty_query="technical architecture tech stack integrations infrastructure engineering",
        )
        if user_doc_context:
            user_doc_section = (
                f"[USER UPLOADED DOCUMENT — TECHNICAL CONTEXT]\n{user_doc_context}\n\n"
            )

    prompt = (
        f"You are the Lead Developer reviewing this startup proposal for technical feasibility.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[LIVE GITHUB DATA — similar repos already in this space]\n{tool_result}\n\n"
        f"{user_doc_section}"
        "Using the GitHub data above, give a 2-3 sentence critique covering:\n"
        "- Whether the tech stack has community support (cite actual repos/languages found)\n"
        "- Key technical risks or build-vs-buy decisions\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw = call_ai(prompt, fast)

    return build_critique_result(
        agent="Developer",
        raw=raw,
        tool_name="GitHub Search API",
        tool_query=query,
        tool_snippet=snippet,
    )
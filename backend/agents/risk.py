# """
# FoundrAI — Risk Agent
# Critiques startup failure risks using RAG knowledge base + Reddit data.
# """

# import json
# from pathlib import Path
# from .base import call_ai, build_critique_result
# from rag import query_for_risks


# def risk_critique(idea: str, proposal: str, fast: bool = False) -> dict:
#     rag_failures = query_for_risks(idea)
#     query        = " ".join(idea.split()[:4])
#     tool_result  = _fetch_reddit_data(query)
#     snippet      = tool_result[:300]

#     prompt = (
#         f"You are the Chief Risk Officer reviewing this startup proposal.\n"
#         f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
#         f"[STARTUP FAILURE POST-MORTEMS from knowledge base]\n{rag_failures}\n\n"
#         f"[LIVE REDDIT COMMUNITY DATA]\n{tool_result}\n\n"
#         "Using BOTH the failure patterns above AND the Reddit data, give a 2-3 sentence critique covering:\n"
#         "- Which known startup failure pattern does this idea risk repeating?\n"
#         "- How validated is this problem from Reddit data? (cite actual posts if found)\n"
#         "- Top 2 risks with specific mitigation strategies\n"
#         "End with exactly: [SCORE: X/10]"
#     )
#     raw = call_ai(prompt, fast)

#     return build_critique_result(
#         agent="Risk",
#         raw=raw,
#         tool_name="scrapi_reddit",
#         tool_query=query,
#         tool_snippet=snippet,
#         rag_used=True,
#     )


# def _fetch_reddit_data(query: str) -> str:
#     """
#     Fetch Reddit posts for risk analysis.
#     Isolated here so the agent function stays clean.
#     Falls back gracefully — never crashes the simulation.
#     """
#     try:
#         from scrapi_reddit import (
#             build_session, ScrapeOptions,
#             build_search_target, process_listing,
#         )
#         output_dir = Path("./reddit_data")
#         session    = build_session("risk-critique-app/1.0", verify=True)
#         options    = ScrapeOptions(
#             output_root=output_dir,
#             listing_limit=5,
#             comment_limit=0,
#             delay=3.0,
#             time_filter="year",
#             output_formats={"json"},
#         )
#         target = build_search_target(query=query, sort="relevance", time_filter="year")
#         process_listing(target, session=session, options=options)

#         snippets = []
#         if output_dir.exists():
#             for json_file in output_dir.rglob("*.json"):
#                 with open(json_file, "r", encoding="utf-8") as f:
#                     post  = json.load(f)
#                     title = post.get("title", "No Title")
#                     sub   = post.get("subreddit", "unknown")
#                     body  = str(post.get("selftext", ""))[:150]
#                     snippets.append(f'• r/{sub}: "{title}" - {body}...')

#         return "\n".join(snippets) if snippets else "No relevant Reddit discussions found."
#     except Exception as e:
#         return f"Reddit data unavailable: {str(e)}"


"""
FoundrAI — Risk Agent
Critiques startup failure risks using RAG knowledge base + Reddit data.
"""

import json
from pathlib import Path
from .base import call_ai, build_critique_result
from rag import query_for_risks


def risk_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    # 1. Knowledge base RAG for failure patterns
    rag_failures = query_for_risks(idea)

    # 2. Live Reddit data
    query       = " ".join(idea.split()[:4])
    tool_result = _fetch_reddit_data(query)
    snippet     = tool_result[:300]

    # 3. User uploaded document — Risk queries for risk-relevant chunks only
    user_doc_section = ""
    if document_id:
        from document_store import query_user_document
        user_doc_context = query_user_document(
            document_id,
            specialty_query="risks failures mistakes challenges problems regulatory compliance threats",
        )
        if user_doc_context:
            user_doc_section = (
                f"[USER UPLOADED DOCUMENT — RISK CONTEXT]\n{user_doc_context}\n\n"
            )

    prompt = (
        f"You are the Chief Risk Officer reviewing this startup proposal.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[STARTUP FAILURE POST-MORTEMS from knowledge base]\n{rag_failures}\n\n"
        f"[LIVE REDDIT COMMUNITY DATA]\n{tool_result}\n\n"
        f"{user_doc_section}"
        "Using BOTH the failure patterns above AND the Reddit data, give a 2-3 sentence critique covering:\n"
        "- Which known startup failure pattern does this idea risk repeating?\n"
        "- How validated is this problem from Reddit data? (cite actual posts if found)\n"
        "- Top 2 risks with specific mitigation strategies\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw = call_ai(prompt, fast)

    return build_critique_result(
        agent="Risk",
        raw=raw,
        tool_name="scrapi_reddit",
        tool_query=query,
        tool_snippet=snippet,
        rag_used=True,
    )


def _fetch_reddit_data(query: str) -> str:
    """
    Fetch Reddit posts for risk analysis.
    Isolated here so the agent function stays clean.
    Falls back gracefully — never crashes the simulation.
    """
    try:
        from scrapi_reddit import (
            build_session, ScrapeOptions,
            build_search_target, process_listing,
        )
        output_dir = Path("./reddit_data")
        session    = build_session("risk-critique-app/1.0", verify=True)
        options    = ScrapeOptions(
            output_root=output_dir,
            listing_limit=5,
            comment_limit=0,
            delay=3.0,
            time_filter="year",
            output_formats={"json"},
        )
        target = build_search_target(query=query, sort="relevance", time_filter="year")
        process_listing(target, session=session, options=options)

        snippets = []
        if output_dir.exists():
            for json_file in output_dir.rglob("*.json"):
                with open(json_file, "r", encoding="utf-8") as f:
                    post  = json.load(f)
                    title = post.get("title", "No Title")
                    sub   = post.get("subreddit", "unknown")
                    body  = str(post.get("selftext", ""))[:150]
                    snippets.append(f'• r/{sub}: "{title}" - {body}...')

        return "\n".join(snippets) if snippets else "No relevant Reddit discussions found."
    except Exception as e:
        return f"Reddit data unavailable: {str(e)}"
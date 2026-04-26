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

# """
# FoundrAI — Developer Agent
# Critiques technical feasibility using live GitHub data.
# """

# from .base import call_ai, build_critique_result
# from tools import search_github_repos


# def dev_critique(
#     idea: str,
#     proposal: str,
#     fast: bool = False,
#     document_id: str | None = None,
# ) -> dict:
#     # 1. Live GitHub data
#     query       = f"{idea} open source"
#     tool_result = search_github_repos.invoke(query)
#     snippet     = tool_result[:300]

#     # 2. User uploaded document — Developer queries for tech-relevant chunks only
#     user_doc_section = ""
#     if document_id:
#         from document_store import query_user_document
#         user_doc_context = query_user_document(
#             document_id,
#             specialty_query="technical architecture tech stack integrations infrastructure engineering",
#         )
#         if user_doc_context:
#             user_doc_section = (
#                 f"[USER UPLOADED DOCUMENT — TECHNICAL CONTEXT]\n{user_doc_context}\n\n"
#             )

#     prompt = (
#         f"You are the Lead Developer reviewing this startup proposal for technical feasibility.\n"
#         f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
#         f"[LIVE GITHUB DATA — similar repos already in this space]\n{tool_result}\n\n"
#         f"{user_doc_section}"
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
Critiques technical feasibility using live GitHub data and generates a tech stack table.
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
        f"You are the Chief Technology Officer (CTO) reviewing this startup proposal for technical feasibility.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[LIVE GITHUB DATA — similar repos already in this space]\n{tool_result}\n\n"
        f"{user_doc_section}"
        "CRITICAL INSTRUCTIONS: Ground your technical recommendations in reality. If the uploaded document specifies a tech stack, use it. Otherwise, recommend a modern, highly-scalable, production-ready stack. Do not yap.\n\n"
        "Provide your critique strictly in this format:\n\n"
        "- Community Support: State if the required tech has open-source support (cite the exact GitHub repos/languages found in the data).\n"
        "- Technical Risks: Identify the hardest engineering challenge or critical build-vs-buy decision.\n\n"
        "### Recommended Tech Stack\n"
        "Provide a strict Markdown table. Do not deviate from these columns.\n"
        "| Layer | Technology | Function | Why chosen? |\n"
        "|---|---|---|---|\n"
        "| Frontend | (e.g., Next.js/React) | (What it handles) | (Brief reason) |\n"
        "| Backend | (e.g., FastAPI/Node) | (What it handles) | (Brief reason) |\n"
        "| Database | (e.g., PostgreSQL) | (What it handles) | (Brief reason) |\n"
        "| Services | (e.g., Redis/Docker) | (What it handles) | (Brief reason) |\n\n"
        "End with exactly: [SCORE: X/10] as your explicit feasibility score with a 1-sentence reasoning."
    )
    raw = call_ai(prompt, fast)

    return build_critique_result(
        agent="Developer",
        raw=raw,
        tool_name="GitHub Search API",
        tool_query=query,
        tool_snippet=snippet,
    )
# """
# FoundrAI — Legal Agent
# Checks patent landscape and regulatory exposure.
# Legal does NOT participate in consensus scoring (separate gate).
# """

# from .base import call_ai, compress_for_passing
# from rag import query_legal_kb
# from tools import search_patents, search_regulations


# def legal_critique(idea: str, proposal: str, fast: bool = False) -> dict:
#     rag_legal   = query_legal_kb(idea)
#     patents     = search_patents.invoke(f"patents related to {idea}")
#     regulations = search_regulations.invoke(f"regulations for {idea}")
#     snippet     = (patents[:150] + " | " + regulations[:150])

#     prompt = (
#         f"You are the Chief Legal Officer reviewing this startup proposal for legal exposure.\n"
#         f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
#         f"[LEGAL KNOWLEDGE BASE]\n{rag_legal}\n\n"
#         f"[LIVE PATENT DATA]\n{patents}\n\n"
#         f"[LIVE REGULATORY DATA]\n{regulations}\n\n"
#         "Using the data above, give a structured legal critique covering:\n"
#         "- Patent landscape (existing blockers)\n"
#         "- Regulatory compliance (GDPR, HIPAA, etc.)\n"
#         "- Country-specific policy & labour law risk\n"
#         "Output exactly in this format:\n"
#         "Legal Risk Score: X/10 (lower = more risk)\n"
#         "| Area | Finding | Severity | Recommendation |\n"
#         "|---|---|---|---|\n"
#         "... (at least 3 rows)\n"
#     )
#     raw     = call_ai(prompt, fast)
#     summary = compress_for_passing("Legal", raw)

#     return {
#         "agent":               "Legal",
#         "content":             raw,
#         "summary":             summary,
#         "tool_name":           "Tavily Legal Search",
#         "tool_query":          f"patents + regulations for {idea}",
#         "tool_result_snippet": snippet,
#         "rag_used":            True,
#     }

"""
FoundrAI — Legal Agent
Checks patent landscape and regulatory exposure.
Legal does NOT participate in consensus scoring (separate gate).
"""

from .base import call_ai, compress_for_passing
from rag import query_legal_kb
from tools import search_patents, search_regulations


def legal_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    # 1. Knowledge base RAG for legal frameworks
    rag_legal   = query_legal_kb(idea)

    # 2. Live patent and regulatory data
    patents     = search_patents.invoke(f"patents related to {idea}")
    regulations = search_regulations.invoke(f"regulations for {idea}")
    snippet     = (patents[:150] + " | " + regulations[:150])

    # 3. User uploaded document — Legal queries for compliance-relevant chunks only
    user_doc_section = ""
    if document_id:
        from document_store import query_user_document
        user_doc_context = query_user_document(
            document_id,
            specialty_query="legal compliance regulations data privacy IP contracts terms liability",
        )
        if user_doc_context:
            user_doc_section = (
                f"[USER UPLOADED DOCUMENT — LEGAL CONTEXT]\n{user_doc_context}\n\n"
            )

    prompt = (
        f"You are the Chief Legal Officer reviewing this startup proposal for legal exposure.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[LEGAL KNOWLEDGE BASE]\n{rag_legal}\n\n"
        f"[LIVE PATENT DATA]\n{patents}\n\n"
        f"[LIVE REGULATORY DATA]\n{regulations}\n\n"
        f"{user_doc_section}"
        "Using the data above, give a structured legal critique covering:\n"
        "- Patent landscape (existing blockers)\n"
        "- Regulatory compliance (GDPR, HIPAA, etc.)\n"
        "- Country-specific policy & labour law risk\n"
        "Output exactly in this format:\n"
        "Legal Risk Score: X/10 (lower = more risk)\n"
        "| Area | Finding | Severity | Recommendation |\n"
        "|---|---|---|---|\n"
        "... (at least 3 rows)\n"
    )
    raw     = call_ai(prompt, fast)
    summary = compress_for_passing("Legal", raw)

    return {
        "agent":               "Legal",
        "content":             raw,
        "summary":             summary,
        "tool_name":           "Tavily Legal Search",
        "tool_query":          f"patents + regulations for {idea}",
        "tool_result_snippet": snippet,
        "rag_used":            True,
    }
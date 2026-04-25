# """
# FoundrAI — Finance Agent
# Critiques financial viability using live Google Trends data.
# """

# import json
# from .base import call_ai, build_critique_result
# from tools import get_google_trends


# def finance_critique(idea: str, proposal: str, fast: bool = False) -> dict:
#     query       = " ".join(idea.split()[:3])
#     tool_result = get_google_trends.invoke(query)
#     snippet     = tool_result[:300]

#     try:
#         trends_data = json.loads(tool_result)
#         chart_data  = trends_data.get("chart_data", [])
#         trend_text  = (
#             f"Keyword '{trends_data.get('keyword')}' is {trends_data.get('trend')}. "
#             f"Avg interest: {trends_data.get('avg')}/100, Peak: {trends_data.get('peak')}, "
#             f"Recent: {trends_data.get('recent')}."
#         )
#     except Exception:
#         chart_data = []
#         trend_text = tool_result

#     prompt = (
#         f"You are the CFO reviewing this startup proposal for financial viability.\n"
#         f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
#         f"[LIVE GOOGLE TRENDS DATA]\n{trend_text}\n\n"
#         "Using the trend data above, give a structured critique covering:\n"
#         "- Whether market demand is growing or shrinking (cite the trend numbers)\n"
#         "- ROI projection: Year 1, Year 2, Year 3 with assumptions stated\n"
#         "- Burn rate estimate: monthly burn at each stage\n"
#         "- Break-even analysis: month number and revenue required\n"
#         "- TAM estimate and key unit economics (CAC, LTV)\n"
#         "End with exactly: [SCORE: X/10] as your explicit feasibility score with reasoning."
#     )
#     raw = call_ai(prompt, fast)

#     return build_critique_result(
#         agent="Finance",
#         raw=raw,
#         tool_name="Google Trends (PyTrends)",
#         tool_query=query,
#         tool_snippet=snippet,
#         extra={"chart_data": chart_data},
#     )

"""
FoundrAI — Finance Agent
Critiques financial viability using live Google Trends data.
"""

import json
from .base import call_ai, build_critique_result
from tools import get_google_trends


def finance_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    # 1. Live Google Trends data
    query       = " ".join(idea.split()[:3])
    tool_result = get_google_trends.invoke(query)
    snippet     = tool_result[:300]

    try:
        trends_data = json.loads(tool_result)
        chart_data  = trends_data.get("chart_data", [])
        trend_text  = (
            f"Keyword '{trends_data.get('keyword')}' is {trends_data.get('trend')}. "
            f"Avg interest: {trends_data.get('avg')}/100, Peak: {trends_data.get('peak')}, "
            f"Recent: {trends_data.get('recent')}."
        )
    except Exception:
        chart_data = []
        trend_text = tool_result

    # 2. User uploaded document — Finance queries for financial-relevant chunks only
    user_doc_section = ""
    if document_id:
        from document_store import query_user_document
        user_doc_context = query_user_document(
            document_id,
            specialty_query="revenue projections costs burn rate financial model fundraising unit economics",
        )
        if user_doc_context:
            user_doc_section = (
                f"[USER UPLOADED DOCUMENT — FINANCIAL CONTEXT]\n{user_doc_context}\n\n"
            )

    prompt = (
        f"You are the CFO reviewing this startup proposal for financial viability.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[LIVE GOOGLE TRENDS DATA]\n{trend_text}\n\n"
        f"{user_doc_section}"
        "Using the trend data above, give a structured critique covering:\n"
        "- Whether market demand is growing or shrinking (cite the trend numbers)\n"
        "- ROI projection: Year 1, Year 2, Year 3 with assumptions stated\n"
        "- Burn rate estimate: monthly burn at each stage\n"
        "- Break-even analysis: month number and revenue required\n"
        "- TAM estimate and key unit economics (CAC, LTV)\n"
        "End with exactly: [SCORE: X/10] as your explicit feasibility score with reasoning."
    )
    raw = call_ai(prompt, fast)

    return build_critique_result(
        agent="Finance",
        raw=raw,
        tool_name="Google Trends (PyTrends)",
        tool_query=query,
        tool_snippet=snippet,
        extra={"chart_data": chart_data},
    )
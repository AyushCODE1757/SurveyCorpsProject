"""
FoundrAI — Legal Agent (Upgraded)
Checks the startup idea for legal exposure BEFORE the founder commits resources.

Checks:
  1. Patent landscape        — existing patents that could block the product
  2. Regulatory compliance   — GDPR / HIPAA / FINRA / FDA based on data_sensitivity
  3. Country-specific policy — primary market requirements (incorporation, licensing)
  4. Labour law              — employee vs contractor classification, equity/vesting
  5. IP ownership            — open-source license conflicts in the proposed tech stack

Tools:
  search_patents(idea)              — Tavily → Google Patents
  search_regulations(industry, country) — Tavily → regulatory landscape
  query_legal_kb(topic)             — ChromaDB over legal_frameworks.txt + labour_laws.txt

Legal does NOT participate in consensus scoring (separate gate in the orchestrator).
"""

from .base import call_ai, compress_for_passing
from rag import query_legal_kb
from tools import search_patents, search_regulations


def _detect_regulations(idea: str, proposal: str) -> list[str]:
    """
    Heuristically detect which regulatory regimes are most relevant
    based on keywords in the idea and proposal text.
    Returns a list of applicable framework names for the prompt.
    """
    text = (idea + " " + proposal).lower()
    frameworks = []

    if any(kw in text for kw in ["health", "medical", "patient", "ehr", "hospital", "clinical", "hipaa"]):
        frameworks.append("HIPAA (US health data)")
    if any(kw in text for kw in ["eu", "europe", "gdpr", "personal data", "user data", "privacy"]):
        frameworks.append("GDPR (EU personal data)")
    if any(kw in text for kw in ["california", "ccpa", "consumer privacy"]):
        frameworks.append("CCPA (California)")
    if any(kw in text for kw in ["finance", "fintech", "trading", "investment", "broker", "fund", "finra", "sec", "crypto", "payment"]):
        frameworks.append("FINRA / SEC (US finance)")
    if any(kw in text for kw in ["food", "drug", "supplement", "device", "fda", "medtech", "biotech"]):
        frameworks.append("FDA (US food & drug)")
    if any(kw in text for kw in ["children", "kids", "school", "education", "coppa"]):
        frameworks.append("COPPA (children's data)")
    if any(kw in text for kw in ["ai", "artificial intelligence", "model", "algorithm", "automated decision"]):
        frameworks.append("EU AI Act (AI systems)")

    return frameworks if frameworks else ["GDPR (general baseline)", "CCPA (California baseline)"]


def _detect_country(idea: str, proposal: str) -> str:
    """Guess primary market from text; default to US."""
    text = (idea + " " + proposal).lower()
    if any(kw in text for kw in ["india", "indian", "bharat"]):
        return "India"
    if any(kw in text for kw in ["uk", "united kingdom", "britain"]):
        return "United Kingdom"
    if any(kw in text for kw in ["europe", "eu ", "germany", "france"]):
        return "European Union"
    if any(kw in text for kw in ["canada", "canadian"]):
        return "Canada"
    if any(kw in text for kw in ["australia", "australian"]):
        return "Australia"
    return "United States"


def legal_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    """
    Full 5-point legal exposure check.
    Returns a dict with keys: agent, content, summary, tool_name,
    tool_query, tool_result_snippet, rag_used.
    (No score — Legal is a separate gate, not a consensus participant.)
    """
    # ── 1. Detect applicable regulatory landscape ─────────────────────────────
    applicable_regs = _detect_regulations(idea, proposal)
    primary_country = _detect_country(idea, proposal)
    reg_context     = ", ".join(applicable_regs)

    # ── 2. RAG — legal frameworks + labour laws ───────────────────────────────
    rag_legal = query_legal_kb(idea)

    # ── 3. Live patent search ─────────────────────────────────────────────────
    patents = search_patents.invoke(f"patents related to {idea}")

    # ── 4. Live regulatory search (industry + country) ────────────────────────
    reg_query   = f"{idea} compliance regulations {primary_country} {' '.join(applicable_regs[:2])}"
    regulations = search_regulations.invoke(reg_query)

    snippet = (patents[:200] + " | " + regulations[:200])

    # ── 5. Optional user-uploaded document context ────────────────────────────
    user_doc_section = ""
    if document_id:
        try:
            from document_store import query_user_document
            ctx = query_user_document(
                document_id,
                specialty_query="legal compliance regulations data privacy IP contracts terms liability",
            )
            if ctx:
                user_doc_section = f"[USER UPLOADED DOCUMENT — LEGAL CONTEXT]\n{ctx}\n\n"
        except Exception:
            pass

    # ── 6. Build LLM prompt (5-point structured analysis) ─────────────────────
    prompt = (
        f"You are the Chief Legal Officer reviewing this startup for legal exposure BEFORE the founder commits resources.\n"
        f"Startup idea: '{idea}'\n"
        f"Primary market: {primary_country}\n"
        f"Applicable regulatory frameworks detected: {reg_context}\n\n"
        f"Proposal summary: '{proposal[:400]}'\n\n"
        f"[LEGAL KNOWLEDGE BASE — frameworks & labour law]\n{rag_legal}\n\n"
        f"[LIVE PATENT DATA]\n{patents}\n\n"
        f"[LIVE REGULATORY DATA]\n{regulations}\n\n"
        f"{user_doc_section}"
        "Provide a structured 5-point legal exposure check covering ALL of the following areas:\n\n"
        "1. PATENT LANDSCAPE — Are there existing patents that could block this product? "
        "Name specific risk areas and whether a Freedom-to-Operate search is recommended.\n\n"
        "2. REGULATORY COMPLIANCE — Based on the detected frameworks above, what must the startup comply with? "
        "Include timelines and estimated compliance costs where possible.\n\n"
        "3. COUNTRY-SPECIFIC POLICY — For the primary market, what are the incorporation requirements, "
        "licensing needs, and local legal obligations?\n\n"
        "4. LABOUR LAW — Identify employment vs contractor classification risks, equity vesting compliance "
        "(83b election, cliff schedules), and any international hiring risks.\n\n"
        "5. IP OWNERSHIP — Flag any open-source license conflicts in the likely tech stack "
        "(GPL/AGPL vs MIT/Apache 2.0), IP assignment risks, and trade secret concerns.\n\n"
        "Output EXACTLY in this format (no preamble):\n"
        "Legal Risk Score: X/10 (lower = more legal risk)\n"
        "| Area | Finding | Severity | Recommendation |\n"
        "|---|---|---|---|\n"
        "| Patent Landscape | ... | High/Medium/Low | ... |\n"
        "| Regulatory Compliance | ... | High/Medium/Low | ... |\n"
        "| Country Policy | ... | High/Medium/Low | ... |\n"
        "| Labour Law | ... | High/Medium/Low | ... |\n"
        "| IP Ownership | ... | High/Medium/Low | ... |\n"
    )

    raw     = call_ai(prompt, fast, max_tokens=800)
    summary = compress_for_passing("Legal", raw)

    return {
        "agent":               "Legal",
        "content":             raw,
        "summary":             summary,
        "tool_name":           "Tavily Legal Search (Patents + Regulations)",
        "tool_query":          f"patents + {reg_context} for: {idea}",
        "tool_result_snippet": snippet,
        "rag_used":            True,
        # No score field — Legal is a separate gate, not a consensus participant
    }
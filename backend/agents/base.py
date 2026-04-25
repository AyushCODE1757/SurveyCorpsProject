"""
FoundrAI — BaseAgent
All agents inherit from this. Swap LLM provider here only — nowhere else.
"""

import os
import re
import json
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN", "")

# Two-tier model strategy: compression uses fast/cheap, synthesis uses best.
FAST_MODEL   = "Qwen/Qwen2.5-7B-Instruct"
NORMAL_MODEL = "Qwen/Qwen2.5-72B-Instruct"

# Max tokens for a compressed agent summary passed to downstream agents.
# Keeps the revision loop from ballooning.
SUMMARY_MAX_TOKENS = 150


def _get_client() -> InferenceClient:
    return InferenceClient(api_key=HF_TOKEN)


def call_ai(prompt: str, fast: bool = False, max_tokens: int = 600) -> str:
    """
    Central LLM call. All agents go through here.
    fast=True uses the cheaper 7B model (used for compression passes).
    """
    if not HF_TOKEN or HF_TOKEN.startswith("your_"):
        return f"[MOCK] No HF_TOKEN. Prompt preview: {prompt[:80]}..."
    try:
        client   = _get_client()
        model    = FAST_MODEL if fast else NORMAL_MODEL
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.75,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"[AI_ERROR] {str(e)}"


def compress_for_passing(agent_name: str, full_output: str, fast: bool = True) -> str:
    """
    Produces a <=150-token summary of an agent's full output.
    This is what gets passed between agents in the revision loop
    instead of the full text — solves the context window bomb.

    Uses the fast 7B model to keep cost low.
    """
    prompt = (
        f"You are summarizing a {agent_name} agent's analysis for use by other agents.\n"
        f"Summarize the following in exactly 2 sentences. "
        f"Include the score if present. Be concrete, no fluff:\n\n{full_output[:1200]}"
    )
    return call_ai(prompt, fast=True, max_tokens=SUMMARY_MAX_TOKENS)


def parse_score(raw: str) -> float:
    """Extract [SCORE: X/10] from agent output. Defaults to 5.0 if not found."""
    match = re.search(r"\[SCORE:\s*(\d+(?:\.\d+)?)/10\]", raw, re.IGNORECASE)
    return float(match.group(1)) if match else 5.0


def strip_score_tag(raw: str) -> str:
    """Remove [SCORE: X/10] tag from display text."""
    return re.sub(r"\[SCORE:\s*\d+(?:\.\d+)?/10\]", "", raw, flags=re.IGNORECASE).strip()


def build_critique_result(
    agent: str,
    raw: str,
    tool_name: str | None = None,
    tool_query: str | None = None,
    tool_snippet: str | None = None,
    rag_used: bool = False,
    extra: dict | None = None,
) -> dict:
    """
    Standard shape every critique agent must return.
    Enforcing this shape here means the orchestrator can always
    trust the keys it reads.
    """
    score   = parse_score(raw)
    content = strip_score_tag(raw)
    summary = compress_for_passing(agent, content)

    result = {
        "agent":               agent,
        "content":             content,
        "summary":             summary,   # ← what revision loop uses
        "score":               score,
        "tool_name":           tool_name,
        "tool_query":          tool_query,
        "tool_result_snippet": tool_snippet,
        "rag_used":            rag_used,
    }
    if extra:
        result.update(extra)
    return result
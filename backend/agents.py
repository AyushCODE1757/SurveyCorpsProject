"""
FoundrAI 2.0 — Agent definitions (Tool-Augmented + RAG-Grounded)
Each agent: 1) fetches live data via @tool  2) queries ChromaDB RAG (where applicable)  3) LLM synthesizes
"""

import os
import re
import json as _json
from dotenv import load_dotenv
from huggingface_hub import InferenceClient
import scrapireddit

# Referencing old version for rag queries
from rag import query_for_idea, query_for_risks, query_for_pitch

load_dotenv()

# Load all tokens from .env
HF_TOKEN       = os.getenv("HF_TOKEN")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL   = os.getenv("DATABASE_URL")
SECRET_KEY     = os.getenv("SECRET_KEY")

FAST_MODEL   = "Qwen/Qwen2.5-7B-Instruct"
NORMAL_MODEL = "Qwen/Qwen2.5-72B-Instruct"

def get_client():
    return InferenceClient(api_key=HF_TOKEN)

def call_ai(prompt: str, fast: bool = False) -> str:
    if not HF_TOKEN or HF_TOKEN.startswith("your_"):
        return f"[MOCK] No HF_TOKEN. Prompt preview: {prompt[:60]}..."
    try:
        client   = get_client()
        model    = FAST_MODEL if fast else NORMAL_MODEL
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600,
            temperature=0.75,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error calling AI: {str(e)}"

def _parse_critique(raw: str, agent: str) -> dict:
    score = 5.0
    match = re.search(r'\[SCORE:\s*(\d+(?:\.\d+)?)/10\]', raw, re.IGNORECASE)
    if match:
        score = float(match.group(1))
        raw   = raw[:match.start()].strip()
    return {"agent": agent, "content": raw, "score": score}

# ── PHASE 2: Risk Critique ────────────────────────────────────────────────────
def risk_critique(idea: str, proposal: str, fast: bool = False) -> dict:
    # 1. Old Version RAG lookup for startup failures
    rag_failures = query_for_risks(idea)
    
    # 2. Implement risk using the open source reddit library scrapireddit
    query        = " ".join(idea.split()[:4])
    
    # Using scrapireddit resources to get recent relevant posts
    try:
        # Example of using scrapireddit to fetch subreddit data/pain points
        posts = scrapireddit.search(query=query, limit=5, sort="relevance")
        snippets = []
        for post in posts:
            snippets.append(f"• r/{post.subreddit}: \"{post.title}\" - {str(post.selftext)[:150]}...")
        tool_result = "\n".join(snippets) if snippets else "No relevant Reddit discussions found."
    except Exception as e:
        tool_result = f"Failed to retrieve Reddit posts via scrapireddit: {str(e)}"
    
    snippet = tool_result[:300]

    prompt = (
        f"You are the Chief Risk Officer reviewing this startup proposal.\n"
        f"Startup idea: '{idea}'\nProposal: '{proposal}'\n\n"
        f"[STARTUP FAILURE POST-MORTEMS from knowledge base]\n{rag_failures}\n\n"
        f"[LIVE REDDIT COMMUNITY DATA via scrapireddit]\n{tool_result}\n\n"
        "Using BOTH the failure patterns above AND the Reddit data, give a 2-3 sentence critique covering:\n"
        "- Which known startup failure pattern (from the knowledge base) does this idea risk repeating?\n"
        "- How validated is this problem from Reddit data? (cite actual posts if found)\n"
        "- Top 2 risks with specific mitigation strategies\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw    = call_ai(prompt, fast)
    result = _parse_critique(raw, "Risk")
    result.update({
        "tool_name": "scrapireddit",
        "tool_query": query,
        "tool_result_snippet": snippet,
        "rag_used": True,
    })
    return result

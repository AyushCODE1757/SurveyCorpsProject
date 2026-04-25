"""
FoundrAI 2.0 — Agent definitions (Tool-Augmented + RAG-Grounded)
Each agent: 1) fetches live data via @tool  2) CEO/Risk/Legal also query ChromaDB RAG  3) LLM synthesizes
"""

import os
import re
import json as _json
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

from tools import (
    search_recent_startups,
    search_competitors,
    search_reddit_pain_points,
    get_google_trends,
    search_github_repos,
    # Legal tools
    search_patents,
    search_regulations,
)
from rag import query_for_idea, query_for_risks, query_for_pitch, query_legal_kb

load_dotenv()

HF_TOKEN     = os.getenv("HF_TOKEN")
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


def _parse_plan(raw: str) -> dict:
    plan = {"raw": raw}
    keys = [
        "Executive Summary",
        "Technology Stack",
        "Financial Model",
        "Marketing Strategy",
        "Risk Assessment",
        "Legal Report",
    ]
    sections = re.split(r'#{2,3}\s*', raw)
    for section in sections:
        section = section.strip()
        for key in keys:
            if section.startswith(key):
                content = section[len(key):].strip()
                content = content.lstrip(": \n")
                if content:
                    plan[key] = content
    return plan


# ── PHASE 1: CEO Proposal ─────────────────────────────────────────────────────

def ceo_propose(idea: str, fast: bool = False) -> dict:
    rag_context = query_for_idea(idea)
    query       = f"recent startups {idea} 2024 2025"
    tool_result = search_recent_startups.invoke(query)
    snippet     = tool_result[:300]

    prompt = (
        f"You are the visionary CEO of a new startup. The idea is: '{idea}'.\n\n"
        f"[YC & PAUL GRAHAM KNOWLEDGE BASE]\n{rag_context}\n\n"
        f"[LIVE MARKET DATA from Tavily web search]\n{tool_result}\n\n"
        "Using BOTH the proven VC wisdom above AND the live market data, draft a concise business proposal "
        "(3-4 sentences) covering:\n"
        "1. Core value proposition that differentiates from what already exists\n"
        "2. Target market (be specific — cite a real segment from the data)\n"
        "3. Go-to-market strategy grounded in what has worked for similar startups\n"
        "Reference specific competitors, PG insights, or YC patterns. Write in prose, no bullet points."
    )
    content = call_ai(prompt, fast)
    return {
        "agent": "CEO",
        "tool_name": "Tavily Web Search",
        "tool_query": query,
        "tool_result_snippet": snippet,
        "rag_used": True,
        "content": content,
    }


# ── PHASE 2: Developer Critique ───────────────────────────────────────────────

def dev_critique(idea: str, proposal: str, fast: bool = False) -> dict:
    query       = f"{idea} open source"
    tool_result = search_github_repos.invoke(query)
    snippet     = tool_result[:300]

    prompt = (
        f"You are the Lead Developer reviewing this startup proposal for technical feasibility.\n"
        f"Startup idea: '{idea}'\nProposal: '{proposal}'\n\n"
        f"[LIVE GITHUB DATA — similar repos already in this space]\n{tool_result}\n\n"
        "Using the GitHub data above, give a 2-3 sentence critique covering:\n"
        "- Whether the tech stack has community support (cite actual repos/languages found)\n"
        "- Key technical risks or build-vs-buy decisions\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw    = call_ai(prompt, fast)
    result = _parse_critique(raw, "Developer")
    result.update({
        "tool_name": "GitHub Search API",
        "tool_query": query,
        "tool_result_snippet": snippet,
    })
    return result


# ── PHASE 2: Finance Critique ─────────────────────────────────────────────────

def finance_critique(idea: str, proposal: str, fast: bool = False) -> dict:
    query       = " ".join(idea.split()[:3])
    tool_result = get_google_trends.invoke(query)
    snippet     = tool_result[:300]

    prompt = (
        f"You are the CFO reviewing this startup proposal for financial viability.\n"
        f"Startup idea: '{idea}'\nProposal: '{proposal}'\n\n"
        f"[LIVE GOOGLE TRENDS DATA]\n{tool_result}\n\n"
        "Using the trend data above, give a 2-3 sentence critique covering:\n"
        "- Whether market demand is growing or shrinking (cite the trend numbers)\n"
        "- Estimated costs and a realistic revenue model\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw    = call_ai(prompt, fast)
    result = _parse_critique(raw, "Finance")
    result.update({
        "tool_name": "Google Trends (PyTrends)",
        "tool_query": query,
        "tool_result_snippet": snippet,
    })
    return result


# ── PHASE 2: Marketing Critique ───────────────────────────────────────────────

def marketing_critique(idea: str, proposal: str, fast: bool = False) -> dict:
    query       = f"{idea} competitor pricing"
    tool_result = search_competitors.invoke(query)
    snippet     = tool_result[:300]

    prompt = (
        f"You are the CMO reviewing this startup proposal for market traction potential.\n"
        f"Startup idea: '{idea}'\nProposal: '{proposal}'\n\n"
        f"[LIVE COMPETITOR INTELLIGENCE from Tavily]\n{tool_result}\n\n"
        "Using the real competitor data above, give a 2-3 sentence critique covering:\n"
        "- Name specific competitors and their pricing or weaknesses (use the data!)\n"
        "- Best growth channel and our differentiation strategy\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw    = call_ai(prompt, fast)
    result = _parse_critique(raw, "Marketing")
    result.update({
        "tool_name": "Tavily Competitor Intel",
        "tool_query": query,
        "tool_result_snippet": snippet,
    })
    return result


# ── PHASE 2: Risk Critique ────────────────────────────────────────────────────

def risk_critique(idea: str, proposal: str, fast: bool = False) -> dict:
    rag_failures = query_for_risks(idea)
    query        = " ".join(idea.split()[:4])
    tool_result  = search_reddit_pain_points.invoke(query)
    snippet      = tool_result[:300]

    prompt = (
        f"You are the Chief Risk Officer reviewing this startup proposal.\n"
        f"Startup idea: '{idea}'\nProposal: '{proposal}'\n\n"
        f"[STARTUP FAILURE POST-MORTEMS from knowledge base]\n{rag_failures}\n\n"
        f"[LIVE REDDIT COMMUNITY DATA — real user pain points]\n{tool_result}\n\n"
        "Using BOTH the failure patterns above AND the Reddit data, give a 2-3 sentence critique covering:\n"
        "- Which known startup failure pattern (from the knowledge base) does this idea risk repeating?\n"
        "- How validated is this problem from Reddit data? (cite actual posts if found)\n"
        "- Top 2 risks with specific mitigation strategies\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw    = call_ai(prompt, fast)
    result = _parse_critique(raw, "Risk")
    result.update({
        "tool_name": "Reddit API (PRAW)",
        "tool_query": query,
        "tool_result_snippet": snippet,
        "rag_used": True,
    })
    return result


# ── PHASE 2: Legal Critique (Grounded by Patents & Regulations) ──────────────

def legal_critique(idea: str, proposal: str, fast: bool = False) -> dict:
    """
    Checks the startup idea for legal exposure before the founder commits resources.
    Runs in parallel with other critiques.
    """
    # Step 1: Query ChromaDB for legal frameworks
    rag_legal = query_legal_kb(idea)

    # Step 2: Live Patent Search
    patent_query = f"patents related to {idea}"
    patents = search_patents.invoke(patent_query)
    
    # Step 3: Regulatory Search
    reg_query = f"regulations for {idea}"
    regulations = search_regulations.invoke(reg_query)

    snippet = (patents[:150] + " | " + regulations[:150])

    prompt = (
        f"You are the Chief Legal Officer reviewing this startup proposal for legal exposure.\n"
        f"Startup idea: '{idea}'\nProposal: '{proposal}'\n\n"
        f"[LEGAL KNOWLEDGE BASE]\n{rag_legal}\n\n"
        f"[LIVE PATENT DATA]\n{patents}\n\n"
        f"[LIVE REGULATORY DATA]\n{regulations}\n\n"
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
    raw = call_ai(prompt, fast)
    
    return {
        "agent": "Legal",
        "tool_name": "Tavily Legal Search",
        "tool_query": f"{patent_query} & {reg_query}",
        "tool_result_snippet": snippet,
        "rag_used": True,
        "content": raw,
    }


# ── PHASE 3: CEO Revision ─────────────────────────────────────────────────────

def ceo_revise(idea: str, prev_proposal: str, critiques: list,
               round_num: int, fast: bool = False) -> dict:
    critique_text = "\n".join(
        f"- {c['agent']} (score {c.get('score', '?')}/10): {c['content']}"
        for c in critiques
    )
    prompt = (
        f"You are the CEO revising your startup proposal (round {round_num}).\n"
        f"Idea: '{idea}'\nPrevious proposal: '{prev_proposal}'\n\n"
        f"Team critique (grounded in real data):\n{critique_text}\n\n"
        "Write a revised proposal (3-4 sentences of prose) that directly addresses each concern. "
        "Reference specific improvements to the financial model, tech approach, or risk strategy."
    )
    content = call_ai(prompt, fast)
    return {
        "agent": "CEO",
        "tool_name": None,
        "tool_query": None,
        "tool_result_snippet": None,
        "content": content,
    }


# ── PHASE 4: Synthesis ────────────────────────────────────────────────────────

def synthesize(idea: str, final_proposal: str, critiques: list,
               fast: bool = False) -> dict:
    critique_text = "\n".join(
        f"- {c['agent']} (grounded in {c.get('tool_name','LLM')}, score {c.get('score','?')}/10):\n  {c['content']}"
        for c in critiques
    )

    prompt = f"""You are the Chief Strategy Officer synthesizing a final business plan for: '{idea}'.

Final CEO proposal: '{final_proposal}'

Agent insights (from real-world data):
{critique_text}

Produce a structured business plan with these exact sections separated by '###':
### Executive Summary
### Technology Stack
### Financial Model
### Marketing Strategy
### Risk Assessment
### Legal Report

Write 2-3 concrete, actionable sentences per section. Cite real data from agent critiques.
"""
    raw = call_ai(prompt, fast)
    return _parse_plan(raw)


# ── DEPLOY: Generate Boilerplate Codebase ────────────────────────────────────

def _extract_tech_table(tech_stack_text: str) -> str:
    lines = tech_stack_text.strip().splitlines()
    table_lines = [l for l in lines if '|' in l]
    if len(table_lines) >= 3:
        return "\n".join(table_lines)
    
    # Minimal fallback table
    return "| Layer | Technology | Purpose | Cost |\n|---|---|---|---|\n| Backend | FastAPI | API Layer | Free |\n| Frontend | Next.js | Web UI | Free |"


def generate_boilerplate(idea: str, plan: dict) -> dict:
    tech_stack_text = plan.get("Technology Stack", "")
    exec_summary    = plan.get("Executive Summary", "")
    
    tech_table = _extract_tech_table(tech_stack_text)
    project_name = "-".join(idea.lower().split()[:4])
    project_name = re.sub(r"[^a-z0-9\-]", "", project_name).strip("-")

    readme = f"# {idea}\n\n{exec_summary}\n\n## Tech Stack\n{tech_table}"
    
    docker_compose = "version: '3.9'\nservices:\n  api:\n    build: .\n    ports: ['8000:8000']"
    
    env_example = "HF_TOKEN=hf_...\nTAVILY_API_KEY=tvly-..."
    
    main_py = "from fastapi import FastAPI\napp = FastAPI()\n@app.get('/')\ndef root(): return {'status': 'ok'}"
    
    return {
        "README.md": readme,
        "docker-compose.yml": docker_compose,
        ".env.example": env_example,
        "app/main.py": main_py,
    }


# ── MONITOR: Auto-Strategy Update ────────────────────────────────────────────

def generate_monitor_update(idea: str, new_market_data: str) -> str:
    prompt = (
        f"You are a startup strategist responding to NEW market intelligence.\n"
        f"Startup idea: '{idea}'\n\n"
        f"[NEW MARKET SIGNALS DETECTED]\n{new_market_data}\n\n"
        "Based on these new signals, write a revised Marketing Strategy (2-3 sentences) that:\n"
        "- Directly responds to the new competitor or trend detected\n"
        "- Adjusts the growth channel or positioning accordingly\n"
        "Start your response with '⚡ UPDATED:'"
    )
    return call_ai(prompt, fast=True)

"""
FoundrAI — Synthesis Agent + Boilerplate Generator
Phase 4: produces the final structured business plan.
"""

import re
from .base import call_ai


def synthesize(
    idea: str,
    final_proposal: str,
    critiques: list[dict],
    fast: bool = False,
) -> dict:
    """
    Uses compressed summaries from each agent for the final synthesis prompt.
    The synthesis model still gets the best model (fast=False) because this
    is the final deliverable — quality matters most here.
    """
    critique_text = "\n".join(
        f"- {c['agent']} (grounded in {c.get('tool_name', 'LLM')}, "
        f"score {c.get('score', '?')}/10):\n  {c.get('summary', c['content'])}"
        for c in critiques
    )

    prompt = f"""You are the Chief Strategy Officer synthesizing a final business plan for: '{idea}'.

Final CEO proposal: '{final_proposal[:600]}'

Agent insights (compressed summaries):
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
    raw = call_ai(prompt, fast=False)   # always use best model for final output
    return _parse_plan(raw)


def _parse_plan(raw: str) -> dict:
    plan    = {"raw": raw}
    keys    = [
        "Executive Summary", "Technology Stack", "Financial Model",
        "Marketing Strategy", "Risk Assessment", "Legal Report",
    ]
    sections = re.split(r"#{2,3}\s*", raw)
    for section in sections:
        section = section.strip()
        for key in keys:
            if section.startswith(key):
                content = section[len(key) :].strip().lstrip(": \n")
                if content:
                    plan[key] = content
    return plan


def generate_boilerplate(idea: str, plan: dict) -> dict:
    tech_stack_text = plan.get("Technology Stack", "")
    exec_summary    = plan.get("Executive Summary", "")
    tech_table      = _extract_tech_table(tech_stack_text)
    project_name    = re.sub(r"[^a-z0-9\-]", "", "-".join(idea.lower().split()[:4])).strip("-")

    readme         = f"# {idea}\n\n{exec_summary}\n\n## Tech Stack\n{tech_table}"
    docker_compose = "version: '3.9'\nservices:\n  api:\n    build: .\n    ports: ['8000:8000']"
    env_example    = "HF_TOKEN=hf_...\nTAVILY_API_KEY=tvly-..."
    main_py        = (
        "from fastapi import FastAPI\n"
        "app = FastAPI()\n"
        "@app.get('/')\n"
        "def root(): return {'status': 'ok'}"
    )

    return {
        "README.md":          readme,
        "docker-compose.yml": docker_compose,
        ".env.example":       env_example,
        "app/main.py":        main_py,
    }


def _extract_tech_table(tech_stack_text: str) -> str:
    lines       = tech_stack_text.strip().splitlines()
    table_lines = [l for l in lines if "|" in l]
    if len(table_lines) >= 3:
        return "\n".join(table_lines)
    return (
        "| Layer | Technology | Purpose | Cost |\n"
        "|---|---|---|---|\n"
        "| Backend | FastAPI | API Layer | Free |\n"
        "| Frontend | Next.js | Web UI | Free |"
    )
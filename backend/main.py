import asyncio
import json
import os
import re

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel

from orchestrator import run_simulation_stream

app = FastAPI(title="FoundrAI 2.0 — Deliberative Multi-Agent System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Models ─────────────────────────────────────────────────────────────

class IdeaRequest(BaseModel):
    idea: str
    fast: bool = False


class DeployRequest(BaseModel):
    idea: str
    plan: dict
    repo_name: str | None = None


class MonitorRequest(BaseModel):
    idea: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def sanitise_repo_name(raw: str) -> str:
    name = raw.strip().lower()
    name = re.sub(r"[^a-z0-9\-]", "-", name)
    name = re.sub(r"-+", "-", name)
    name = name.strip("-")
    return name or "foundrai-project"


# ── Simulate ──────────────────────────────────────────────────────────────────

@app.post("/simulate")
async def simulate(request: IdeaRequest):
    return StreamingResponse(
        run_simulation_stream(request.idea, request.fast),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Approve & Deploy to GitHub ────────────────────────────────────────────────

@app.post("/approve-deploy")
async def approve_deploy(request: DeployRequest):
    from agents import generate_boilerplate
    from tools import deploy_to_github

    if request.repo_name and request.repo_name.strip():
        repo_name = sanitise_repo_name(request.repo_name)
    else:
        repo_name = sanitise_repo_name("-".join(request.idea.lower().split()[:4]) + "-foundrai")

    files: dict = await asyncio.to_thread(generate_boilerplate, request.idea, request.plan)

    repo_url: str = deploy_to_github.invoke({
        "repo_name": repo_name,
        "files_json": json.dumps(files),
    })

    return {
        "repo_url":        repo_url,
        "repo_name":       repo_name,
        "files_generated": list(files.keys()),
    }


# ── Auto-Monitor (Fast-Forward Demo) ─────────────────────────────────────────

@app.post("/monitor")
async def monitor(request: MonitorRequest):
    from tools import search_recent_startups, search_competitors
    from agents import generate_monitor_update

    def _stream():
        def sse(data: dict) -> str:
            return f"data: {json.dumps(data)}\n\n"

        yield sse({"type": "monitor_start",    "idea": request.idea})
        yield sse({"type": "monitor_scanning", "message": f"🔍 Scanning market for '{request.idea}'…"})

        scan_query  = f"{request.idea} new competitor launch 2025"
        fresh_data  = search_recent_startups.invoke(scan_query)
        comp_data   = search_competitors.invoke(request.idea)
        combined    = f"[Latest News]\n{fresh_data}\n\n[Competitor Update]\n{comp_data}"

        yield sse({
            "type":    "monitor_data",
            "message": "📡 New market signals detected",
            "snippet": (fresh_data[:200] + "…") if len(fresh_data) > 200 else fresh_data,
        })

        yield sse({"type": "monitor_updating", "message": "⚡ Auto-revising strategy…"})
        updated_strategy = generate_monitor_update(request.idea, combined)

        yield sse({
            "type":            "monitor_done",
            "updated_section": "Marketing Strategy",
            "updated_content": updated_strategy,
        })

    return StreamingResponse(
        _stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "FoundrAI 2.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

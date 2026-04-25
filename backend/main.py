"""
FoundrAI — FastAPI entrypoint
New in this version:
  - POST /upload        → ingest user document, return document_id
  - POST /simulate      → accepts optional document_id, returns session_id immediately
  - GET  /session/{id}  → replay full session from Redis (handles browser refresh)
  - GET  /health        → unchanged
"""

import asyncio
import json
import os
import re
import uuid

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from orchestrator import run_simulation_stream
from session_store import SessionStore
from document_store import ingest_document

app = FastAPI(title="FoundrAI 2.0 — Deliberative Multi-Agent System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md", ".csv"}
MAX_FILE_SIZE_MB   = 10


# ── Request Models ─────────────────────────────────────────────────────────────

class IdeaRequest(BaseModel):
    idea:        str
    fast:        bool = False
    document_id: str | None = None   # optional: attached user document


class DeployRequest(BaseModel):
    idea:      str
    plan:      dict
    repo_name: str | None = None


class MonitorRequest(BaseModel):
    idea: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def sanitise_repo_name(raw: str) -> str:
    name = re.sub(r"[^a-z0-9\-]", "-", raw.strip().lower())
    name = re.sub(r"-+", "-", name).strip("-")
    return name or "foundrai-project"


# ── Upload ────────────────────────────────────────────────────────────────────

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Accepts PDF, DOCX, TXT, CSV.
    Extracts text, chunks it, embeds it into ChromaDB.
    Returns document_id for use in /simulate.
    """
    from pathlib import Path
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size: {MAX_FILE_SIZE_MB}MB",
        )

    try:
        document_id = await ingest_document(file_bytes, file.filename or "upload")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return {
        "document_id": document_id,
        "filename":    file.filename,
        "message":     "Document ingested successfully",
    }


# ── Simulate ──────────────────────────────────────────────────────────────────

@app.post("/simulate")
async def simulate(request: IdeaRequest):
    """
    Starts a simulation. Returns session_id in the first SSE event.
    The frontend stores this session_id in localStorage for replay on refresh.
    """
    session_id = str(uuid.uuid4())

    return StreamingResponse(
        run_simulation_stream(
            idea=request.idea,
            session_id=session_id,
            fast=request.fast,
            document_id=request.document_id,
        ),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Session Replay ────────────────────────────────────────────────────────────

@app.get("/session/{session_id}")
async def replay_session(session_id: str):
    """
    Replays all events from a completed or in-progress session.
    Frontend calls this on mount if localStorage has a session_id.
    If session is complete: streams all events immediately and closes.
    If session not found: 404.
    """
    store = SessionStore()

    if not await store.session_exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found or expired")

    async def _replay_stream():
        events = await store.get_events(session_id)
        for event in events:
            yield f"data: {json.dumps(event)}\n\n"
        yield f"data: {json.dumps({'type': 'replay_complete'})}\n\n"

    return StreamingResponse(
        _replay_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Deploy ────────────────────────────────────────────────────────────────────

@app.post("/approve-deploy")
async def approve_deploy(request: DeployRequest):
    from agents import generate_boilerplate
    from tools import deploy_to_github

    repo_name = sanitise_repo_name(
        request.repo_name or "-".join(request.idea.lower().split()[:4]) + "-foundrai"
    )
    files: dict = await asyncio.to_thread(generate_boilerplate, request.idea, request.plan)
    repo_url: str = deploy_to_github.invoke({
        "repo_name": repo_name,
        "files_json": json.dumps(files),
    })
    return {"repo_url": repo_url, "repo_name": repo_name, "files_generated": list(files.keys())}


# ── Monitor ───────────────────────────────────────────────────────────────────

@app.post("/monitor")
async def monitor(request: MonitorRequest):
    from tools import search_recent_startups, search_competitors
    from agents import generate_monitor_update

    def _stream():
        def sse(data: dict) -> str:
            return f"data: {json.dumps(data)}\n\n"

        yield sse({"type": "monitor_start",    "idea": request.idea})
        yield sse({"type": "monitor_scanning", "message": f"Scanning market for '{request.idea}'..."})

        fresh_data = search_recent_startups.invoke(f"{request.idea} new competitor launch 2025")
        comp_data  = search_competitors.invoke(request.idea)
        combined   = f"[Latest News]\n{fresh_data}\n\n[Competitor Update]\n{comp_data}"

        yield sse({
            "type":    "monitor_data",
            "message": "New market signals detected",
            "snippet": fresh_data[:200],
        })
        yield sse({"type": "monitor_updating", "message": "Auto-revising strategy..."})

        updated = generate_monitor_update(request.idea, combined)
        yield sse({
            "type":            "monitor_done",
            "updated_section": "Marketing Strategy",
            "updated_content": updated,
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
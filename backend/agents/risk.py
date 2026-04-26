import os
import json
import tempfile
import logging
from pathlib import Path
from .base import call_ai, build_critique_result
from rag import query_for_risks

_DEMO_PATH = Path(__file__).parent.parent / "knowledge" / "reddit_demo.txt"

# Standard English stop words to filter out of search queries and fallbacks
STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "if", "for", "to", "of", "in", 
    "with", "on", "is", "it", "my", "i", "want", "build", "create", "make", 
    "platform", "app", "website", "that", "this", "like"
}

# ── Tag taxonomy ──────────────────────────────────────────────────────────────

_TAG_RULES = [
    (["churn", "retention", "drop off", "lose users"],                "Churn Risk"),
    (["hipaa", "gdpr", "compliance", "fda", "regulation"],            "Regulatory Risk"),
    (["competitor", "commodit", "market saturate"],                   "Market Risk"),
    (["cac", "paid ads", "facebook ads", "acquisition cost"],         "CAC Risk"),
    (["enterprise", "sales cycle", "soc2", "procurement"],            "Sales Cycle Risk"),
    (["marketplace", "cold start", "supply side", "chicken and egg"], "Cold Start Risk"),
    (["shut down", "post-mortem", "failed", "closed down"],           "Failure Pattern"),
    (["pivot", "product-market fit", "pmf"],                          "PMF Signal"),
    (["pricing", "underprice", "overcharge"],                         "Pricing Risk"),
]


def _tag_post(title: str, body: str) -> str:
    text = (title + " " + body).lower()
    for keywords, tag in _TAG_RULES:
        if any(kw in text for kw in keywords):
            return tag
    return "Founder Signal"


def _score_to_range(score) -> str:
    try:
        n = int(score)
    except (TypeError, ValueError):
        return "community upvotes"
    if n >= 3000:
        return "3k+ upvotes"
    if n >= 1000:
        return f"{n // 1000}k–{n // 1000 + 1}k upvotes"
    if n >= 500:
        return "500–1k upvotes"
    return f"~{n} upvotes"


# ── Live Reddit search via scrapi_reddit ──────────────────────────────────────

def _search_reddit_live(idea: str) -> list[dict]:
    """
    Uses scrapi_reddit's public-API scraper (no credentials required).
    Writes JSON output to a temp dir, then reads posts.json to build cards.
    Falls back to [] on any error so the agent never crashes.
    """
    try:
        from scrapi_reddit import (
            build_session,
            ScrapeOptions,
            build_search_target,
            process_listing,
        )

        output_dir = Path(tempfile.mkdtemp())

        session = build_session("foundrai/1.0", verify=True)

        options = ScrapeOptions(
            output_root=output_dir,
            listing_limit=7,
            comment_limit=0,
            delay=3.0,
            time_filter="all", # Changed to 'all' for better historical post-mortems
            output_formats={"json"},
        )

        # Extract meaningful keywords, ignoring stop words
        clean_words = [w for w in idea.split() if w.lower() not in STOP_WORDS]
        base_query = " ".join(clean_words[:3])
        
        # Scope the search to relevant subreddits
        business_query = f"{base_query} (subreddit:Entrepreneur OR subreddit:startups OR subreddit:SaaS)"

        target = build_search_target(
            business_query,
            search_types=["post"], # Explicitly prevent pulling comments
            sort="relevance",
            time_filter="all",
        )

        process_listing(target, session=session, options=options)

        # scrapi_reddit writes posts.json under output_root/<label>/posts.json
        cards = []
        for posts_file in output_dir.rglob("posts.json"):
            with open(posts_file, "r", encoding="utf-8") as f:
                listing = json.load(f)

            children = listing.get("data", {}).get("children", [])
            for child in children:
                data    = child.get("data", {})
                title   = data.get("title") or ""
                sub     = data.get("subreddit") or "reddit"
                body    = data.get("selftext") or ""
                score   = data.get("score")
                if not title:
                    continue
                cards.append({
                    "subreddit":    f"r/{sub}",
                    "title":        title,
                    "body_snippet": body[:200].strip(),
                    "score_range":  _score_to_range(score),
                    "relevance_tag": _tag_post(title, body),
                })
                if len(cards) >= 5:
                    break
            if cards:
                break

        return cards

    except Exception as e:
        # Log the error instead of failing silently so you can debug network/dependency issues
        logging.error(f"Live Reddit search failed: {e}")
        return []


# ── Demo file fallback ────────────────────────────────────────────────────────

def _search_reddit_demo(idea: str) -> list[dict]:
    """Parse reddit_demo.txt, rank by keyword overlap, return top cards."""
    try:
        if not _DEMO_PATH.exists():
            return []

        blocks = [b.strip() for b in _DEMO_PATH.read_text(encoding="utf-8").split("---") if b.strip()]
        posts  = []
        for block in blocks:
            lines = block.strip().splitlines()
            if not lines:
                continue
            parts = [p.strip() for p in lines[0].split("|")]
            if len(parts) < 3:
                continue
            body = " ".join(lines[1:]).strip()
            posts.append({
                "subreddit":   parts[0].strip("[] "),
                "upvotes_raw": parts[1].strip(),
                "title":       parts[2].strip(),
                "body":        body,
            })

        # Filter stop words out of the fallback logic so "to" and "a" don't trigger false positives
        kws = [w for w in idea.lower().split() if w not in STOP_WORDS]

        def overlap(p):
            return sum(1 for kw in kws if kw in (p["title"] + " " + p["body"]).lower())

        ranked = sorted(posts, key=overlap, reverse=True)
        # Ensure we only return posts that actually share meaningful keywords
        top    = [p for p in ranked if overlap(p) > 0][:5]

        import re
        def parse_score(raw: str):
            m = re.search(r"([\d.]+)(k?)", raw.lower())
            if not m:
                return None
            return int(float(m.group(1)) * (1000 if m.group(2) == "k" else 1))

        return [
            {
                "subreddit":    p["subreddit"],
                "title":        p["title"],
                "body_snippet": p["body"][:200].strip(),
                "score_range":  _score_to_range(parse_score(p["upvotes_raw"])),
                "relevance_tag": _tag_post(p["title"], p["body"]),
            }
            for p in top
        ]
    except Exception as e:
        logging.error(f"Demo Reddit search failed: {e}")
        return []


# ── LLM prompt text ───────────────────────────────────────────────────────────

def _cards_to_text(cards: list[dict]) -> str:
    if not cards:
        return "No relevant Reddit discussions found."
    return "\n".join(
        f'• {c["subreddit"]}: "{c["title"]}" [{c["score_range"]}] — {c["body_snippet"]}...'
        for c in cards
    )


# ── Main agent function ───────────────────────────────────────────────────────

def risk_critique(
    idea: str,
    proposal: str,
    fast: bool = False,
    document_id: str | None = None,
) -> dict:
    """
    Returns build_critique_result dict plus:
      reddit_posts: list[dict]  — cards for the SSE reddit_result event
    """
    # 1. RAG — startup failure post-mortems
    rag_failures = query_for_risks(idea)

    # 2. Live Reddit via scrapi_reddit; demo fallback
    reddit_posts = _search_reddit_live(idea)
    live         = bool(reddit_posts)
    if not live:
        reddit_posts = _search_reddit_demo(idea)

    reddit_text  = _cards_to_text(reddit_posts)
    snippet      = reddit_text[:300]

    # 3. Optional user-uploaded document
    user_doc_section = ""
    if document_id:
        try:
            from document_store import query_user_document
            ctx = query_user_document(
                document_id,
                specialty_query="risks failures challenges regulatory compliance threats",
            )
            if ctx:
                user_doc_section = f"[USER UPLOADED DOCUMENT — RISK CONTEXT]\n{ctx}\n\n"
        except Exception:
            pass

    source_label = "LIVE REDDIT DATA" if live else "REDDIT COMMUNITY DATABASE"

    prompt = (
        f"You are the Chief Risk Officer reviewing this startup proposal.\n"
        f"Startup idea: '{idea}'\nProposal summary: '{proposal[:400]}'\n\n"
        f"[STARTUP FAILURE POST-MORTEMS from knowledge base]\n{rag_failures}\n\n"
        f"[{source_label}]\n{reddit_text}\n\n"
        f"{user_doc_section}"
        "Using BOTH the failure patterns AND the Reddit data, give a 2-3 sentence critique covering:\n"
        "- Which known startup failure pattern does this idea risk repeating?\n"
        "- How validated is this problem from Reddit? (cite actual post titles where relevant)\n"
        "- Top 2 risks with specific mitigation strategies\n"
        "End with exactly: [SCORE: X/10]"
    )
    raw = call_ai(prompt, fast)

    # result = build_critique_result(
    #     agent="Risk",
    #     raw=raw,
    #     tool_name="scrapi_reddit" if live else "Reddit community database",
    #     tool_query=idea[:60],
    #     tool_snippet=snippet,
    #     rag_used=True,
    # )    
    
    if reddit_posts:
        raw += "\n\n**Community Validation (Reddit):**\n"
        for p in reddit_posts:
            raw += f"- **{p['subreddit']}**: {p['title']} *({p['score_range']})*\n"

    result = build_critique_result(
        agent="Risk",
        raw=raw,
        tool_name="scrapi_reddit" if live else "Reddit community database",
        tool_query=idea[:60],
        tool_snippet=snippet,
        rag_used=True,
    )
    result["reddit_posts"] = reddit_posts
   
    return result
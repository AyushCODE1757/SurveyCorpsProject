"""
FoundrAI 2.0 — LangChain @tool definitions
Each tool wraps a real external API with graceful fallback if the key is missing.
"""

import os
import re
import json
import requests
from dotenv import load_dotenv
from langchain_core.tools import tool

load_dotenv()

TAVILY_KEY = os.getenv("TAVILY_API_KEY", "")


# ── CEO Tool: Live Startup Research via Tavily ────────────────────────────────

@tool
def search_recent_startups(query: str) -> str:
    """Search for recent startups and market trends for a given idea."""
    if not TAVILY_KEY or TAVILY_KEY.startswith("your_"):
        return "[FALLBACK] Tavily key not set. Proceeding without live startup data."
    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=TAVILY_KEY)
        results = client.search(query, max_results=3)
        snippets = []
        for r in results.get("results", []):
            snippets.append(f"• {r.get('title', '')}: {r.get('content', '')[:150]}")
        return "\n".join(snippets[:3]) if snippets else "No results found."
    except Exception as e:
        return f"[TOOL ERROR] Tavily search failed: {str(e)}"


# ── Marketing Tool: Competitor Intelligence via Tavily ────────────────────────

@tool
def search_competitors(query: str) -> str:
    """Search for exact competitors, their pricing, and weaknesses."""
    if not TAVILY_KEY or TAVILY_KEY.startswith("your_"):
        return "[FALLBACK] Tavily key not set. Proceeding without competitor intelligence."
    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=TAVILY_KEY)
        results = client.search(f"competitors pricing alternatives {query}", max_results=3)
        snippets = []
        for r in results.get("results", []):
            snippets.append(f"• {r.get('title', '')}: {r.get('content', '')[:150]}")
        return "\n".join(snippets[:3]) if snippets else "No competitor data found."
    except Exception as e:
        return f"[TOOL ERROR] Tavily competitor search failed: {str(e)}"


@tool
def search_influencers(niche: str) -> str:
    """Search for real named influencers in a niche with follower counts and engagement rates."""
    if not TAVILY_KEY or TAVILY_KEY.startswith("your_"):
        return "[FALLBACK] Tavily key not set. Proceeding without influencer data."
    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=TAVILY_KEY)
        results = client.search(f"{niche} top influencers 2025", max_results=3)
        snippets = []
        for r in results.get("results", []):
            snippets.append(f"• Influencer Info: {r.get('title', '')}: {r.get('content', '')[:150]}")
        return "\n".join(snippets[:3]) if snippets else "No influencer data found."
    except Exception as e:
        return f"[TOOL ERROR] Influencer search failed: {str(e)}"


# ── Risk Tool: Social Proof via Demo Reddit Posts ────────────────────────────

REDDIT_DEMO_PATH = os.path.join(os.path.dirname(__file__), "knowledge", "reddit_demo.txt")

def _load_reddit_posts() -> list[dict]:
    posts = []
    if not os.path.exists(REDDIT_DEMO_PATH):
        return posts
    with open(REDDIT_DEMO_PATH, "r", encoding="utf-8") as f:
        raw = f.read()
    blocks = [b.strip() for b in raw.split("---") if b.strip()]
    for block in blocks:
        lines = block.strip().splitlines()
        if not lines: continue
        header = lines[0]
        body   = "\n".join(lines[1:]).strip()
        parts = [p.strip() for p in header.split("|")]
        subreddit = parts[0].strip("[] ") if len(parts) > 0 else "r/startups"
        title     = parts[2] if len(parts) > 2 else header
        posts.append({"subreddit": subreddit, "title": title, "body": body})
    return posts


@tool
def search_reddit_pain_points(keyword: str) -> str:
    posts = _load_reddit_posts()
    if not posts: return "[FALLBACK] Reddit demo file not found."
    keywords = keyword.lower().split()
    def score(post):
        text = (post["title"] + " " + post["body"]).lower()
        return sum(1 for kw in keywords if kw in text)
    ranked = sorted(posts, key=score, reverse=True)
    top    = [p for p in ranked if score(p) > 0][:5]
    if not top: top = ranked[:3]
    lines = []
    for p in top:
        snippet = p["body"][:180].replace("\n", " ") + "..."
        lines.append(f"• {p['subreddit']}: \"{p['title']}\" — {snippet}")
    return "\n".join(lines)


# ── Finance Tool: Market Demand via PyTrends ──────────────────────────────────

@tool
def get_google_trends(keyword: str) -> str:
    try:
        from pytrends.request import TrendReq
        pytrends = TrendReq(hl="en-US", tz=360, timeout=(5, 10))
        kw = " ".join(keyword.split()[:3])
        pytrends.build_payload([kw], timeframe="today 12-m")
        df = pytrends.interest_over_time()
        if df.empty: return f"No trend data found for '{kw}'."
        avg_interest = int(df[kw].mean())
        peak         = int(df[kw].max())
        recent       = int(df[kw].iloc[-1])
        trend_dir    = "📈 Growing" if df[kw].iloc[-1] > df[kw].iloc[0] else "📉 Declining"
        return f"Keyword: '{kw}' | Trend: {trend_dir}\nAvg interest: {avg_interest} | Peak: {peak} | Last: {recent}"
    except Exception as e:
        return f"[TOOL ERROR] PyTrends failed: {str(e)}"


# ── Developer Tool: GitHub Stack Validator ────────────────────────────────────

@tool
def search_github_repos(query: str) -> str:
    try:
        url      = f"https://api.github.com/search/repositories?q={query}&sort=stars&order=desc"
        response = requests.get(url, timeout=8)
        response.raise_for_status()
        repos = response.json().get("items", [])[:4]
        if not repos: return "No similar GitHub repositories found."
        lines = []
        for repo in repos:
            lang  = repo.get("language") or "Unknown"
            stars = repo.get("stargazers_count", 0)
            desc  = (repo.get("description") or "")[:100]
            lines.append(f"• {repo['full_name']} [{lang}] ⭐{stars:,} — {desc}")
        return "\n".join(lines)
    except Exception as e:
        return f"[TOOL ERROR] GitHub search failed: {str(e)}"


# ── Legal Tools: Patents & Regulations via Tavily ───────────────────────────

@tool
def search_patents(query: str) -> str:
    """Search for existing patents using Tavily (simulated Google Patents search)."""
    if not TAVILY_KEY or TAVILY_KEY.startswith("your_"):
        return "[FALLBACK] Tavily key not set. Proceeding without patent data."
    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=TAVILY_KEY)
        # Force "patent" into the search query
        results = client.search(f"site:patents.google.com {query}", max_results=3)
        snippets = []
        for r in results.get("results", []):
            snippets.append(f"• Patent: {r.get('title', '')}: {r.get('content', '')[:150]}")
        return "\n".join(snippets[:3]) if snippets else "No relevant patents found."
    except Exception as e:
        return f"[TOOL ERROR] Patent search failed: {str(e)}"


@tool
def search_regulations(query: str) -> str:
    """Search for industry regulations (GDPR, HIPAA, etc.) via Tavily."""
    if not TAVILY_KEY or TAVILY_KEY.startswith("your_"):
        return "[FALLBACK] Tavily key not set. Proceeding without regulatory data."
    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=TAVILY_KEY)
        results = client.search(f"compliance regulations {query}", max_results=3)
        snippets = []
        for r in results.get("results", []):
            snippets.append(f"• Reg: {r.get('title', '')}: {r.get('content', '')[:150]}")
        return "\n".join(snippets[:3]) if snippets else "No regulatory data found."
    except Exception as e:
        return f"[TOOL ERROR] Regulatory search failed: {str(e)}"


# ── Developer Agent: Autonomous GitHub Deployment ────────────────────────────

@tool
def deploy_to_github(repo_name: str, files_json: str) -> str:
    github_token = os.getenv("GITHUB_TOKEN", "")
    if not github_token or github_token.startswith("your_"):
        return "[FALLBACK] GITHUB_TOKEN not set."
    try:
        from github import Github, GithubException
        files = json.loads(files_json)
        g     = Github(github_token)
        user  = g.get_user()
        safe_name = re.sub(r"[^a-zA-Z0-9\-]", "-", repo_name.lower()).strip("-")[:80]
        try:
            repo = user.create_repo(safe_name, private=True, auto_init=False)
        except GithubException as e:
            if e.status == 422: repo = user.get_repo(safe_name)
            else: raise
        for i, (filename, content) in enumerate(files.items()):
            try:
                repo.create_file(path=filename, message=f"Add {filename}", content=content, branch="main")
            except: pass
        return repo.html_url
    except Exception as e:
        return f"[TOOL ERROR] Deployment failed: {str(e)}"

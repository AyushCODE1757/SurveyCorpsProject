<div align="center">

# 🚀 FoundrAI 2.0
**The Autonomous Multi-Agent Business Validation Engine**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Language-Python_3.11-3776AB?style=flat&logo=python)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Infra-Docker-2496ED?style=flat&logo=docker)](https://www.docker.com/)

</div>

---

## 📌 Overview

**FoundrAI 2.0** is an autonomous multi-agent business validation engine designed to bridge the gap between a raw startup idea and an actionable, market-ready business plan. 

It is **not a chatbot**. FoundrAI is a deliberation engine. A founder inputs their startup idea (via plain text or a structured intake form), and a specialized team of 6 AI agents—each representing a core C-Suite role—debate the strategy, pull live market data, critique each other's proposals, and only converge when a consensus score of 7.5/10 is reached. 

The final output is a validated business plan complete with financial models, legal risk assessments, architectural designs, and a ready-to-deploy GitHub repository.

---

## 💡 The Problem vs. The Solution

### The Problem
Early-stage founders often suffer from confirmation bias. They lack the resources to hire a full C-suite to rigorously test their ideas against legal, financial, marketing, and technical constraints. This leads to wasted capital on unvalidated products that lack market demand or face fatal regulatory hurdles.

### The Solution: FoundrAI 2.0
We provide an instant, ruthless, and data-backed "board of directors." By utilizing specialized AI agents grounded in real-time data, FoundrAI simulates weeks of business deliberation in under **3 minutes**, exposing flaws early and providing a structured roadmap to success.

---

## ✨ Key Features

- **Multi-Agent Deliberation (The Hexagon):** 6 specialized agents (CEO, CMO, CFO, CTO, Risk, Legal) debating concurrently.
- **Strict Consensus Protocol:** Agents negotiate across multiple rounds and must achieve a threshold score of 7.5/10 to proceed.
- **Zero-Hallucination Data Grounding:** Every insight is grounded in live external data (Reddit, Google Patents, Tavily Search, Google Trends) and localized legal RAG data.
- **Dual Intake Mode:** Flexible input options—a free-text prompt for power users, or a structured 11-field form for non-technical founders.
- **Instant Tangible Outputs:** Generates a full markdown business plan, Recharts-based financial projections, PDF export, and a fully configured GitHub repo (with Docker Compose & README).

---

## 🏗️ System Architecture

Our system leverages a decoupled architecture. The frontend handles real-time visualization of agent states via Server-Sent Events (SSE), while the backend orchestrates the complex multi-agent LangChain workflow.

```mermaid
graph TD
    User([User]) -->|Input Idea/Form| NextJS[Next.js Frontend]
    NextJS -->|REST & SSE| FastAPI[FastAPI Backend]
    
    subgraph Multi-Agent Engine
        FastAPI --> Orchestrator[Orchestrator Protocol]
        Orchestrator --> CEO[CEO Agent]
        Orchestrator --> Dev[Dev/CTO Agent]
        Orchestrator --> CFO[Finance Agent]
        Orchestrator --> CMO[Marketing Agent]
        Orchestrator --> Risk[Risk Agent]
        Orchestrator --> Legal[Legal Agent]
    end

    subgraph Live Data Integrations
        CMO --> Tavily[Tavily API]
        Risk --> Reddit[Reddit PRAW]
        Legal --> Patents[Google Patents]
        Legal --> ChromaDB[(ChromaDB RAG)]
        CEO --> GitHub[GitHub API]
    end
    
    Multi-Agent Engine -->|Negotiation & Consensus| Consensus{Score >= 7.5?}
    Consensus -->|No| Orchestrator
    Consensus -->|Yes| Output[Generate Final Artifacts]
    Output --> PDF[PDF Report]
    Output --> Repo[GitHub Repo]
    Output --> UI[Frontend Dashboard]
```

---

## 👔 The Agent Ecosystem

Each agent acts autonomously, utilizing a specific suite of tools to fetch real-world data to back up their claims.

1. **👑 CEO Agent (Strategy & Execution)**
   - *Role:* Proposes the initial business plan, workforce requirements, and milestone roadmap.
   - *Tools:* Market salary benchmarking (`get_salary_benchmarks`).
2. **🛠️ Dev/CTO Agent (Engineering)**
   - *Role:* Designs the system architecture, tech stack, and dev-ops pipeline.
   - *Output:* Comprehensive READMEs, Architecture diagrams, and production-ready `docker-compose.yml`.
3. **💰 Finance Agent (CFO)**
   - *Role:* Calculates Burn Rate, ROI Projections (Yr 1-3), and Break-even points.
   - *Output:* Structured financial arrays rendered into interactive charts.
4. **📣 Marketing Agent (CMO)**
   - *Role:* Identifies primary/secondary channels, estimates CAC, and finds real-world influencers.
   - *Tools:* Niche influencer search via Tavily (`search_influencers`).
5. **⚠️ Risk Agent (Reality Check)**
   - *Role:* Sources real-world customer complaints and pain points.
   - *Tools:* Reddit PRAW integration (`search_reddit_pain_points`) to feed live Reddit discussion cards to the UI.
6. **⚖️ Legal Agent (Advisory)**
   - *Role:* Conducts pre-emptive checks on patent collisions, labor laws, GDPR/HIPAA compliance, and IP risks.
   - *Tools:* `search_patents`, `search_regulations`, and `query_legal_kb` (localized vector database).

---

## 🛠️ Tech Stack & Integrations

### **Frontend**
- **Framework:** Next.js 16 (React 19)
- **Styling & UI:** Tailwind CSS v4, Shadcn/UI, Lucide React
- **State Management:** Zustand (for complex active agent states & form handling)
- **Data Visualization:** Recharts (for CFO ROI/Burn-rate charts)
- **Real-time:** Server-Sent Events (SSE) for streaming agent thought processes & live document rendering.

### **Backend**
- **Framework:** FastAPI (Python 3.11) with Uvicorn
- **AI/LLM:** HuggingFace Inference Engine (Qwen2.5), LangChain for Tool usage & Agent orchestration.
- **Vector DB:** ChromaDB (for querying legal/labor laws).
- **Concurrency:** Asyncio for parallel agent execution.

### **External Data Sources & APIs**
- **Tavily API:** Real-time web search for market trends and competitors.
- **Reddit API (PRAW):** Scraping live consumer pain points and validation.
- **PyTrends:** Google Trends data integration.
- **PyGithub:** Automated repository generation and code deployment.
- **HuggingFace API:** Core LLM inference.

---

## 🔄 The Validation Workflow (5 Phases)

FoundrAI enforces a rigorous 5-step deliberation process:

1. **Intake & Research:** User submits the idea. Agents fetch preliminary market data.
2. **CEO Proposal:** The CEO agent outlines the baseline business plan, roadmap, and required workforce.
3. **Parallel Critique + Legal Scan:** Dev, Finance, Marketing, and Risk agents critique the CEO's proposal. Concurrently, the Legal agent runs a patent and regulation check.
4. **Negotiation & Revision:** Agents debate conflicting points (e.g., CFO flags high dev costs proposed by CTO). They score the plan. If the score is `< 7.5`, the CEO revises.
5. **Synthesis:** Consensus is reached. The final living document is generated alongside visual charts, legal severity tables, and the GitHub repository.

---

## 🏁 Getting Started

### Prerequisites
- Docker & Docker Compose
- API Keys for: HuggingFace, Tavily, Reddit, and GitHub.

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/foundrai2.git
   cd foundrai2
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env` and fill in your API keys.
   ```env
   HF_TOKEN=your_huggingface_token
   TAVILY_API_KEY=your_tavily_key
   GITHUB_TOKEN=your_github_token
   REDDIT_CLIENT_ID=your_reddit_id
   REDDIT_CLIENT_SECRET=your_reddit_secret
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   - Frontend UI: `http://localhost:3000`
   - Backend API Docs: `http://localhost:8000/docs`

---

<div align="center">
  <i>Built to validate ideas before you build them.</i>
</div>

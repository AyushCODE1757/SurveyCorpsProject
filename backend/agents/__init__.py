"""
FoundrAI — agents package public API.
Import everything from here. Never import from submodules directly in orchestrator.
"""

from .ceo import ceo_propose, ceo_revise
from .developer import dev_critique
from .finance import finance_critique
from .marketing import marketing_critique
from .risk import risk_critique
from .legal import legal_critique
from .synthesis import synthesize, generate_boilerplate
from .monitor import generate_monitor_update

__all__ = [
    "ceo_propose",
    "ceo_revise",
    "dev_critique",
    "finance_critique",
    "marketing_critique",
    "risk_critique",
    "legal_critique",
    "synthesize",
    "generate_boilerplate",
    "generate_monitor_update",
]
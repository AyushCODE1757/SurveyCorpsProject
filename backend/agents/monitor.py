"""
FoundrAI — Monitor Agent
Auto-updates marketing strategy when new market signals are detected.
"""

from .base import call_ai


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
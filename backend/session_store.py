"""
FoundrAI — Session Store
Redis-backed persistence for simulation events.
- Every SSE event is appended to a Redis list keyed by session_id.
- TTL: 24 hours. After that the session is gone — acceptable for v1.
- Falls back gracefully if Redis is unavailable (dev mode).

Why Redis and not Postgres?
  SSE events are append-only, time-bounded, and need fast sequential reads.
  Redis lists with RPUSH/LRANGE are a perfect structural fit.
  Postgres would work too but adds schema migration overhead for no benefit here.
"""

import json
import os
import logging
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

SESSION_TTL_SECONDS = 86_400  # 24 hours


class SessionStore:
    """
    Async wrapper around Redis for session event storage.
    Uses redis.asyncio for non-blocking I/O inside FastAPI.
    """

    def __init__(self):
        self._redis = None

    async def _get_redis(self):
        if self._redis is not None:
            return self._redis
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        try:
            import redis.asyncio as aioredis
            self._redis = aioredis.from_url(redis_url, decode_responses=True)
            await self._redis.ping()
            return self._redis
        except Exception as e:
            logger.warning(f"Redis unavailable, session persistence disabled: {e}")
            return None

    async def append_event(self, session_id: str, event: dict) -> None:
        r = await self._get_redis()
        if r is None:
            return
        key = f"session:{session_id}:events"
        try:
            await r.rpush(key, json.dumps(event))
            await r.expire(key, SESSION_TTL_SECONDS)
        except Exception as e:
            logger.error(f"Failed to persist event for session {session_id}: {e}")

    async def mark_complete(self, session_id: str) -> None:
        r = await self._get_redis()
        if r is None:
            return
        key = f"session:{session_id}:status"
        try:
            await r.set(key, "complete", ex=SESSION_TTL_SECONDS)
        except Exception as e:
            logger.error(f"Failed to mark session {session_id} complete: {e}")

    async def get_events(self, session_id: str) -> list[dict]:
        r = await self._get_redis()
        if r is None:
            return []
        key = f"session:{session_id}:events"
        try:
            raw_events = await r.lrange(key, 0, -1)
            return [json.loads(e) for e in raw_events]
        except Exception as e:
            logger.error(f"Failed to read events for session {session_id}: {e}")
            return []

    async def is_complete(self, session_id: str) -> bool:
        r = await self._get_redis()
        if r is None:
            return False
        key = f"session:{session_id}:status"
        try:
            val = await r.get(key)
            return val == "complete"
        except Exception:
            return False

    async def session_exists(self, session_id: str) -> bool:
        r = await self._get_redis()
        if r is None:
            return False
        key = f"session:{session_id}:events"
        try:
            return bool(await r.exists(key))
        except Exception:
            return False
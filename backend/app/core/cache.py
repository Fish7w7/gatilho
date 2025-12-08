# backend/app/core/cache.py
import redis
import json
from typing import Optional
from .config import settings

redis_client = redis.from_url(settings.REDIS_URL)

def cache_set(key: str, value: any, expire: int = 300):
    """Salva no cache com expiração"""
    redis_client.setex(key, expire, json.dumps(value))

def cache_get(key: str) -> Optional[any]:
    """Recupera do cache"""
    data = redis_client.get(key)
    return json.loads(data) if data else None

def cache_delete(key: str):
    """Remove do cache"""
    redis_client.delete(key)
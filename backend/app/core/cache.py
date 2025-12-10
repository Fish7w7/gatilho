# backend/app/core/cache.py
"""
Cache simples em memória - substitui Redis
Usa dicionário Python com expiração manual
"""

import json
import time
from typing import Optional, Dict, Tuple

# Cache em memória: {key: (value, expire_timestamp)}
_cache: Dict[str, Tuple[any, float]] = {}


def cache_set(key: str, value: any, expire: int = 300):
    """
    Salva no cache com expiração
    
    Args:
        key: Chave do cache
        value: Valor a ser armazenado (será convertido para JSON)
        expire: Tempo de expiração em segundos (padrão: 5 minutos)
    """
    expire_at = time.time() + expire
    _cache[key] = (json.dumps(value), expire_at)


def cache_get(key: str) -> Optional[any]:
    """
    Recupera do cache
    
    Args:
        key: Chave do cache
        
    Returns:
        Valor deserializado ou None se não existir/expirado
    """
    if key not in _cache:
        return None
    
    value, expire_at = _cache[key]
    
    # Verifica se expirou
    if time.time() > expire_at:
        cache_delete(key)
        return None
    
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return None


def cache_delete(key: str):
    """Remove do cache"""
    if key in _cache:
        del _cache[key]


def cache_clear():
    """Limpa todo o cache (útil para testes)"""
    _cache.clear()


def cache_cleanup():
    """
    Remove itens expirados do cache
    Chame periodicamente para liberar memória
    """
    now = time.time()
    expired_keys = [
        key for key, (_, expire_at) in _cache.items() 
        if now > expire_at
    ]
    
    for key in expired_keys:
        del _cache[key]
    
    if expired_keys:
        print(f"🧹 Cache cleanup: {len(expired_keys)} itens expirados removidos")


def cache_stats() -> dict:
    """Retorna estatísticas do cache"""
    now = time.time()
    active = sum(1 for _, expire_at in _cache.values() if now <= expire_at)
    expired = len(_cache) - active
    
    return {
        "total_items": len(_cache),
        "active_items": active,
        "expired_items": expired
    }
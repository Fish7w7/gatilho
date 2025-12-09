#!/usr/bin/env python3
"""
Script de diagnóstico da API do Twelve Data
Salve como: backend/diagnose_api.py
Execute: cd backend && source venv/bin/activate && python diagnose_api.py
"""

import asyncio
import httpx
import os
import sys
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

API_KEY = os.getenv('TWELVE_DATA_API_KEY')
BASE_URL = "https://api.twelvedata.com"

print("=" * 70)
print("🔍 DIAGNÓSTICO DA API TWELVE DATA")
print("=" * 70)

# 1. Verificar API Key
print("\n📋 1. Verificando API Key...")
if not API_KEY:
    print("   ❌ API Key não encontrada no .env")
    sys.exit(1)
elif API_KEY == "demo":
    print("   ⚠️  Usando API key 'demo' (muito limitada)")
else:
    print(f"   ✅ API Key: {API_KEY[:8]}...{API_KEY[-4:]}")

# 2. Testar conectividade básica
print("\n🌐 2. Testando conectividade...")
async def test_connection():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{BASE_URL}/time_series")
            if response.status_code in [200, 400, 401]:
                print(f"   ✅ Servidor acessível")
                return True
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

if not asyncio.run(test_connection()):
    print("\n💡 Verifique sua conexão com a internet")
    sys.exit(1)

# 3. Testar quota/limites da API
print("\n📊 3. Verificando informações da API Key...")
async def check_api_usage():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Tenta pegar dados da quota
            response = await client.get(
                f"{BASE_URL}/api_usage",
                params={"apikey": API_KEY}
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"   📈 Plano: {data.get('plan', 'N/A')}")
                print(f"   📉 Requisições usadas hoje: {data.get('current_usage', 'N/A')}")
                print(f"   🎯 Limite diário: {data.get('daily_limit', 'N/A')}")
            else:
                print(f"   ⚠️  Não foi possível verificar quota (status {response.status_code})")
    except Exception as e:
        print(f"   ⚠️  Erro ao verificar quota: {e}")

asyncio.run(check_api_usage())

# 4. Testar cotação de PETR4
print("\n💰 4. Testando busca de cotação (PETR4.SA)...")
async def test_quote():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            print("   🔄 Buscando...")
            response = await client.get(
                f"{BASE_URL}/quote",
                params={
                    "symbol": "PETR4.SA",
                    "apikey": API_KEY
                }
            )
            
            print(f"   📡 Status HTTP: {response.status_code}")
            data = response.json()
            
            # Imprime resposta completa para debug
            print(f"   📄 Resposta completa:")
            import json
            print(json.dumps(data, indent=2))
            
            # Verifica erros
            if "code" in data and data["code"] != 200:
                print(f"\n   ❌ ERRO: {data.get('message', 'Desconhecido')}")
                print(f"   📋 Código: {data['code']}")
                
                if data['code'] == 401:
                    print("\n   💡 SOLUÇÃO:")
                    print("      - API key inválida ou expirada")
                    print("      - Obtenha nova em: https://twelvedata.com/")
                
                elif data['code'] == 429:
                    print("\n   💡 SOLUÇÃO:")
                    print("      - Rate limit atingido")
                    print("      - Aguarde alguns minutos")
                    print("      - Ou faça upgrade do plano")
                
                elif data['code'] == 404:
                    print("\n   💡 SOLUÇÃO:")
                    print("      - Ticker não encontrado")
                    print("      - Tente: PETR4.SA, VALE3.SA, ITUB4.SA")
                
                return False
            
            # Sucesso!
            if "close" in data or "price" in data:
                price = float(data.get("close", data.get("price", 0)))
                volume = int(data.get("volume", 0))
                change = float(data.get("percent_change", 0))
                
                print(f"\n   ✅ SUCESSO!")
                print(f"   💵 Preço: R$ {price:.2f}")
                print(f"   📊 Volume: {volume:,}")
                print(f"   📈 Variação: {change:+.2f}%")
                return True
            else:
                print(f"\n   ⚠️  Resposta sem dados de preço")
                return False
                
    except httpx.TimeoutException:
        print(f"   ❌ Timeout - API demorou muito para responder")
        return False
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return False

success = asyncio.run(test_quote())

# 5. Teste com outros tickers
if success:
    print("\n📋 5. Testando outros tickers brasileiros...")
    
    tickers = ["VALE3.SA", "ITUB4.SA", "BBDC4.SA"]
    
    async def test_multiple():
        results = []
        for ticker in tickers:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    response = await client.get(
                        f"{BASE_URL}/quote",
                        params={"symbol": ticker, "apikey": API_KEY}
                    )
                    data = response.json()
                    
                    if "close" in data or "price" in data:
                        price = float(data.get("close", data.get("price", 0)))
                        print(f"   ✅ {ticker}: R$ {price:.2f}")
                        results.append(True)
                    else:
                        print(f"   ⚠️  {ticker}: Sem dados")
                        results.append(False)
            except:
                print(f"   ❌ {ticker}: Erro")
                results.append(False)
        
        return results
    
    results = asyncio.run(test_multiple())
    success_rate = sum(results) / len(results) * 100
    print(f"\n   📊 Taxa de sucesso: {success_rate:.0f}%")

# Resultado final
print("\n" + "=" * 70)
if success:
    print("✅ DIAGNÓSTICO CONCLUÍDO - API FUNCIONANDO!")
    print("\n💡 Próximos passos:")
    print("   1. Reinicie o backend: uvicorn app.main:app --reload")
    print("   2. Limpe o cache Redis: docker exec -it gatilho_redis redis-cli FLUSHALL")
    print("   3. Teste novamente: curl http://localhost:8000/api/monitoring/test/quote/PETR4")
else:
    print("❌ DIAGNÓSTICO CONCLUÍDO - PROBLEMAS ENCONTRADOS")
    print("\n💡 Ações recomendadas:")
    print("   1. Verifique se a API key está ativa em https://twelvedata.com/")
    print("   2. Verifique se não atingiu o rate limit")
    print("   3. Tente obter uma nova API key")

print("=" * 70)
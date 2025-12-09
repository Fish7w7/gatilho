import httpx
import logging
from typing import Optional, Dict
from datetime import datetime, timedelta
from ..core.config import settings
from ..core.cache import cache_get, cache_set

logger = logging.getLogger(__name__)

class MarketDataService:
    """Serviço para buscar dados de mercado com cache e fallbacks"""
    
    def __init__(self):
        self.api_key = settings.TWELVE_DATA_API_KEY
        self.base_url = "https://api.twelvedata.com"
        self.timeout = 10.0
        
        # Mapeamento de tickers brasileiros
        # Formato correto: PETR4, VALE3 (sem .SA)
        self.ticker_mapping = {
            "PETR4": "PETR4",
            "PETR3": "PETR3", 
            "VALE3": "VALE3",
            "VALE5": "VALE5",
            "ITUB4": "ITUB4",
            "ITUB3": "ITUB3",
            "BBDC4": "BBDC4",
            "BBDC3": "BBDC3",
            "MGLU3": "MGLU3",
            "B3SA3": "B3SA3",
            "WEGE3": "WEGE3",
            "RENT3": "RENT3",
            "ABEV3": "ABEV3",
            "BBAS3": "BBAS3",
        }
    
    def get_api_ticker(self, ticker: str) -> str:
        """Converte ticker BR para formato da API"""
        # Remove .SA se vier com ele
        clean_ticker = ticker.replace(".SA", "")
        return self.ticker_mapping.get(clean_ticker, clean_ticker)
    
    async def get_quote(self, ticker: str) -> Optional[Dict]:
        """
        Busca cotação de um ativo com cache e tratamento de erros
        
        Retorna:
        {
            "ticker": str,
            "price": float,
            "volume": int,
            "change_percent": float,
            "timestamp": str
        }
        """
        try:
            # Verifica cache (válido por 1 minuto)
            cache_key = f"quote:{ticker}"
            cached = cache_get(cache_key)
            if cached:
                logger.info(f"📦 Cache hit para {ticker}")
                return cached
            
            # Busca dados da API
            api_ticker = self.get_api_ticker(ticker)
            
            logger.info(f"🔄 Buscando cotação para {ticker} (API: {api_ticker})")
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/quote",
                    params={
                        "symbol": api_ticker,
                        "apikey": self.api_key
                    }
                )
                
                if response.status_code != 200:
                    logger.error(f"❌ API retornou status {response.status_code} para {ticker}")
                    return self._get_mock_data(ticker)
                
                data = response.json()
                
                # Verifica se há erro na resposta
                if "code" in data and data["code"] != 200:
                    logger.warning(f"⚠️ API error para {ticker}: {data.get('message', 'Unknown error')}")
                    logger.warning(f"⚠️ Response: {data}")
                    return self._get_mock_data(ticker)
                
                # Valida e formata dados
                if "close" not in data and "price" not in data:
                    logger.warning(f"⚠️ Dados incompletos para {ticker}")
                    return self._get_mock_data(ticker)
                
                result = {
                    "ticker": ticker,
                    "price": float(data.get("close", data.get("price", 0))),
                    "volume": int(data.get("volume", 0)),
                    "change_percent": float(data.get("percent_change", 0)),
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Salva no cache por 60 segundos
                cache_set(cache_key, result, expire=60)
                
                logger.info(f"✅ Cotação obtida: {ticker} = R$ {result['price']:.2f}")
                return result
                
        except httpx.TimeoutException:
            logger.error(f"⏱️ Timeout ao buscar {ticker}")
            return self._get_mock_data(ticker)
        
        except Exception as e:
            logger.error(f"❌ Erro ao buscar cotação de {ticker}: {e}")
            return self._get_mock_data(ticker)
    
    def _get_mock_data(self, ticker: str) -> Dict:
        """
        Retorna dados mockados para desenvolvimento/testes
        Em produção, você pode remover isso ou buscar de uma API alternativa
        """
        import random
        
        # Dados base fictícios
        base_prices = {
            "PETR4": 38.50,
            "VALE3": 65.20,
            "ITUB4": 28.30,
            "BBDC4": 14.50,
            "MGLU3": 3.20,
            "B3SA3": 12.80,
            "WEGE3": 42.90,
            "RENT3": 48.70,
        }
        
        base_price = base_prices.get(ticker, 25.00)
        
        # Adiciona variação aleatória de -5% a +5%
        variation = random.uniform(-0.05, 0.05)
        current_price = base_price * (1 + variation)
        
        logger.warning(f"⚠️ Usando dados mockados para {ticker}")
        
        return {
            "ticker": ticker,
            "price": round(current_price, 2),
            "volume": random.randint(1000000, 50000000),
            "change_percent": round(variation * 100, 2),
            "timestamp": datetime.utcnow().isoformat(),
            "_mock": True  # Indica que são dados mockados
        }
    
    async def get_intraday(self, ticker: str, interval: str = "5min") -> Optional[Dict]:
        """
        Busca dados intraday (para gráficos)
        
        Intervalos: 1min, 5min, 15min, 30min, 45min, 1h
        """
        try:
            api_ticker = self.get_api_ticker(ticker)
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/time_series",
                    params={
                        "symbol": api_ticker,
                        "interval": interval,
                        "apikey": self.api_key,
                        "outputsize": 30  # Últimos 30 pontos
                    }
                )
                
                if response.status_code != 200:
                    return None
                
                data = response.json()
                
                if "values" not in data:
                    return None
                
                return {
                    "ticker": ticker,
                    "interval": interval,
                    "values": data["values"]
                }
                
        except Exception as e:
            logger.error(f"❌ Erro ao buscar dados intraday de {ticker}: {e}")
            return None
    
    async def search_ticker(self, query: str) -> list:
        """
        Busca tickers por nome ou código
        Útil para autocompletar
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.base_url}/symbol_search",
                    params={
                        "symbol": query,
                        "apikey": self.api_key
                    }
                )
                
                if response.status_code != 200:
                    return []
                
                data = response.json()
                
                # Filtra apenas ações brasileiras (.SA)
                results = [
                    {
                        "symbol": item["symbol"].replace(".SA", ""),
                        "name": item.get("instrument_name", ""),
                        "exchange": item.get("exchange", "")
                    }
                    for item in data.get("data", [])
                    if ".SA" in item["symbol"]
                ]
                
                return results[:10]  # Top 10 resultados
                
        except Exception as e:
            logger.error(f"❌ Erro ao buscar tickers: {e}")
            return []

# Instância global do serviço
market_data_service = MarketDataService()
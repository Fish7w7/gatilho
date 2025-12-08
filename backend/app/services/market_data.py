import httpx
from ..core.config import settings

class MarketDataService:
    def __init__(self):
        self.api_key = settings.TWELVE_DATA_API_KEY
        self.base_url = "https://api.twelvedata.com"
    
    async def get_quote(self, ticker: str):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/quote",
                    params={
                        "symbol": ticker,
                        "apikey": self.api_key
                    }
                )
                data = response.json()
                
                if "price" in data:
                    return {
                        "ticker": ticker,
                        "price": float(data.get("price", 0)),
                        "volume": int(data.get("volume", 0)),
                        "change_percent": float(data.get("percent_change", 0))
                    }
                return None
        except Exception as e:
            print(f"Erro ao buscar cotação: {e}")
            return None

market_data_service = MarketDataService()

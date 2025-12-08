# backend/app/services/sentiment_analysis.py
import httpx
from typing import Optional

class SentimentAnalyzer:
    async def get_stock_sentiment(self, ticker: str) -> Optional[dict]:
        """
        Busca notícias e analisa sentimento
        Futuro: integrar com Alpha Vantage ou News API
        """
        # TODO: Implementar análise de sentimento
        return {
            'ticker': ticker,
            'sentiment': 'positive',  # 'positive', 'neutral', 'negative'
            'score': 0.75,
            'news_count': 10
        }
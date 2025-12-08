# backend/app/api/suggestions.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.alert import Alert
from collections import Counter

router = APIRouter()

@router.get("/api/suggestions/tickers")
def get_popular_tickers(db: Session = Depends(get_db)):
    """Retorna ações mais usadas em alertas"""
    
    tickers = db.query(Alert.ticker).filter(
        Alert.is_active == True
    ).all()
    
    counter = Counter([t[0] for t in tickers])
    most_common = counter.most_common(10)
    
    return [
        {'ticker': ticker, 'count': count}
        for ticker, count in most_common
    ]

@router.get("/api/suggestions/values")
def get_suggested_values(ticker: str, alert_type: str, db: Session = Depends(get_db)):
    """Sugere valores baseado em alertas similares"""
    
    similar_alerts = db.query(Alert.target_value).filter(
        Alert.ticker == ticker,
        Alert.alert_type == alert_type,
        Alert.is_active == True
    ).all()
    
    if not similar_alerts:
        return {'suggestions': []}
    
    values = [a[0] for a in similar_alerts]
    avg_value = sum(values) / len(values)
    
    return {
        'average': round(avg_value, 2),
        'suggestions': sorted(list(set(values)))[:5]
    }
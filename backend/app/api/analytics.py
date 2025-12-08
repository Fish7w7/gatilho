# backend/app/api/analytics.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from ..core.database import get_db
from ..models.alert import Alert

router = APIRouter()

@router.get("/api/analytics/dashboard")
def get_dashboard_analytics(user_id: int, db: Session = Depends(get_db)):
    """Retorna analytics completo do dashboard"""
    
    # Alertas por tipo
    alerts_by_type = db.query(
        Alert.alert_type,
        func.count(Alert.id)
    ).filter(
        Alert.user_id == user_id,
        Alert.is_active == True
    ).group_by(Alert.alert_type).all()
    
    # Alertas disparados nos últimos 30 dias
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_triggers = db.query(func.count(Alert.id)).filter(
        Alert.user_id == user_id,
        Alert.triggered == True,
        Alert.triggered_at >= thirty_days_ago
    ).scalar()
    
    # Taxa de sucesso (alertas que dispararam vs criados)
    total_created = db.query(func.count(Alert.id)).filter(
        Alert.user_id == user_id
    ).scalar()
    
    total_triggered = db.query(func.count(Alert.id)).filter(
        Alert.user_id == user_id,
        Alert.triggered == True
    ).scalar()
    
    success_rate = (total_triggered / total_created * 100) if total_created > 0 else 0
    
    return {
        'alerts_by_type': dict(alerts_by_type),
        'recent_triggers': recent_triggers,
        'success_rate': round(success_rate, 2),
        'total_created': total_created,
        'total_triggered': total_triggered
    }

@router.get("/api/analytics/chart")
def get_alert_chart_data(user_id: int, days: int = 30, db: Session = Depends(get_db)):
    """Dados para gráfico de histórico"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Alertas disparados por dia
    daily_triggers = db.query(
        func.date(Alert.triggered_at).label('date'),
        func.count(Alert.id).label('count')
    ).filter(
        Alert.user_id == user_id,
        Alert.triggered == True,
        Alert.triggered_at >= start_date
    ).group_by(func.date(Alert.triggered_at)).all()
    
    return [
        {'date': str(item.date), 'alerts': item.count}
        for item in daily_triggers
    ]
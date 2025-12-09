from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..core.database import get_db
from ..models.alert import Alert
from ..models.user import User
from ..tasks.alert_checker import check_single_ticker
from ..services.market_data import market_data_service

router = APIRouter()

@router.get("/health")
def health_check():
    """Health check básico"""
    return {
        "status": "healthy",
        "service": "Gatilho API",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

@router.get("/status")
def system_status(db: Session = Depends(get_db)):
    """Status detalhado do sistema"""
    try:
        # Conta total de usuários
        total_users = db.query(User).count()
        
        # Conta alertas
        total_alerts = db.query(Alert).count()
        active_alerts = db.query(Alert).filter(Alert.is_active == True).count()
        triggered_alerts = db.query(Alert).filter(Alert.triggered == True).count()
        
        # Alertas criados nas últimas 24h
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_alerts = db.query(Alert).filter(
            Alert.created_at >= yesterday
        ).count()
        
        # Alertas disparados nas últimas 24h
        recent_triggered = db.query(Alert).filter(
            Alert.triggered_at >= yesterday
        ).count()
        
        # Tickers mais monitorados
        top_tickers = db.query(
            Alert.ticker,
            func.count(Alert.id).label('count')
        ).filter(
            Alert.is_active == True
        ).group_by(Alert.ticker).order_by(
            func.count(Alert.id).desc()
        ).limit(5).all()
        
        return {
            "status": "operational",
            "timestamp": datetime.utcnow().isoformat(),
            "metrics": {
                "users": {
                    "total": total_users
                },
                "alerts": {
                    "total": total_alerts,
                    "active": active_alerts,
                    "triggered": triggered_alerts,
                    "created_last_24h": recent_alerts,
                    "triggered_last_24h": recent_triggered
                },
                "top_tickers": [
                    {"ticker": t[0], "alerts": t[1]} 
                    for t in top_tickers
                ]
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter status: {str(e)}"
        )

@router.post("/test/check-ticker/{ticker}")
def test_check_ticker(ticker: str):
    """
    Força a verificação imediata de alertas para um ticker específico
    Útil para testes e desenvolvimento
    """
    try:
        # Dispara task assíncrona
        task = check_single_ticker.delay(ticker)
        
        return {
            "message": f"Verificação iniciada para {ticker}",
            "task_id": task.id,
            "ticker": ticker
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao iniciar verificação: {str(e)}"
        )

@router.get("/test/quote/{ticker}")
async def test_get_quote(ticker: str):
    """
    Testa a busca de cotação para um ticker
    Útil para debug
    """
    try:
        quote = await market_data_service.get_quote(ticker)
        
        if not quote:
            raise HTTPException(
                status_code=404,
                detail=f"Não foi possível obter cotação para {ticker}"
            )
        
        return {
            "success": True,
            "ticker": ticker,
            "data": quote
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao buscar cotação: {str(e)}"
        )

@router.get("/stats/performance")
def get_performance_stats(db: Session = Depends(get_db)):
    """
    Estatísticas de performance dos alertas
    Taxa de sucesso, tempo médio, etc.
    """
    try:
        # Alertas disparados por dia nos últimos 30 dias
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        daily_triggers = db.query(
            func.date(Alert.triggered_at).label('date'),
            func.count(Alert.id).label('count')
        ).filter(
            Alert.triggered == True,
            Alert.triggered_at >= thirty_days_ago
        ).group_by(func.date(Alert.triggered_at)).all()
        
        # Taxa de sucesso por tipo de alerta
        success_by_type = db.query(
            Alert.alert_type,
            func.count(Alert.id).label('total'),
            func.sum(func.cast(Alert.triggered, type_=db.Integer)).label('triggered')
        ).group_by(Alert.alert_type).all()
        
        return {
            "daily_triggers": [
                {"date": str(d[0]), "count": d[1]}
                for d in daily_triggers
            ],
            "success_by_type": [
                {
                    "type": t[0],
                    "total": t[1],
                    "triggered": t[2] or 0,
                    "success_rate": round((t[2] or 0) / t[1] * 100, 2) if t[1] > 0 else 0
                }
                for t in success_by_type
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao obter estatísticas: {str(e)}"
        )
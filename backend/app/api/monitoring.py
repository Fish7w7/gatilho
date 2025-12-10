from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..core.database import get_db
from ..models.alert import Alert
from ..models.user import User

router = APIRouter()

@router.get("/health")
def health_check():
    """Health check básico"""
    return JSONResponse({
        "status": "healthy",
        "service": "Gatilho API",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    })

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
        ).count() if db.query(Alert).filter(Alert.triggered_at != None).count() > 0 else 0
        
        # Tickers mais monitorados
        top_tickers_query = db.query(
            Alert.ticker,
            func.count(Alert.id).label('count')
        ).filter(
            Alert.is_active == True
        ).group_by(Alert.ticker).order_by(
            func.count(Alert.id).desc()
        ).limit(5).all()
        
        top_tickers = [
            {"ticker": t[0], "alerts": t[1]} 
            for t in top_tickers_query
        ]
        
        return JSONResponse({
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
                "top_tickers": top_tickers
            }
        })
        
    except Exception as e:
        print(f"❌ Erro ao obter status: {e}")
        import traceback
        traceback.print_exc()
        
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )
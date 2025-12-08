from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, field_serializer
from typing import List, Optional
from datetime import datetime
from ..core.database import get_db
from ..models.alert import Alert
from ..models.user import User

router = APIRouter()

class AlertCreate(BaseModel):
    user_id: int
    ticker: str
    alert_type: str
    target_value: float
    condition: str

class AlertResponse(BaseModel):
    id: int
    ticker: str
    alert_type: str
    target_value: float
    condition: str
    is_active: bool
    triggered: bool
    created_at: datetime
    triggered_at: Optional[datetime] = None

    @field_serializer('created_at', 'triggered_at')
    def serialize_datetime(self, dt: Optional[datetime], _info):
        return dt.isoformat() if dt else None

    class Config:
        from_attributes = True

class AlertStats(BaseModel):
    total_alerts: int
    active_alerts: int
    triggered_alerts: int
    total_tickers: int

@router.post("", status_code=status.HTTP_201_CREATED)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    """Cria um novo alerta"""
    user = db.query(User).filter(User.id == alert.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    valid_types = ["price", "percentage", "volume"]
    if alert.alert_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de alerta inválido. Use: {', '.join(valid_types)}"
        )
    
    valid_conditions = [">", "<", ">=", "<="]
    if alert.condition not in valid_conditions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Condição inválida. Use: {', '.join(valid_conditions)}"
        )
    
    try:
        new_alert = Alert(
            user_id=alert.user_id,
            ticker=alert.ticker.upper(),
            alert_type=alert.alert_type,
            target_value=alert.target_value,
            condition=alert.condition
        )
        
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        
        return new_alert
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao criar alerta: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao criar alerta"
        )

@router.get("", response_model=List[AlertResponse])
def list_alerts(
    user_id: int = Query(...),
    active_only: bool = Query(True, description="Retornar apenas alertas ativos"),
    db: Session = Depends(get_db)
):
    """Lista alertas do usuário"""
    try:
        query = db.query(Alert).filter(Alert.user_id == user_id)
        
        if active_only:
            query = query.filter(Alert.is_active == True)
        
        alerts = query.order_by(Alert.created_at.desc()).all()
        return alerts
        
    except Exception as e:
        print(f"❌ Erro ao listar alertas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar alertas"
        )

@router.get("/history", response_model=List[AlertResponse])
def get_alert_history(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Retorna histórico de alertas disparados"""
    try:
        alerts = db.query(Alert).filter(
            Alert.user_id == user_id,
            Alert.triggered == True
        ).order_by(Alert.triggered_at.desc()).limit(50).all()
        
        return alerts
        
    except Exception as e:
        print(f"❌ Erro ao buscar histórico: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar histórico"
        )

@router.get("/stats", response_model=AlertStats)
def get_alert_stats(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    """Retorna estatísticas dos alertas do usuário"""
    try:
        total_alerts = db.query(Alert).filter(Alert.user_id == user_id).count()
        active_alerts = db.query(Alert).filter(
            Alert.user_id == user_id,
            Alert.is_active == True
        ).count()
        triggered_alerts = db.query(Alert).filter(
            Alert.user_id == user_id,
            Alert.triggered == True
        ).count()
        
        # Conta tickers únicos
        tickers = db.query(Alert.ticker).filter(
            Alert.user_id == user_id,
            Alert.is_active == True
        ).distinct().all()
        total_tickers = len(tickers)
        
        return AlertStats(
            total_alerts=total_alerts,
            active_alerts=active_alerts,
            triggered_alerts=triggered_alerts,
            total_tickers=total_tickers
        )
        
    except Exception as e:
        print(f"❌ Erro ao buscar estatísticas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao buscar estatísticas"
        )

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    """Desativa (deleta) um alerta"""
    try:
        alert = db.query(Alert).filter(
            Alert.id == alert_id,
            Alert.user_id == user_id
        ).first()
        
        if not alert:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alerta não encontrado"
            )
        
        alert.is_active = False
        db.commit()
        
        return {"message": "Alerta removido com sucesso", "alert_id": alert_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"❌ Erro ao deletar alerta: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao deletar alerta"
        )
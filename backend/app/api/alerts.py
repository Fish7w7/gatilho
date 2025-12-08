from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
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
    created_at: str

    class Config:
        from_attributes = True

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_alert(alert: AlertCreate, db: Session = Depends(get_db)):
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

@router.get("/", response_model=List[AlertResponse])
def list_alerts(user_id: int = Query(...), db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(
        Alert.user_id == user_id,
        Alert.is_active == True
    ).order_by(Alert.created_at.desc()).all()
    
    return alerts

@router.delete("/{alert_id}")
def delete_alert(alert_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
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

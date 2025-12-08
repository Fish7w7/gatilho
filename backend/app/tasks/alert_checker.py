import asyncio
from sqlalchemy.orm import Session
from datetime import datetime
from .celery_app import celery_app
from ..core.database import SessionLocal
from ..models.alert import Alert
from ..models.user import User
from ..services.market_data import market_data_service
from ..services.notification import notification_service

@celery_app.task(name="app.tasks.alert_checker.check_all_alerts")
def check_all_alerts():
    db = SessionLocal()
    try:
        alerts = db.query(Alert).filter(
            Alert.is_active == True,
            Alert.triggered == False
        ).all()
        
        print(f"🔍 Verificando {len(alerts)} alertas...")
        
        for alert in alerts:
            asyncio.run(check_single_alert(alert, db))
        
        db.commit()
        print("✅ Verificação concluída")
        
    except Exception as e:
        print(f"❌ Erro na verificação: {e}")
        db.rollback()
    finally:
        db.close()

async def check_single_alert(alert: Alert, db: Session):
    try:
        quote = await market_data_service.get_quote(alert.ticker)
        
        if not quote:
            print(f"⚠️  Não foi possível obter dados para {alert.ticker}")
            return
        
        if alert.alert_type == "price":
            current_value = quote["price"]
        elif alert.alert_type == "percentage":
            current_value = abs(quote["change_percent"])
        elif alert.alert_type == "volume":
            current_value = quote["volume"]
        else:
            return
        
        triggered = False
        if alert.condition == ">":
            triggered = current_value > alert.target_value
        elif alert.condition == "<":
            triggered = current_value < alert.target_value
        elif alert.condition == ">=":
            triggered = current_value >= alert.target_value
        elif alert.condition == "<=":
            triggered = current_value <= alert.target_value
        
        if triggered:
            print(f"🔔 Alerta disparado! {alert.ticker} - {alert.alert_type}")
            
            user = db.query(User).filter(User.id == alert.user_id).first()
            
            if user:
                notification_service.send_alert_email(
                    to_email=user.email,
                    ticker=alert.ticker,
                    alert_type=alert.alert_type,
                    condition=alert.condition,
                    target_value=alert.target_value,
                    current_value=current_value
                )
            
            alert.triggered = True
            alert.triggered_at = datetime.utcnow()
            alert.is_active = False
            
    except Exception as e:
        print(f"❌ Erro ao verificar alerta {alert.id}: {e}")

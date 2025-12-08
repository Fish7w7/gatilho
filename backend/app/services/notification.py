from ..core.config import settings

class NotificationService:
    def __init__(self):
        self.from_email = settings.EMAIL_FROM
        self.sendgrid_key = settings.SENDGRID_API_KEY
    
    def send_alert_email(
        self,
        to_email: str,
        ticker: str,
        alert_type: str,
        condition: str,
        target_value: float,
        current_value: float
    ):
        alert_type_labels = {
            "price": "Preço",
            "percentage": "Variação",
            "volume": "Volume"
        }
        
        print(f"\n📧 ===== EMAIL DE ALERTA =====")
        print(f"Para: {to_email}")
        print(f"Assunto: 🔔 Alerta Disparado: {ticker}")
        print(f"Tipo: {alert_type_labels.get(alert_type, alert_type)}")
        print(f"Condição: {condition} {target_value}")
        print(f"Valor Atual: {current_value}")
        print(f"=============================\n")
        
        return True

notification_service = NotificationService()

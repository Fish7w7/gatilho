from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.from_email = settings.EMAIL_FROM
        self.sendgrid_key = settings.SENDGRID_API_KEY
        self.client = None
        
        # Inicializa cliente apenas se tiver API key configurada
        if self.sendgrid_key and self.sendgrid_key != "your_sendgrid_key_here":
            try:
                self.client = SendGridAPIClient(self.sendgrid_key)
                logger.info("✅ SendGrid inicializado com sucesso")
            except Exception as e:
                logger.error(f"❌ Erro ao inicializar SendGrid: {e}")
                self.client = None
    
    def send_alert_email(
        self,
        to_email: str,
        ticker: str,
        alert_type: str,
        condition: str,
        target_value: float,
        current_value: float
    ):
        """Envia email de alerta usando SendGrid"""
        
        # Labels em português
        alert_type_labels = {
            "price": "Preço",
            "percentage": "Variação",
            "volume": "Volume"
        }
        
        alert_label = alert_type_labels.get(alert_type, alert_type)
        
        # Se não tem cliente configurado, só faz log
        if not self.client:
            logger.info(f"\n📧 ===== EMAIL DE ALERTA (MODO LOG) =====")
            logger.info(f"Para: {to_email}")
            logger.info(f"Assunto: 🔔 Alerta Disparado: {ticker}")
            logger.info(f"Tipo: {alert_label}")
            logger.info(f"Condição: {condition} {target_value}")
            logger.info(f"Valor Atual: {current_value}")
            logger.info(f"=============================\n")
            return False
        
        try:
            # Monta o HTML do email
            html_content = self._build_email_html(
                ticker=ticker,
                alert_type=alert_label,
                condition=condition,
                target_value=target_value,
                current_value=current_value
            )
            
            # Cria mensagem
            message = Mail(
                from_email=Email(self.from_email, "Gatilho Alertas"),
                to_emails=To(to_email),
                subject=f"🔔 Alerta Disparado: {ticker}",
                html_content=Content("text/html", html_content)
            )
            
            # Envia
            response = self.client.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"✅ Email enviado com sucesso para {to_email}")
                return True
            else:
                logger.error(f"❌ Erro ao enviar email: Status {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Erro ao enviar email via SendGrid: {e}")
            return False
    
    def _build_email_html(
        self, 
        ticker: str, 
        alert_type: str, 
        condition: str,
        target_value: float,
        current_value: float
    ) -> str:
        """Constrói HTML bonito para o email"""
        
        # Define cor baseado no tipo
        color = "#4f46e5"  # indigo padrão
        icon = "🔔"
        
        if alert_type == "Preço":
            icon = "💰"
            color = "#10b981" if condition in [">", ">="] else "#ef4444"
        elif alert_type == "Variação":
            icon = "📊"
            color = "#f59e0b"
        elif alert_type == "Volume":
            icon = "📈"
            color = "#8b5cf6"
        
        # Formata valores
        if alert_type == "Preço":
            target_display = f"R$ {target_value:,.2f}"
            current_display = f"R$ {current_value:,.2f}"
        elif alert_type == "Variação":
            target_display = f"{target_value}%"
            current_display = f"{current_value}%"
        else:
            target_display = f"{int(target_value):,}"
            current_display = f"{int(current_value):,}"
        
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, {color} 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                                {icon} Alerta Disparado!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Conteúdo Principal -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Ticker -->
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h2 style="color: #1f2937; font-size: 36px; font-weight: bold; margin: 0 0 5px 0;">
                                    {ticker}
                                </h2>
                                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                                    {alert_type}
                                </p>
                            </div>
                            
                            <!-- Info Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 10px;">
                                        <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                                            Condição Configurada
                                        </p>
                                        <p style="margin: 0; color: #1f2937; font-size: 18px; font-weight: bold;">
                                            {condition} {target_display}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-top: 1px solid #e5e7eb;">
                                        <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                                            Valor Atual
                                        </p>
                                        <p style="margin: 0; color: {color}; font-size: 24px; font-weight: bold;">
                                            {current_display}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3000/dashboard" 
                                   style="display: inline-block; background-color: {color}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                    Ver no Dashboard
                                </a>
                            </div>
                            
                            <!-- Dica -->
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px;">
                                <p style="margin: 0; color: #92400e; font-size: 13px;">
                                    💡 <strong>Dica:</strong> Este alerta foi automaticamente desativado. Configure um novo alerta se quiser continuar monitorando.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                                Você está recebendo este email porque configurou um alerta no Gatilho
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                                © 2025 Gatilho - Alertas Inteligentes para Ações
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
        return html

notification_service = NotificationService()
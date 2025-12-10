"""
Scheduler usando APScheduler - substitui Celery + Redis
Roda no mesmo processo do FastAPI, sem dependências externas!
"""

import asyncio
import logging
from datetime import datetime
from typing import List
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session

from .core.database import SessionLocal
from .models.alert import Alert
from .models.user import User
from .services.market_data import market_data_service
from .services.notification import notification_service

logger = logging.getLogger(__name__)

# Instância global do scheduler
scheduler = AsyncIOScheduler()


class AlertChecker:
    """Classe para verificar alertas de forma assíncrona"""
    
    def __init__(self):
        self.market_cache = {}
    
    async def check_all_alerts(self):
        """Verifica todos os alertas ativos (roda a cada 5 minutos)"""
        db = SessionLocal()
        
        try:
            # Busca alertas ativos
            alerts = db.query(Alert).filter(
                Alert.is_active == True,
                Alert.triggered == False
            ).all()
            
            if not alerts:
                logger.info("ℹ️ Nenhum alerta ativo para verificar")
                return
            
            logger.info(f"🔍 Verificando {len(alerts)} alertas ativos...")
            
            # Agrupa por ticker para otimizar API calls
            tickers = list(set([alert.ticker for alert in alerts]))
            
            # Busca cotações em paralelo
            quotes = {}
            for ticker in tickers:
                try:
                    quote = await market_data_service.get_quote(ticker)
                    if quote:
                        quotes[ticker] = quote
                except Exception as e:
                    logger.error(f"❌ Erro ao buscar {ticker}: {e}")
            
            # Verifica cada alerta
            triggered_count = 0
            for alert in alerts:
                try:
                    quote = quotes.get(alert.ticker)
                    if not quote:
                        continue
                    
                    current_value = self._extract_value(alert, quote)
                    if current_value is None:
                        continue
                    
                    # Verifica condição
                    if self._check_condition(alert, current_value):
                        await self._trigger_alert(alert, current_value, db)
                        triggered_count += 1
                        logger.info(f"🔔 Alerta disparado! {alert.ticker} {alert.condition} {alert.target_value}")
                
                except Exception as e:
                    logger.error(f"❌ Erro ao processar alerta {alert.id}: {e}")
            
            logger.info(f"✅ Verificação concluída: {triggered_count} alertas disparados")
        
        except Exception as e:
            logger.error(f"❌ Erro na verificação de alertas: {e}")
            import traceback
            traceback.print_exc()
        
        finally:
            db.close()
    
    def _extract_value(self, alert: Alert, quote: dict) -> float:
        """Extrai valor atual baseado no tipo de alerta"""
        try:
            if alert.alert_type == "price":
                return float(quote.get("price", 0))
            elif alert.alert_type == "percentage":
                return abs(float(quote.get("change_percent", 0)))
            elif alert.alert_type == "volume":
                return float(quote.get("volume", 0))
        except (ValueError, TypeError) as e:
            logger.error(f"❌ Erro ao extrair valor para {alert.ticker}: {e}")
            return None
    
    def _check_condition(self, alert: Alert, current_value: float) -> bool:
        """Verifica se a condição do alerta foi atendida"""
        if alert.condition == ">":
            return current_value > alert.target_value
        elif alert.condition == "<":
            return current_value < alert.target_value
        elif alert.condition == ">=":
            return current_value >= alert.target_value
        elif alert.condition == "<=":
            return current_value <= alert.target_value
        return False
    
    async def _trigger_alert(self, alert: Alert, current_value: float, db: Session):
        """Dispara um alerta e notifica o usuário"""
        try:
            # Busca usuário
            user = db.query(User).filter(User.id == alert.user_id).first()
            if not user:
                logger.error(f"❌ Usuário {alert.user_id} não encontrado")
                return
            
            # Envia notificação por email
            notification_service.send_alert_email(
                to_email=user.email,
                ticker=alert.ticker,
                alert_type=alert.alert_type,
                condition=alert.condition,
                target_value=alert.target_value,
                current_value=current_value
            )
            
            # Atualiza alerta no banco
            alert.triggered = True
            alert.triggered_at = datetime.utcnow()
            alert.is_active = False
            db.commit()
            
            logger.info(f"✅ Notificação enviada para {user.email}")
        
        except Exception as e:
            logger.error(f"❌ Erro ao disparar alerta {alert.id}: {e}")
            db.rollback()


# Instância global do checker
alert_checker = AlertChecker()


def start_scheduler():
    """Inicia o scheduler quando a aplicação subir"""
    
    # Configura job para verificar alertas a cada 5 minutos
    scheduler.add_job(
        alert_checker.check_all_alerts,
        trigger=IntervalTrigger(minutes=1),
        id='check_alerts',
        name='Verificar alertas ativos',
        replace_existing=True,
        max_instances=1  # Garante que não rode duas vezes ao mesmo tempo
    )
    
    # Inicia o scheduler
    scheduler.start()
    logger.info("✅ Scheduler iniciado - Verificando alertas a cada 5 minutos")


def shutdown_scheduler():
    """Para o scheduler quando a aplicação for encerrada"""
    scheduler.shutdown()
    logger.info("👋 Scheduler encerrado")
import asyncio
from sqlalchemy.orm import Session
from datetime import datetime
import logging
from typing import List, Dict, Optional
from .celery_app import celery_app
from ..core.database import SessionLocal
from ..models.alert import Alert
from ..models.user import User
from ..services.market_data import market_data_service
from ..services.notification import notification_service

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AlertChecker:
    """Classe responsável por verificar alertas de forma otimizada"""
    
    def __init__(self, db: Session):
        self.db = db
        self.market_cache: Dict[str, Dict] = {}
    
    async def fetch_market_data_batch(self, tickers: List[str]) -> Dict[str, Optional[Dict]]:
        """Busca dados de mercado em lote para otimizar API calls"""
        results = {}
        
        # Remove duplicatas e limpa tickers (remove .SA se houver)
        unique_tickers = list(set([t.replace('.SA', '') for t in tickers]))
        
        logger.info(f"📊 Buscando cotações para {len(unique_tickers)} ativos únicos")
        
        # Busca em paralelo (mas respeitando rate limits)
        tasks = []
        for ticker in unique_tickers:
            # Verifica cache primeiro (válido por 1 minuto)
            if ticker in self.market_cache:
                cached_data = self.market_cache[ticker]
                if (datetime.utcnow() - cached_data['timestamp']).seconds < 60:
                    results[ticker] = cached_data['data']
                    continue
            
            tasks.append(self.fetch_ticker_data(ticker))
        
        # Executa requisições em paralelo
        if tasks:
            fetched_data = await asyncio.gather(*tasks, return_exceptions=True)
            
            for ticker, data in zip(
                [t for t in unique_tickers if t not in results], 
                fetched_data
            ):
                if isinstance(data, Exception):
                    logger.error(f"❌ Erro ao buscar {ticker}: {data}")
                    results[ticker] = None
                else:
                    results[ticker] = data
                    # Atualiza cache
                    self.market_cache[ticker] = {
                        'data': data,
                        'timestamp': datetime.utcnow()
                    }
        
        return results
    
    async def fetch_ticker_data(self, ticker: str) -> Optional[Dict]:
        """Busca dados de um ticker específico"""
        try:
            return await market_data_service.get_quote(ticker)
        except Exception as e:
            logger.error(f"❌ Erro ao buscar {ticker}: {e}")
            return None
    
    def evaluate_condition(self, alert: Alert, current_value: float) -> bool:
        """Avalia se a condição do alerta foi atendida"""
        if alert.condition == ">":
            return current_value > alert.target_value
        elif alert.condition == "<":
            return current_value < alert.target_value
        elif alert.condition == ">=":
            return current_value >= alert.target_value
        elif alert.condition == "<=":
            return current_value <= alert.target_value
        return False
    
    def extract_current_value(self, alert: Alert, quote_data: Dict) -> Optional[float]:
        """Extrai o valor atual baseado no tipo de alerta"""
        if not quote_data:
            return None
        
        try:
            if alert.alert_type == "price":
                return float(quote_data.get("price", 0))
            elif alert.alert_type == "percentage":
                return abs(float(quote_data.get("change_percent", 0)))
            elif alert.alert_type == "volume":
                return float(quote_data.get("volume", 0))
        except (ValueError, TypeError) as e:
            logger.error(f"❌ Erro ao extrair valor para {alert.ticker}: {e}")
            return None
        
        return None
    
    async def process_alerts_batch(self, alerts: List[Alert]) -> int:
        """Processa um lote de alertas de forma otimizada"""
        if not alerts:
            return 0
        
        # Agrupa alertas por ticker para otimizar requisições
        tickers = [alert.ticker for alert in alerts]
        market_data = await self.fetch_market_data_batch(tickers)
        
        triggered_count = 0
        
        for alert in alerts:
            try:
                quote_data = market_data.get(alert.ticker)
                
                if not quote_data:
                    logger.warning(f"⚠️ Sem dados para {alert.ticker}")
                    continue
                
                current_value = self.extract_current_value(alert, quote_data)
                
                if current_value is None:
                    logger.warning(f"⚠️ Valor inválido para {alert.ticker}")
                    continue
                
                # Verifica se a condição foi atendida
                if self.evaluate_condition(alert, current_value):
                    await self.trigger_alert(alert, current_value)
                    triggered_count += 1
                    logger.info(f"🔔 Alerta disparado! {alert.ticker} {alert.condition} {alert.target_value}")
                
            except Exception as e:
                logger.error(f"❌ Erro ao processar alerta {alert.id}: {e}")
                continue
        
        return triggered_count
    
    async def trigger_alert(self, alert: Alert, current_value: float):
        """Dispara um alerta e notifica o usuário"""
        try:
            # Busca usuário
            user = self.db.query(User).filter(User.id == alert.user_id).first()
            
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
            self.db.commit()
            
            logger.info(f"✅ Notificação enviada para {user.email}")
            
        except Exception as e:
            logger.error(f"❌ Erro ao disparar alerta {alert.id}: {e}")
            self.db.rollback()


@celery_app.task(name="app.tasks.alert_checker.check_all_alerts")
def check_all_alerts():
    """Task principal do Celery para verificar todos os alertas"""
    db = SessionLocal()
    checker = AlertChecker(db)
    
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
        
        # Processa alertas em lote
        triggered_count = asyncio.run(checker.process_alerts_batch(alerts))
        
        logger.info(f"✅ Verificação concluída: {triggered_count} alertas disparados")
        
    except Exception as e:
        logger.error(f"❌ Erro na verificação de alertas: {e}")
        db.rollback()
    finally:
        db.close()


@celery_app.task(name="app.tasks.alert_checker.check_single_ticker")
def check_single_ticker(ticker: str):
    """Verifica alertas de um ticker específico (útil para testes)"""
    db = SessionLocal()
    checker = AlertChecker(db)
    
    try:
        alerts = db.query(Alert).filter(
            Alert.ticker == ticker,
            Alert.is_active == True,
            Alert.triggered == False
        ).all()
        
        if alerts:
            triggered_count = asyncio.run(checker.process_alerts_batch(alerts))
            logger.info(f"✅ {triggered_count} alertas disparados para {ticker}")
        else:
            logger.info(f"ℹ️ Nenhum alerta ativo para {ticker}")
            
    except Exception as e:
        logger.error(f"❌ Erro ao verificar {ticker}: {e}")
    finally:
        db.close()


@celery_app.task(name="app.tasks.alert_checker.cleanup_old_alerts")
def cleanup_old_alerts():
    """Remove alertas muito antigos do histórico (manutenção)"""
    from datetime import timedelta
    
    db = SessionLocal()
    try:
        # Remove alertas disparados há mais de 90 dias
        cutoff_date = datetime.utcnow() - timedelta(days=90)
        
        deleted = db.query(Alert).filter(
            Alert.triggered == True,
            Alert.triggered_at < cutoff_date
        ).delete()
        
        db.commit()
        logger.info(f"🧹 Limpeza concluída: {deleted} alertas antigos removidos")
        
    except Exception as e:
        logger.error(f"❌ Erro na limpeza: {e}")
        db.rollback()
    finally:
        db.close()
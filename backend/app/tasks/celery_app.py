from celery import Celery
from celery.schedules import crontab
from ..core.config import settings

celery_app = Celery(
    "gatilho",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=['app.tasks.alert_checker']  # Importa as tasks
)

celery_app.conf.update(
    # Serialização
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    
    # Timezone
    timezone="America/Sao_Paulo",
    enable_utc=True,
    
    # Resultados
    result_expires=3600,  # 1 hora
    result_backend_transport_options={
        'master_name': 'mymaster'
    },
    
    # Tasks
    task_track_started=True,
    task_time_limit=300,  # 5 minutos max
    task_soft_time_limit=240,  # 4 minutos warning
    
    # Worker
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    
    # Beat Schedule - Tarefas agendadas
    beat_schedule={
        # Verifica alertas a cada 5 minutos (MVP)
        "check-alerts-every-5-minutes": {
            "task": "app.tasks.alert_checker.check_all_alerts",
            "schedule": 300.0,  # 300 segundos = 5 minutos
            "options": {
                "expires": 240  # Expira em 4 minutos
            }
        },
        
        # Limpeza semanal de alertas antigos
        "cleanup-old-alerts-weekly": {
            "task": "app.tasks.alert_checker.cleanup_old_alerts",
            "schedule": crontab(hour=3, minute=0, day_of_week=0),  # Domingo 3h
        },
        
        # Tarefa de monitoramento (futuro)
        # "health-check-hourly": {
        #     "task": "app.tasks.monitoring.health_check",
        #     "schedule": crontab(minute=0),  # A cada hora
        # },
    },
)

# Configurações de logging
celery_app.conf.worker_hijack_root_logger = False

# Retry policy
celery_app.conf.task_annotations = {
    '*': {
        'rate_limit': '10/s',  # 10 tasks por segundo max
    },
    'app.tasks.alert_checker.check_all_alerts': {
        'rate_limit': None,  # Sem limite para task principal
        'max_retries': 3,
        'default_retry_delay': 60,  # 1 minuto entre retries
    }
}
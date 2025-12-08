from celery import Celery
from ..core.config import settings

celery_app = Celery(
    "gatilho",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Sao_Paulo",
    enable_utc=True,
    beat_schedule={
        "check-alerts-every-5-minutes": {
            "task": "app.tasks.alert_checker.check_all_alerts",
            "schedule": 300.0,
        },
    },
)

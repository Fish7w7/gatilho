@echo off
cd backend
call venv\Scripts\activate
celery -A app.tasks.celery_app beat --loglevel=info

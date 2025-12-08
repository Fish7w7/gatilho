@echo off
cd backend
call venv\Scripts\activate
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo

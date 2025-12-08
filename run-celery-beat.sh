#!/bin/bash
cd backend
source $VENV_ACTIVATE
celery -A app.tasks.celery_app beat --loglevel=info

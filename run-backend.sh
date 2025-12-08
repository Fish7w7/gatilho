#!/bin/bash
cd backend
source $VENV_ACTIVATE
uvicorn app.main:app --reload --port 8000

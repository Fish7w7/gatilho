# Gatilho

Sistema de alertas inteligentes para ações da B3. Notificações contextuais e em tempo real para investidores.

> **Projeto pausado.** Desenvolvido até o estágio de MVP, pausado por falta de tração e interesse externo. O código fica aqui como referência.

---

## O que foi construído

- Alertas de **preço** (ex: PETR4 > R$ 45,00)
- Alertas de **variação percentual** (ex: VALE3 caiu 5%)
- Alertas de **volume** acima da média
- **Histórico** de alertas disparados
- Dashboard de gestão de alertas
- Notificações por email
- Checagem automática a cada 5 minutos

---

## Stack

**Frontend** — Next.js 14 + TypeScript + Tailwind CSS  
**Backend** — Python 3.11 + FastAPI + SQLAlchemy  
**Database** — PostgreSQL  
**Queue** — Redis + Celery  
**API de cotações** — Twelve Data

---

## Setup

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- Docker (para PostgreSQL e Redis)

### 1. Banco de dados

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Linux/Mac
venv\Scripts\activate          # Windows

pip install -r requirements.txt
```

Edite o `.env` e preencha `TWELVE_DATA_API_KEY`.

### 3. Frontend

```bash
cd frontend
npm install
```

---

## Rodar

Precisa de 4 terminais:

```bash
# Terminal 1 — API
cd backend && uvicorn app.main:app --reload --port 8000

# Terminal 2 — Celery worker
cd backend && celery -A app.tasks.celery_app worker --loglevel=info --pool=solo

# Terminal 3 — Celery beat (scheduler)
cd backend && celery -A app.tasks.celery_app beat --loglevel=info

# Terminal 4 — Frontend
cd frontend && npm run dev
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| Docs | http://localhost:8000/docs |

---

## Roadmap (não implementado)

O que estava planejado antes da pausa:

- Alertas de indicadores técnicos (RSI, MACD, médias móveis)
- Sistema de carteira com P&L em tempo real
- Notificações via Push e WhatsApp
- Indicadores fundamentalistas (P/L, P/VP)
- Autenticação OAuth

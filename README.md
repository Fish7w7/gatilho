# 🔔 Gatilho - Alertas Inteligentes para Ações da B3

Sistema completo de alertas para investidores, focado em notificações contextuais e em tempo real.

## 🚀 Status do Projeto
A **Landing Page** está no ar e o desenvolvimento do **MVP (Produto Mínimo Viável)** está começando.

## 📋 Funcionalidades do MVP

O MVP foca na entrega de alertas contextuais de forma confiável.

- ✅ Alertas de **Preço** (ex: PETR4 > R$ 45,00)
- ✅ Alertas de **Variação Percentual** (ex: VALE3 caiu 5%)
- ✅ Alertas de **Volume** (ex: Volume acima da média)
- ✅ **Histórico Completo** de alertas disparados
- ✅ Dashboard intuitivo para gestão de alertas
- ✅ Notificações por email
- ✅ Checagem automática a cada 5 minutos (Base para o Premium de 30s)

## 📚 Stack Tecnológica

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Python 3.11 + FastAPI + SQLAlchemy
- **Database:** PostgreSQL
- **Cache/Queue:** Redis + Celery
- **APIs:** Twelve Data (cotações)

## ⚙️ Setup Rápido

### 1. Backend
```bash
cd backend
python -m venv venv
# Linux/Mac
source venv/bin/activate
# Windows (Git Bash)
# source venv/Scripts/activate
pip install -r requirements.txt
```

### 2. Frontend
```bash
cd frontend
npm install
```

### 3. Docker (PostgreSQL + Redis)
```bash
docker-compose up -d
```

### 4. Configurar .env
```bash
cd backend
# O arquivo .env já foi criado, edite se necessário
# Preencha TWELVE_DATA_API_KEY
```

## ▶️ Rodar o Projeto

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Celery Worker:**
```bash
cd backend
source venv/bin/activate
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
```

**Terminal 3 - Celery Beat:**
```bash
cd backend
source venv/bin/activate
celery -A app.tasks.celery_app beat --loglevel=info
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🌐 Acessar

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 📝 Próximos Passos (Roadmap Pós-MVP)

Após a conclusão do MVP, o foco será em funcionalidades Premium e de engajamento:

- [ ] **Alertas de Indicadores Técnicos** (RSI, MACD, Médias Móveis)
- [ ] **Sistema de Carteira** (Controle de compras/vendas e P&L em tempo real)
- [ ] **Notificações Premium** (Push e WhatsApp)
- [ ] **Indicadores Fundamentalistas** (P/L, P/VP, etc.)
- [ ] **IA Preditiva** (Sugestões inteligentes de alertas)
- [ ] Implementar autenticação OAuth

---

**Desenvolvido com ❤️ para investidores da B3**

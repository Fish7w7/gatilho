# 🔔 Gatilho - Alertas Inteligentes para Ações da B3

Sistema completo de alertas para investidores, com notificações em tempo real.

## 📋 Funcionalidades

- ✅ Alertas de **Preço** (ex: PETR4 > R$ 45,00)
- ✅ Alertas de **Variação Percentual** (ex: VALE3 caiu 5%)
- ✅ Alertas de **Volume** (ex: Volume acima da média)
- ✅ Dashboard intuitivo
- ✅ Notificações por email
- ✅ Checagem automática a cada 5 minutos

## 🚀 Setup Rápido

### 1. Backend
```bash
cd backend
python -m venv venv

# Windows (Git Bash)
source venv/Scripts/activate

# Linux/Mac
source venv/bin/activate

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
```

## ▶️ Rodar o Projeto

### Windows (Git Bash/PowerShell)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/Scripts/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Celery Worker:**
```bash
cd backend
source venv/Scripts/activate
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
```

**Terminal 3 - Celery Beat:**
```bash
cd backend
source venv/Scripts/activate
celery -A app.tasks.celery_app beat --loglevel=info
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

### Linux/Mac

Use os mesmos comandos, mas com `venv/bin/activate`

## 🌐 Acessar

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 📚 Stack Tecnológica

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Python 3.11 + FastAPI + SQLAlchemy
- **Database:** PostgreSQL
- **Cache/Queue:** Redis + Celery
- **APIs:** Twelve Data (cotações)

## 🔑 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://gatilho:dev_password_123@localhost:5432/gatilho_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=seu-secret-key-aqui
TWELVE_DATA_API_KEY=sua-api-key
```

## 📝 Próximos Passos

- [ ] Implementar autenticação OAuth
- [ ] Adicionar gráficos de performance
- [ ] Sistema de carteira
- [ ] Indicadores fundamentalistas
- [ ] IA preditiva

---

**Desenvolvido com ❤️ para investidores da B3**

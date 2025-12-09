#!/bin/bash

echo "🚀 Gatilho - Setup Inicial"
echo "=========================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verifica se está no diretório correto
if [ ! -f "backend/requirements.txt" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto${NC}"
    exit 1
fi

# 1. Setup do Backend
echo -e "${YELLOW}📦 Configurando Backend...${NC}"
cd backend

# Cria virtual environment se não existir
if [ ! -d "venv" ]; then
    echo "Criando virtual environment..."
    python3 -m venv venv
fi

# Ativa virtual environment
echo "Ativando virtual environment..."
source venv/bin/activate

# Instala dependências
echo "Instalando dependências..."
pip install --upgrade pip
pip install -r requirements.txt

# Cria arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️ Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado. Configure suas variáveis de ambiente!${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

cd ..

# 2. Setup do Frontend
echo ""
echo -e "${YELLOW}📦 Configurando Frontend...${NC}"
cd frontend

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do npm..."
    npm install
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi

cd ..

# 3. Iniciar Docker
echo ""
echo -e "${YELLOW}🐳 Iniciando containers Docker (PostgreSQL + Redis)...${NC}"

# Verifica se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Inicie o Docker e tente novamente.${NC}"
    exit 1
fi

# Inicia containers
docker-compose up -d

# Aguarda containers iniciarem
echo "Aguardando containers iniciarem..."
sleep 5

# Verifica se containers estão rodando
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Containers iniciados com sucesso${NC}"
else
    echo -e "${RED}❌ Erro ao iniciar containers${NC}"
    exit 1
fi

# 4. Criar tabelas no banco
echo ""
echo -e "${YELLOW}🗄️ Criando tabelas no banco de dados...${NC}"
cd backend
source venv/bin/activate

# Executa script Python para criar tabelas
python3 -c "
from app.core.database import engine, Base
from app.models.user import User
from app.models.alert import Alert

print('Criando tabelas...')
Base.metadata.create_all(bind=engine)
print('✅ Tabelas criadas com sucesso!')
"

cd ..

# 5. Resumo final
echo ""
echo -e "${GREEN}✨ Setup concluído com sucesso!${NC}"
echo ""
echo "=========================="
echo "🎯 Próximos passos:"
echo "=========================="
echo ""
echo "1. Configure suas variáveis de ambiente:"
echo "   ${YELLOW}cd backend && nano .env${NC}"
echo "   - TWELVE_DATA_API_KEY (obtenha em https://twelvedata.com/)"
echo "   - SENDGRID_API_KEY (opcional, para emails)"
echo ""
echo "2. Inicie o backend (em um terminal):"
echo "   ${YELLOW}cd backend${NC}"
echo "   ${YELLOW}source venv/bin/activate${NC}"
echo "   ${YELLOW}uvicorn app.main:app --reload --port 8000${NC}"
echo ""
echo "3. Inicie o Celery Worker (em outro terminal):"
echo "   ${YELLOW}cd backend${NC}"
echo "   ${YELLOW}source venv/bin/activate${NC}"
echo "   ${YELLOW}celery -A app.tasks.celery_app worker --loglevel=info --pool=solo${NC}"
echo ""
echo "4. Inicie o Celery Beat (em outro terminal):"
echo "   ${YELLOW}cd backend${NC}"
echo "   ${YELLOW}source venv/bin/activate${NC}"
echo "   ${YELLOW}celery -A app.tasks.celery_app beat --loglevel=info${NC}"
echo ""
echo "5. Inicie o frontend (em outro terminal):"
echo "   ${YELLOW}cd frontend${NC}"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "=========================="
echo "🌐 Acesse:"
echo "=========================="
echo "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo "   Backend API: ${GREEN}http://localhost:8000${NC}"
echo "   API Docs: ${GREEN}http://localhost:8000/docs${NC}"
echo "   Status: ${GREEN}http://localhost:8000/api/monitoring/status${NC}"
echo ""
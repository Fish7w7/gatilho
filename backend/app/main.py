from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .api import auth, alerts
from .websocket import manager
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Cria as tabelas no banco
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Tabelas do banco de dados criadas/verificadas")
except Exception as e:
    logger.error(f"❌ Erro ao criar tabelas: {e}")

app = FastAPI(
    title="Gatilho API",
    description="API para alertas inteligentes de ações da B3",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ==========================================
# CORS - CONFIGURAÇÃO CRÍTICA
# ==========================================
# DEVE estar ANTES de todas as rotas
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight por 1 hora
)

# Rotas principais
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alertas"])

# Importa e inclui rotas de monitoramento
try:
    from .api import monitoring
    app.include_router(monitoring.router, prefix="/api/monitoring", tags=["Monitoramento"])
    logger.info("✅ Rotas de monitoramento carregadas")
except Exception as e:
    logger.warning(f"⚠️ Rotas de monitoramento não carregadas: {e}")

@app.get("/")
def root():
    """Endpoint raiz com informações da API"""
    return {
        "message": "Gatilho API v1.0.0",
        "status": "online",
        "description": "Alertas inteligentes para ações da B3",
        "endpoints": {
            "docs": "/docs",
            "health": "/api/monitoring/health",
            "status": "/api/monitoring/status"
        }
    }

@app.get("/health")
def health_check():
    """Health check simplificado"""
    return {"status": "healthy", "service": "Gatilho API"}

# Middleware para debug (COMENTAR EM PRODUÇÃO)
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"🔵 {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"✅ Status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"❌ Erro: {e}")
        raise

# WebSocket para notificações em tempo real
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        logger.info(f"🔌 WebSocket desconectado: user_id={user_id}")

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Gatilho API iniciada")
    logger.info("📊 Endpoints disponíveis:")
    logger.info("   - Docs: http://localhost:8000/docs")
    logger.info("   - Health: http://localhost:8000/health")
    logger.info("   - Status: http://localhost:8000/api/monitoring/status")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Gatilho API encerrada")
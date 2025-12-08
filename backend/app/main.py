from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .api import auth, alerts

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gatilho API",
    description="API para alertas inteligentes de ações da B3",
    version="1.0.0"
)

# CORS CONFIGURADO CORRETAMENTE
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # Caso mude a porta
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Métodos permitidos
    allow_headers=["*"],  # Todos os headers
    expose_headers=["*"],
)

# Rotas
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticação"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alertas"])

@app.get("/")
def root():
    return {
        "message": "Gatilho API v1.0.0",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Middleware para debug (remover em produção)
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"🔵 {request.method} {request.url}")
    response = await call_next(request)
    print(f"✅ Status: {response.status_code}")
    return response
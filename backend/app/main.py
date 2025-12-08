from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import engine, Base
from .api import auth, alerts

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gatilho API",
    description="API para alertas inteligentes de ações da B3",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

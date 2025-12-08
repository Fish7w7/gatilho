from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    TWELVE_DATA_API_KEY: str = "demo"
    SENDGRID_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@gatilho.app"

    class Config:
        env_file = ".env"

settings = Settings()

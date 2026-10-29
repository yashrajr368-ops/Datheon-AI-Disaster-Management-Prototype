import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "DATHEON AI"
    HACKATHON: str = "AI Manthan 2.0"
    DOMAIN: str = "AI for Disaster Management"
    TAGLINE: str = "Intelligent Risk Analysis. Better Preparedness. Safer Communities."
    
    SECRET_KEY: str = "datheon-super-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "datheon2026!"
    
    DATABASE_URL: str = "sqlite:///./datheon.db"
    GEMINI_API_KEY: str = ""
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,*"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

settings = Settings()

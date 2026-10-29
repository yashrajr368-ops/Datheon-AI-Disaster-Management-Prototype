"""
DATHEON AI - Backend Application Entry Point
AI Manthan 2.0 — National Level Hackathon
AI for Disaster Management
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_database
from app.routers import (
    dashboard,
    locations,
    risk,
    shelters,
    routes,
    chat,
    admin,
    reports
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed demonstration records
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Risk Analysis. Better Preparedness. Safer Communities. Built for AI Manthan 2.0 Hackathon.",
    version="1.0.0"
)

# Enable CORS for React + Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all modular routers
app.include_router(dashboard.router)
app.include_router(locations.router)
app.include_router(risk.router)
app.include_router(shelters.router)
app.include_router(routes.router)
app.include_router(chat.router)
app.include_router(admin.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "hackathon": settings.HACKATHON,
        "domain": settings.DOMAIN,
        "tagline": settings.TAGLINE,
        "status": "online",
        "demonstration_notice": "Academic decision-support prototype. Clearly labeled synthetic indicators.",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

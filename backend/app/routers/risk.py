import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AssessmentRecord
from app.schemas import RiskAnalysisRequest, RiskAnalysisResponse
from app.ml_risk_engine import risk_engine

router = APIRouter(prefix="/api/risk", tags=["Risk Analysis"])

@router.post("/evaluate", response_model=RiskAnalysisResponse)
def evaluate_risk_indicators(data: RiskAnalysisRequest, db: Session = Depends(get_db)):
    result = risk_engine.evaluate_risk(
        rainfall_mm=data.rainfall_mm,
        river_level_m=data.river_level_m,
        historical_flood_events=data.historical_flood_events,
        terrain_susceptibility=data.terrain_susceptibility,
        population_vulnerability=data.population_vulnerability,
        location_name=data.location_name or "Custom Assessment Sector"
    )

    # Save assessment history record
    record = AssessmentRecord(
        location_name=data.location_name or "Custom Assessment Sector",
        latitude=data.latitude,
        longitude=data.longitude,
        rainfall_mm=data.rainfall_mm,
        river_level_m=data.river_level_m,
        historical_events=data.historical_flood_events,
        terrain_score=data.terrain_susceptibility,
        population_score=data.population_vulnerability,
        calculated_risk_score=result["risk_score"],
        risk_category=result["risk_category"],
        contributing_factors=json.dumps(result["factors"]),
        data_quality_score=result["data_quality_score"]
    )
    db.add(record)
    db.commit()

    return result

@router.get("/recent-assessments")
def get_recent_assessments(db: Session = Depends(get_db)):
    records = db.query(AssessmentRecord).order_by(AssessmentRecord.created_at.desc()).limit(10).all()
    out = []
    for r in records:
        factors = []
        try:
            factors = json.loads(r.contributing_factors)
        except Exception:
            pass
        out.append({
            "id": r.id,
            "location_name": r.location_name,
            "risk_score": r.calculated_risk_score,
            "risk_category": r.risk_category,
            "rainfall_mm": r.rainfall_mm,
            "river_level_m": r.river_level_m,
            "data_quality_score": r.data_quality_score,
            "created_at": r.created_at,
            "factors": factors
        })
    return out

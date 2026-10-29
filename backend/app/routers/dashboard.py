from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Location, Shelter, Alert, ActivityLog

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_locations = db.query(Location).count()
    severe_risk_count = db.query(Location).filter(Location.risk_category == "Severe").count()
    high_risk_count = db.query(Location).filter(Location.risk_category == "High").count()
    moderate_risk_count = db.query(Location).filter(Location.risk_category == "Moderate").count()
    low_risk_count = db.query(Location).filter(Location.risk_category == "Low").count()
    
    total_shelters = db.query(Shelter).count()
    shelter_capacities = db.query(
        func.sum(Shelter.capacity),
        func.sum(Shelter.current_occupancy)
    ).first()
    total_capacity = shelter_capacities[0] or 0
    total_occupied = shelter_capacities[1] or 0
    
    active_alerts = db.query(Alert).filter(Alert.is_active == True).count()
    
    avg_risk = db.query(func.avg(Location.risk_score)).scalar() or 0.0

    return {
        "total_monitored_locations": total_locations,
        "critical_vulnerable_count": severe_risk_count + high_risk_count,
        "severe_risk_count": severe_risk_count,
        "high_risk_count": high_risk_count,
        "moderate_risk_count": moderate_risk_count,
        "low_risk_count": low_risk_count,
        "average_basin_risk_score": round(float(avg_risk), 1),
        "total_shelters": total_shelters,
        "total_shelter_capacity": total_capacity,
        "total_shelter_occupied": total_occupied,
        "shelter_occupancy_rate_percent": round((total_occupied / total_capacity * 100), 1) if total_capacity else 0.0,
        "active_demonstration_alerts": active_alerts,
        "is_simulated": True,
        "data_provenance": "Synthetic Telemetry Engine (AI Manthan 2.0 Demonstration Model)"
    }

@router.get("/risk-distribution")
def get_risk_distribution(db: Session = Depends(get_db)):
    categories = ["Low", "Moderate", "High", "Severe"]
    distribution = []
    colors = {
        "Low": "#10B981",       # Emerald Green
        "Moderate": "#F59E0B",  # Amber
        "High": "#F97316",      # Orange
        "Severe": "#EF4444"     # Alert Red
    }
    
    for cat in categories:
        count = db.query(Location).filter(Location.risk_category == cat).count()
        distribution.append({
            "category": cat,
            "count": count,
            "fill": colors.get(cat, "#3B82F6")
        })
    return distribution

@router.get("/historical-trends")
def get_historical_indicator_trends():
    """
    Returns synthetic 24-hr multi-hour indicator progression to demonstrate trend visualization.
    """
    now = datetime.utcnow()
    trends = []
    # 8 time points over the past 24 hours (every 3 hours)
    base_rain = [20, 28, 45, 62, 88, 110, 135, 128]
    base_river = [0.2, 0.4, 0.8, 1.3, 1.9, 2.5, 3.2, 3.1]
    
    for i in range(8):
        t = now - timedelta(hours=3 * (7 - i))
        trends.append({
            "time": t.strftime("%H:%M"),
            "timestamp": t.isoformat(),
            "rainfall_mm": base_rain[i],
            "river_level_m": base_river[i],
            "danger_threshold_m": 2.0,
            "is_simulated": True
        })
    return {
        "indicator_name": "Brahmaputra-Barak Basin Average 24-Hour Telemetry",
        "data": trends,
        "disclaimer": "Simulated indicator time-series for visualization demonstration"
    }

@router.get("/alerts")
def get_dashboard_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.is_active == True).order_by(Alert.timestamp.desc()).all()
    return alerts

@router.get("/recent-activity")
def get_recent_activity(db: Session = Depends(get_db)):
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(10).all()
    return logs

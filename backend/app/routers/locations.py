import math
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Location, Shelter, ActivityLog
from app.schemas import LocationCreate, LocationUpdate, LocationResponse
from app.ml_risk_engine import risk_engine
from app.auth import verify_token

router = APIRouter(prefix="/api/locations", tags=["Locations"])

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("", response_model=List[LocationResponse])
def get_locations(
    category: Optional[str] = Query(None, description="Filter by risk category: Low, Moderate, High, Severe"),
    search: Optional[str] = Query(None, description="Search by location name or district"),
    db: Session = Depends(get_db)
):
    query = db.query(Location)
    if category and category != "All":
        query = query.filter(Location.risk_category == category)
    if search:
        query = query.filter(
            (Location.name.ilike(f"%{search}%")) | (Location.district.ilike(f"%{search}%"))
        )
    return query.order_by(Location.risk_score.desc()).all()

@router.get("/{location_id}")
def get_location_details(location_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location record not found")

    # Evaluate full risk breakdown
    eval_res = risk_engine.evaluate_risk(
        rainfall_mm=loc.rainfall_mm,
        river_level_m=loc.river_level_m,
        historical_flood_events=loc.historical_flood_events,
        terrain_susceptibility=loc.terrain_susceptibility,
        population_vulnerability=loc.population_vulnerability,
        location_name=loc.name
    )

    # Find nearest shelters
    all_shelters = db.query(Shelter).all()
    shelter_distances = []
    for sh in all_shelters:
        dist = haversine_km(loc.latitude, loc.longitude, sh.latitude, sh.longitude)
        shelter_distances.append({
            "id": sh.id,
            "name": sh.name,
            "district": sh.district,
            "latitude": sh.latitude,
            "longitude": sh.longitude,
            "capacity": sh.capacity,
            "current_occupancy": sh.current_occupancy,
            "available_capacity": max(0, sh.capacity - sh.current_occupancy),
            "status": sh.status,
            "distance_km": dist,
            "facilities": sh.facilities,
            "accessibility_info": sh.accessibility_info,
            "contact_phone": sh.contact_phone
        })
    shelter_distances.sort(key=lambda x: x["distance_km"])

    return {
        "location": {
            "id": loc.id,
            "name": loc.name,
            "district": loc.district,
            "state": loc.state,
            "latitude": loc.latitude,
            "longitude": loc.longitude,
            "rainfall_mm": loc.rainfall_mm,
            "river_level_m": loc.river_level_m,
            "historical_flood_events": loc.historical_flood_events,
            "terrain_susceptibility": loc.terrain_susceptibility,
            "population_vulnerability": loc.population_vulnerability,
            "risk_score": loc.risk_score,
            "risk_category": loc.risk_category,
            "is_simulated": loc.is_simulated,
            "updated_at": loc.updated_at
        },
        "risk_breakdown": eval_res,
        "nearest_shelters": shelter_distances[:4]
    }

@router.post("", response_model=LocationResponse)
def create_location(
    data: LocationCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_token)
):
    existing = db.query(Location).filter(Location.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Location with this name already exists")

    eval_res = risk_engine.evaluate_risk(
        rainfall_mm=data.rainfall_mm,
        river_level_m=data.river_level_m,
        historical_flood_events=data.historical_flood_events,
        terrain_susceptibility=data.terrain_susceptibility,
        population_vulnerability=data.population_vulnerability,
        location_name=data.name
    )

    new_loc = Location(
        **data.dict(),
        risk_score=eval_res["risk_score"],
        risk_category=eval_res["risk_category"],
        is_simulated=True
    )
    db.add(new_loc)
    
    # Audit log
    db.add(ActivityLog(
        action="LOCATION_CREATED",
        details=f"Admin added monitored location '{data.name}' with risk score {eval_res['risk_score']} ({eval_res['risk_category']}).",
        user_role=admin.get("sub", "Admin")
    ))
    db.commit()
    db.refresh(new_loc)
    return new_loc

@router.put("/{location_id}", response_model=LocationResponse)
def update_location(
    location_id: int,
    data: LocationUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_token)
):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location record not found")

    update_data = data.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(loc, field, val)

    # Recalculate risk automatically
    eval_res = risk_engine.evaluate_risk(
        rainfall_mm=loc.rainfall_mm,
        river_level_m=loc.river_level_m,
        historical_flood_events=loc.historical_flood_events,
        terrain_susceptibility=loc.terrain_susceptibility,
        population_vulnerability=loc.population_vulnerability,
        location_name=loc.name
    )
    loc.risk_score = eval_res["risk_score"]
    loc.risk_category = eval_res["risk_category"]

    db.add(ActivityLog(
        action="LOCATION_UPDATED",
        details=f"Admin updated indicators for '{loc.name}'. New risk score: {loc.risk_score} ({loc.risk_category}).",
        user_role=admin.get("sub", "Admin")
    ))
    db.commit()
    db.refresh(loc)
    return loc

@router.delete("/{location_id}")
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_token)
):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Location not found")

    loc_name = loc.name
    db.delete(loc)
    db.add(ActivityLog(
        action="LOCATION_DELETED",
        details=f"Admin removed monitored location '{loc_name}'.",
        user_role=admin.get("sub", "Admin")
    ))
    db.commit()
    return {"message": f"Location '{loc_name}' deleted successfully"}

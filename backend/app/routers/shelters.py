from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Shelter, ActivityLog
from app.schemas import ShelterCreate, ShelterUpdate, ShelterResponse
from app.auth import verify_token

router = APIRouter(prefix="/api/shelters", tags=["Shelters"])

@router.get("", response_model=List[ShelterResponse])
def get_shelters(
    district: Optional[str] = Query(None, description="Filter by district"),
    status: Optional[str] = Query(None, description="Filter by status: Active, Near Capacity, Full"),
    search: Optional[str] = Query(None, description="Search by shelter name or address"),
    db: Session = Depends(get_db)
):
    query = db.query(Shelter)
    if district and district != "All":
        query = query.filter(Shelter.district == district)
    if status and status != "All":
        query = query.filter(Shelter.status == status)
    if search:
        query = query.filter(
            (Shelter.name.ilike(f"%{search}%")) | (Shelter.address.ilike(f"%{search}%"))
        )
    return query.order_by(Shelter.name.asc()).all()

@router.get("/{shelter_id}", response_model=ShelterResponse)
def get_shelter(shelter_id: int, db: Session = Depends(get_db)):
    shelter = db.query(Shelter).filter(Shelter.id == shelter_id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter record not found")
    return shelter

@router.post("", response_model=ShelterResponse)
def create_shelter(
    data: ShelterCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_token)
):
    new_sh = Shelter(**data.dict(), is_simulated=True)
    db.add(new_sh)
    db.add(ActivityLog(
        action="SHELTER_CREATED",
        details=f"Admin registered new emergency shelter '{data.name}' with capacity {data.capacity}.",
        user_role=admin.get("sub", "Admin")
    ))
    db.commit()
    db.refresh(new_sh)
    return new_sh

@router.put("/{shelter_id}", response_model=ShelterResponse)
def update_shelter(
    shelter_id: int,
    data: ShelterUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_token)
):
    sh = db.query(Shelter).filter(Shelter.id == shelter_id).first()
    if not sh:
        raise HTTPException(status_code=404, detail="Shelter not found")

    update_data = data.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(sh, k, v)

    # Recalculate status based on occupancy if needed
    if sh.capacity > 0:
        pct = (sh.current_occupancy / sh.capacity) * 100
        if pct >= 95:
            sh.status = "Full"
        elif pct >= 70:
            sh.status = "Near Capacity"
        else:
            sh.status = "Active"

    db.add(ActivityLog(
        action="SHELTER_UPDATED",
        details=f"Admin updated shelter '{sh.name}'. Occupancy: {sh.current_occupancy}/{sh.capacity}.",
        user_role=admin.get("sub", "Admin")
    ))
    db.commit()
    db.refresh(sh)
    return sh

@router.delete("/{shelter_id}")
def delete_shelter(
    shelter_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_token)
):
    sh = db.query(Shelter).filter(Shelter.id == shelter_id).first()
    if not sh:
        raise HTTPException(status_code=404, detail="Shelter not found")

    sh_name = sh.name
    db.delete(sh)
    db.add(ActivityLog(
        action="SHELTER_DELETED",
        details=f"Admin deleted shelter record '{sh_name}'.",
        user_role=admin.get("sub", "Admin")
    ))
    db.commit()
    return {"message": f"Shelter '{sh_name}' deleted successfully"}

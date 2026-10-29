from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from app.database import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False, unique=True, index=True)
    district = Column(String(80), nullable=False)
    state = Column(String(80), default="Assam")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Real-time / simulated indicators
    rainfall_mm = Column(Float, default=45.0)  # 24hr rainfall
    river_level_m = Column(Float, default=1.2)  # meters above baseline
    historical_flood_events = Column(Integer, default=3)  # past 10 years
    terrain_susceptibility = Column(Float, default=0.55)  # 0.0 to 1.0
    population_vulnerability = Column(Float, default=0.60)  # 0.0 to 1.0
    
    # Calculated risk
    risk_score = Column(Float, default=52.0)  # 0 - 100
    risk_category = Column(String(20), default="Moderate")  # Low, Moderate, High, Severe
    
    is_simulated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Shelter(Base):
    __tablename__ = "shelters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    district = Column(String(80), nullable=False)
    address = Column(String(255), default="")
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    capacity = Column(Integer, default=500)
    current_occupancy = Column(Integer, default=120)
    status = Column(String(30), default="Active")  # Active, Standby, Full, Restricted
    
    accessibility_info = Column(String(255), default="Wheelchair Ramp, Ground-Floor Clinic, Senior Access")
    facilities = Column(Text, default="Clean Water, Backup Generator, Medical Post, Food Supplies, Sanitation")
    contact_person = Column(String(100), default="District Emergency Officer")
    contact_phone = Column(String(30), default="+91 1800-345-001")
    
    is_simulated = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    severity = Column(String(20), default="Moderate")  # Low, Moderate, High, Severe
    location_name = Column(String(120), default="Regional River Basin")
    description = Column(Text, nullable=False)
    source = Column(String(120), default="Simulated CWC/IMD Demonstration Feed")
    is_active = Column(Boolean, default=True)
    is_simulated = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    user_role = Column(String(50), default="System")
    timestamp = Column(DateTime, default=datetime.utcnow)

class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String(120), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    rainfall_mm = Column(Float, nullable=False)
    river_level_m = Column(Float, nullable=False)
    historical_events = Column(Integer, nullable=False)
    terrain_score = Column(Float, nullable=False)
    population_score = Column(Float, nullable=False)
    
    calculated_risk_score = Column(Float, nullable=False)
    risk_category = Column(String(30), nullable=False)
    contributing_factors = Column(Text, default="{}")
    data_quality_score = Column(Float, default=95.0)
    created_at = Column(DateTime, default=datetime.utcnow)

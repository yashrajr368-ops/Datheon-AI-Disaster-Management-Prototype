from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# Location Schemas
class LocationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    district: str = Field(..., min_length=2, max_length=80)
    state: str = Field("Assam", max_length=80)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    rainfall_mm: float = Field(..., ge=0.0, le=1000.0, description="24-hr Rainfall indicator in mm")
    river_level_m: float = Field(..., ge=-5.0, le=25.0, description="Meters above danger level")
    historical_flood_events: int = Field(..., ge=0, le=100, description="Number of flood events in past decade")
    terrain_susceptibility: float = Field(..., ge=0.0, le=1.0, description="Elevation/drainage factor (0: resilient, 1: highly vulnerable)")
    population_vulnerability: float = Field(..., ge=0.0, le=1.0, description="Socio-economic density factor (0: low, 1: high)")

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rainfall_mm: Optional[float] = None
    river_level_m: Optional[float] = None
    historical_flood_events: Optional[int] = None
    terrain_susceptibility: Optional[float] = None
    population_vulnerability: Optional[float] = None

class LocationResponse(LocationBase):
    id: int
    risk_score: float
    risk_category: str
    is_simulated: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Shelter Schemas
class ShelterBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    district: str = Field(..., min_length=2, max_length=80)
    address: Optional[str] = ""
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    capacity: int = Field(..., ge=1, le=50000)
    current_occupancy: int = Field(0, ge=0)
    status: str = Field("Active", max_length=30)
    accessibility_info: str = Field("Wheelchair Ramp, Ground-Floor Clinic", max_length=255)
    facilities: str = Field("Clean Water, Backup Generator, First Aid Post", max_length=500)
    contact_person: Optional[str] = "District Emergency Coordinator"
    contact_phone: Optional[str] = "+91 1800-345-001"

class ShelterCreate(ShelterBase):
    pass

class ShelterUpdate(BaseModel):
    name: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity: Optional[int] = None
    current_occupancy: Optional[int] = None
    status: Optional[str] = None
    accessibility_info: Optional[str] = None
    facilities: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None

class ShelterResponse(ShelterBase):
    id: int
    is_simulated: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    title: str
    severity: str
    location_name: str
    description: str
    source: str
    is_active: bool
    is_simulated: bool
    timestamp: datetime

    class Config:
        from_attributes = True

# Activity Log
class ActivityLogResponse(BaseModel):
    id: int
    action: str
    details: str
    user_role: str
    timestamp: datetime

    class Config:
        from_attributes = True

# Risk Analysis Request & Response
class RiskAnalysisRequest(BaseModel):
    location_name: Optional[str] = "Demo Sector"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rainfall_mm: float = Field(..., ge=0.0, le=1000.0, description="24-hr Rainfall in mm")
    river_level_m: float = Field(..., ge=-5.0, le=25.0, description="River gauge level relative to danger mark (m)")
    historical_flood_events: int = Field(..., ge=0, le=100, description="Past flood events in 10-year window")
    terrain_susceptibility: float = Field(..., ge=0.0, le=1.0, description="Slope, elevation & drainage rating (0-1)")
    population_vulnerability: float = Field(..., ge=0.0, le=1.0, description="Demographic & infrastructure vulnerability (0-1)")

class FactorBreakdown(BaseModel):
    name: str
    raw_value: float
    unit: str
    normalized_weight: float
    weighted_score: float
    contribution_percent: float
    explanation: str

class RiskAnalysisResponse(BaseModel):
    risk_score: float
    risk_category: str
    methodology: str
    rule_score: float
    ml_predicted_score: float
    ml_confidence: float
    factors: List[FactorBreakdown]
    data_quality_score: float
    limitations: List[str]
    suggested_actions: List[str]
    is_simulated: bool
    disclaimer: str

# Route Demonstration Schemas
class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    dest_lat: float
    dest_lng: float
    avoid_high_risk: bool = True

class RouteStep(BaseModel):
    instruction: str
    distance_km: float
    duration_min: float
    hazard_level: str

class RouteResponse(BaseModel):
    summary: str
    total_distance_km: float
    estimated_time_min: float
    waypoints: List[List[float]]
    steps: List[RouteStep]
    hazard_analysis: Dict[str, Any]
    is_demonstration: bool
    safety_disclaimer: str

# Chat Assistant Schemas
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    location_context: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    sources_consulted: List[str]
    suggested_followups: List[str]
    disclaimer: str

# Admin Auth Schemas
class AdminLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str = "admin"

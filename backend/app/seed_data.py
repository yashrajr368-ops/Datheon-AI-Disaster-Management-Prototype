"""
DATHEON AI - Demonstration Seed Data for Disaster Management Prototype
Provides realistic synthetic demonstration locations, shelters, alerts, and activity logs.
Focus: Brahmaputra River Basin Flood Management Scenario (Assam, India).
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import Location, Shelter, Alert, ActivityLog
from app.ml_risk_engine import risk_engine

INITIAL_LOCATIONS = [
    {
        "name": "Guwahati Urban Sector 4 (Bharalu Catchment)",
        "district": "Kamrup Metropolitan",
        "state": "Assam",
        "latitude": 26.1824,
        "longitude": 91.7450,
        "rainfall_mm": 115.0,
        "river_level_m": 2.1,
        "historical_flood_events": 6,
        "terrain_susceptibility": 0.78,
        "population_vulnerability": 0.85
    },
    {
        "name": "Silchar Barak River Front",
        "district": "Cachar",
        "state": "Assam",
        "latitude": 24.8333,
        "longitude": 92.7789,
        "rainfall_mm": 160.0,
        "river_level_m": 3.8,
        "historical_flood_events": 8,
        "terrain_susceptibility": 0.88,
        "population_vulnerability": 0.90
    },
    {
        "name": "Kaziranga Southern Buffer Zone",
        "district": "Golaghat",
        "state": "Assam",
        "latitude": 26.5775,
        "longitude": 93.1711,
        "rainfall_mm": 85.0,
        "river_level_m": 1.4,
        "historical_flood_events": 7,
        "terrain_susceptibility": 0.82,
        "population_vulnerability": 0.45
    },
    {
        "name": "Dibrugarh Upper Embankment Reach",
        "district": "Dibrugarh",
        "state": "Assam",
        "latitude": 27.4728,
        "longitude": 94.9120,
        "rainfall_mm": 95.0,
        "river_level_m": 1.9,
        "historical_flood_events": 5,
        "terrain_susceptibility": 0.65,
        "population_vulnerability": 0.70
    },
    {
        "name": "Tezpur Lowlands & Bhairabi Plain",
        "district": "Sonitpur",
        "state": "Assam",
        "latitude": 26.6338,
        "longitude": 92.7926,
        "rainfall_mm": 40.0,
        "river_level_m": 0.3,
        "historical_flood_events": 3,
        "terrain_susceptibility": 0.42,
        "population_vulnerability": 0.55
    },
    {
        "name": "Majuli Island South (Kamalabari Ghat)",
        "district": "Majuli",
        "state": "Assam",
        "latitude": 26.9535,
        "longitude": 94.2140,
        "rainfall_mm": 140.0,
        "river_level_m": 3.2,
        "historical_flood_events": 9,
        "terrain_susceptibility": 0.92,
        "population_vulnerability": 0.75
    },
    {
        "name": "Barpeta Basin Drainage Confluence",
        "district": "Barpeta",
        "state": "Assam",
        "latitude": 26.3212,
        "longitude": 91.0066,
        "rainfall_mm": 70.0,
        "river_level_m": 1.1,
        "historical_flood_events": 4,
        "terrain_susceptibility": 0.58,
        "population_vulnerability": 0.62
    },
    {
        "name": "Dispur Capital Ridge (Elevated Zone)",
        "district": "Kamrup Metropolitan",
        "state": "Assam",
        "latitude": 26.1430,
        "longitude": 91.7898,
        "rainfall_mm": 25.0,
        "river_level_m": -1.2,
        "historical_flood_events": 1,
        "terrain_susceptibility": 0.20,
        "population_vulnerability": 0.40
    }
]

INITIAL_SHELTERS = [
    {
        "name": "Guwahati Central Multipurpose Relief Centre",
        "district": "Kamrup Metropolitan",
        "address": "G.S. Road, Near Nehru Stadium, Guwahati",
        "latitude": 26.1750,
        "longitude": 91.7580,
        "capacity": 850,
        "current_occupancy": 320,
        "status": "Active",
        "accessibility_info": "Wheelchair Ramp, Dedicated Medical Bay, Priority Senior Dormitory",
        "facilities": "Clean Water, 40kW Diesel Generator, First Aid Unit, Community Kitchen, Infant Nutrition",
        "contact_person": "Inspector B. Gogoi (DDMA)",
        "contact_phone": "+91 361-2234001"
    },
    {
        "name": "Silchar District Indoor Sports Complex Relief Shelter",
        "district": "Cachar",
        "address": "Tarapur Sports Enclave, Silchar",
        "latitude": 24.8250,
        "longitude": 92.7950,
        "capacity": 1200,
        "current_occupancy": 890,
        "status": "Near Capacity",
        "accessibility_info": "Elevator Access, Ground-level Ambulance Bay, Disability-friendly Washrooms",
        "facilities": "RO Purified Water, Emergency Solar Backup, 24/7 Paramedic Post, Food Packets, Baby Care",
        "contact_person": "Dr. S. Mazumder (Red Cross Liaison)",
        "contact_phone": "+91 3842-261099"
    },
    {
        "name": "Bokakhat Higher Secondary Highland Shelter",
        "district": "Golaghat",
        "address": "NH-715 Highland Ridge, Bokakhat",
        "latitude": 26.6020,
        "longitude": 93.3600,
        "capacity": 550,
        "current_occupancy": 140,
        "status": "Active",
        "accessibility_info": "Ramped Corridors, Livestock Enclosure Compound, Pediatric Room",
        "facilities": "Tube-well Water Filtration, Genset, Mobile Medical Van, Animal Fodder Depot",
        "contact_person": "P. Saikia (Civil Defence Officer)",
        "contact_phone": "+91 3776-268022"
    },
    {
        "name": "Dibrugarh University Flood Contingency Hall",
        "district": "Dibrugarh",
        "address": "Rajabheta Campus, Dibrugarh",
        "latitude": 27.4520,
        "longitude": 94.8980,
        "capacity": 700,
        "current_occupancy": 210,
        "status": "Active",
        "accessibility_info": "Barrier-free Entrances, Senior Care Ward, Dedicated Women Section",
        "facilities": "Potable Water Reservoirs, High-Capacity Generator, First Aid & ORS Dispensary",
        "contact_person": "K. Baruah (Disaster Liaison)",
        "contact_phone": "+91 373-2370243"
    },
    {
        "name": "Tezpur Collegiate Elevated Refuge Centre",
        "district": "Sonitpur",
        "address": "Mahabhairab Ridge, Tezpur",
        "latitude": 26.6450,
        "longitude": 92.7880,
        "capacity": 450,
        "current_occupancy": 65,
        "status": "Active",
        "accessibility_info": "Single-level Access, Wheelchair Corridors, Restroom Grab Bars",
        "facilities": "Clean Chlorinated Water, Battery Inverter Station, Packaged Rations, Blankets",
        "contact_person": "M. Das (DDMA Field Officer)",
        "contact_phone": "+91 3712-220110"
    },
    {
        "name": "Majuli Island Kamalabari Highland Safe Mound",
        "district": "Majuli",
        "address": "Kamalabari Highland Mound, Majuli",
        "latitude": 26.9600,
        "longitude": 94.2250,
        "capacity": 600,
        "current_occupancy": 480,
        "status": "Near Capacity",
        "accessibility_info": "Engineered Elevated Ramp, Helipad Access, Raised Livestock Corral",
        "facilities": "Solar Water Purification, Satellite Phone Terminal, First Aid Center, Dry Food Reserves",
        "contact_person": "T. Dutta (District Magistrate Delegate)",
        "contact_phone": "+91 3775-274431"
    }
]

INITIAL_ALERTS = [
    {
        "title": "Severe Discharge Notice: Barak River Basin Inundation",
        "severity": "Severe",
        "location_name": "Silchar Barak River Front",
        "description": "Simulated gauge telemetry indicates river level has breached extreme danger threshold by +3.8 meters. Vulnerable low-lying wards are advised to initiate pre-planned shelter relocation.",
        "source": "Simulated CWC/IMD Demonstration Feed",
        "is_active": True,
        "timestamp": datetime.utcnow() - timedelta(minutes=42)
    },
    {
        "title": "High Runoff Alert: Bharalu Stormwater Surcharge",
        "severity": "High",
        "location_name": "Guwahati Urban Sector 4",
        "description": "Simulated 24-hr precipitation has exceeded 115 mm in Bharalu catchment. Flash waterlogging simulated across arterial roadways.",
        "source": "Simulated Regional Hydro-Met Demonstration Model",
        "is_active": True,
        "timestamp": datetime.utcnow() - timedelta(hours=2, minutes=15)
    },
    {
        "title": "Moderate Spillover Vigil: Brahmaputra South Bank",
        "severity": "Moderate",
        "location_name": "Kaziranga Southern Buffer Zone",
        "description": "Simulated flood indicators suggest animal corridors and low grasslands are partially inundated. Elevated highland mounds activated for wildlife and local communities.",
        "source": "Simulated Basin Telemetry Network",
        "is_active": True,
        "timestamp": datetime.utcnow() - timedelta(hours=5)
    },
    {
        "title": "Precautionary River Level Advisory: Upper Reach",
        "severity": "Moderate",
        "location_name": "Dibrugarh Upper Embankment Reach",
        "description": "Simulated river gauge indicates rising water level approaching +1.9 m. Embankment monitoring teams deployed for demonstration routine check.",
        "source": "Simulated CWC Telemetry Feed",
        "is_active": True,
        "timestamp": datetime.utcnow() - timedelta(hours=8)
    }
]

INITIAL_ACTIVITY_LOGS = [
    {
        "action": "SYSTEM_INITIALIZED",
        "details": "DATHEON AI prototype engine initialized with synthetic multi-hazard telemetry dataset for AI Manthan 2.0 hackathon.",
        "user_role": "System",
        "timestamp": datetime.utcnow() - timedelta(hours=12)
    },
    {
        "action": "MODEL_CALIBRATION",
        "details": "scikit-learn Random Forest regression model trained on 3,000 synthetic historical flood events.",
        "user_role": "AI Engineer",
        "timestamp": datetime.utcnow() - timedelta(hours=10)
    },
    {
        "action": "INDICATOR_UPDATE",
        "details": "Updated simulated rainfall indicator for Silchar Barak River Front to 160 mm.",
        "user_role": "Admin",
        "timestamp": datetime.utcnow() - timedelta(hours=3)
    },
    {
        "action": "SHELTER_CAPACITY_SYNC",
        "details": "Updated demonstration occupancy telemetry for Silchar District Indoor Sports Complex Relief Shelter (890 / 1200 beds).",
        "user_role": "Admin",
        "timestamp": datetime.utcnow() - timedelta(hours=1)
    }
]

def seed_database(db: Session):
    """Populates database with initial demonstration records if empty."""
    if db.query(Location).count() == 0:
        for loc in INITIAL_LOCATIONS:
            eval_res = risk_engine.evaluate_risk(
                rainfall_mm=loc["rainfall_mm"],
                river_level_m=loc["river_level_m"],
                historical_flood_events=loc["historical_flood_events"],
                terrain_susceptibility=loc["terrain_susceptibility"],
                population_vulnerability=loc["population_vulnerability"],
                location_name=loc["name"]
            )
            db_loc = Location(
                name=loc["name"],
                district=loc["district"],
                state=loc["state"],
                latitude=loc["latitude"],
                longitude=loc["longitude"],
                rainfall_mm=loc["rainfall_mm"],
                river_level_m=loc["river_level_m"],
                historical_flood_events=loc["historical_flood_events"],
                terrain_susceptibility=loc["terrain_susceptibility"],
                population_vulnerability=loc["population_vulnerability"],
                risk_score=eval_res["risk_score"],
                risk_category=eval_res["risk_category"],
                is_simulated=True
            )
            db.add(db_loc)
        db.commit()

    if db.query(Shelter).count() == 0:
        for sh in INITIAL_SHELTERS:
            db_sh = Shelter(
                name=sh["name"],
                district=sh["district"],
                address=sh["address"],
                latitude=sh["latitude"],
                longitude=sh["longitude"],
                capacity=sh["capacity"],
                current_occupancy=sh["current_occupancy"],
                status=sh["status"],
                accessibility_info=sh["accessibility_info"],
                facilities=sh["facilities"],
                contact_person=sh["contact_person"],
                contact_phone=sh["contact_phone"],
                is_simulated=True
            )
            db.add(db_sh)
        db.commit()

    if db.query(Alert).count() == 0:
        for al in INITIAL_ALERTS:
            db_al = Alert(
                title=al["title"],
                severity=al["severity"],
                location_name=al["location_name"],
                description=al["description"],
                source=al["source"],
                is_active=al["is_active"],
                is_simulated=True,
                timestamp=al["timestamp"]
            )
            db.add(db_al)
        db.commit()

    if db.query(ActivityLog).count() == 0:
        for act in INITIAL_ACTIVITY_LOGS:
            db_act = ActivityLog(
                action=act["action"],
                details=act["details"],
                user_role=act["user_role"],
                timestamp=act["timestamp"]
            )
            db.add(db_act)
        db.commit()

import math
import requests
from fastapi import APIRouter
from app.schemas import RouteRequest, RouteResponse

router = APIRouter(prefix="/api/routes", tags=["Routes"])

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def generate_interpolated_waypoints(lat1, lng1, lat2, lng2, num_points=12):
    """
    Generates realistic curving road-like waypoints between start and destination
    by adding small sinusoidal and topological perturbations.
    """
    pts = []
    for i in range(num_points + 1):
        fraction = i / num_points
        # Base linear interpolation
        lat = lat1 + (lat2 - lat1) * fraction
        lng = lng1 + (lng2 - lng1) * fraction
        
        # Add slight natural curve offset in middle of journey
        if 0 < i < num_points:
            offset = math.sin(fraction * math.pi) * 0.008
            lat += offset * 0.6
            lng += offset * 0.4
            
        pts.append([round(lat, 5), round(lng, 5)])
    return pts

@router.post("/demonstrate", response_model=RouteResponse)
def calculate_demonstration_route(req: RouteRequest):
    straight_dist = haversine_distance(req.start_lat, req.start_lng, req.dest_lat, req.dest_lng)
    
    # Try fetching from public OSRM service with short timeout
    waypoints = []
    used_osrm = False
    
    try:
        url = f"https://router.project-osrm.org/route/v1/driving/{req.start_lng},{req.start_lat};{req.dest_lng},{req.dest_lat}?overview=full&geometries=geojson"
        resp = requests.get(url, timeout=3.0)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("routes") and len(data["routes"]) > 0:
                coords = data["routes"][0]["geometry"]["coordinates"]
                # OSRM returns [lng, lat], Leaflet needs [lat, lng]
                waypoints = [[c[1], c[0]] for c in coords]
                used_osrm = True
    except Exception:
        used_osrm = False

    # Fallback to smart simulated corridor waypoints if OSRM is unreachable
    if not waypoints:
        waypoints = generate_interpolated_waypoints(req.start_lat, req.start_lng, req.dest_lat, req.dest_lng, num_points=15)

    # Road driving distance is typically 1.25x - 1.35x straight line distance
    est_distance_km = round(straight_dist * 1.32, 2)
    # Average evacuation speed assumed ~28 km/h in wet conditions
    est_duration_min = round(max(3.0, (est_distance_km / 28.0) * 60), 1)

    steps = [
        {
            "instruction": "Depart from selected starting point along the primary marked district arterial road.",
            "distance_km": round(est_distance_km * 0.15, 2),
            "duration_min": round(est_duration_min * 0.15, 1),
            "hazard_level": "Low"
        },
        {
            "instruction": "Continue onto the elevated bypass corridor. Maintain caution near bridge culverts.",
            "distance_km": round(est_distance_km * 0.50, 2),
            "duration_min": round(est_duration_min * 0.50, 1),
            "hazard_level": "Moderate (Demonstration: Watch for water accumulation)"
        },
        {
            "instruction": "Turn toward the designated shelter approach lane and proceed to the intake triage point.",
            "distance_km": round(est_distance_km * 0.35, 2),
            "duration_min": round(est_duration_min * 0.35, 1),
            "hazard_level": "Low"
        }
    ]

    hazard_analysis = {
        "routing_engine": "OSRM OpenStreetMap Driving Service" if used_osrm else "Simulated Geodesic Demonstration Corridor",
        "elevation_safety_score": "Elevated / Raised Causeway Corridor",
        "waterlogging_exposure": "Moderate (Simulated check: Avoid low-lying river embankments)",
        "recommendation": "Use high-clearance emergency utility vehicles or follow NDRF boat ferry directions if road inundation exceeds 15 cm."
    }

    return {
        "summary": f"Demonstration Route ({est_distance_km} km, ~{est_duration_min} mins)",
        "total_distance_km": est_distance_km,
        "estimated_time_min": est_duration_min,
        "waypoints": waypoints,
        "steps": steps,
        "hazard_analysis": hazard_analysis,
        "is_demonstration": True,
        "safety_disclaimer": "CRITICAL NOTICE: This is a synthetic demonstration route for prototype visualization only. Do NOT rely on this trajectory during an actual emergency. Always follow certified evacuation routes directed by the National Disaster Response Force (NDRF) and local administrative authorities."
    }

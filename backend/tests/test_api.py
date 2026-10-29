import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "DATHEON AI"
    assert "hackathon" in data

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_monitored_locations" in data
    assert data["is_simulated"] is True
    assert data["total_monitored_locations"] > 0

def test_dashboard_risk_distribution():
    response = client.get("/api/dashboard/risk-distribution")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    categories = [d["category"] for d in data]
    assert "Severe" in categories
    assert "Low" in categories

def test_dashboard_historical_trends():
    response = client.get("/api/dashboard/historical-trends")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) > 0

def test_get_locations():
    response = client.get("/api/locations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first = data[0]
    assert "risk_score" in first
    assert "risk_category" in first

def test_get_location_details():
    # First get a location ID
    locs = client.get("/api/locations").json()
    loc_id = locs[0]["id"]
    response = client.get(f"/api/locations/{loc_id}")
    assert response.status_code == 200
    data = response.json()
    assert "location" in data
    assert "risk_breakdown" in data
    assert "nearest_shelters" in data

def test_risk_evaluation():
    payload = {
        "location_name": "Test Sector",
        "rainfall_mm": 120.0,
        "river_level_m": 2.5,
        "historical_flood_events": 5,
        "terrain_susceptibility": 0.75,
        "population_vulnerability": 0.80
    }
    response = client.post("/api/risk/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_category" in data
    assert "factors" in data
    assert len(data["factors"]) == 5
    assert data["is_simulated"] is True
    assert "rule_score" in data
    assert "ml_predicted_score" in data

def test_shelters_directory():
    response = client.get("/api/shelters")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    first = data[0]
    assert "capacity" in first
    assert "accessibility_info" in first
    assert "facilities" in first

def test_route_demonstration():
    payload = {
        "start_lat": 26.1824,
        "start_lng": 91.7450,
        "dest_lat": 26.1750,
        "dest_lng": 91.7580,
        "avoid_high_risk": True
    }
    response = client.post("/api/routes/demonstrate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "waypoints" in data
    assert "steps" in data
    assert data["is_demonstration"] is True
    assert "safety_disclaimer" in data

def test_chat_assistant():
    payload = {
        "message": "What should I include in my 72 hour flood emergency kit?",
        "history": []
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "disclaimer" in data
    assert "sources_consulted" in data

def test_admin_auth_and_protected_endpoint():
    # Attempt login with correct default credentials
    login_res = client.post("/api/admin/login", json={
        "username": "admin",
        "password": "datheon2026!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

    # Test protected me endpoint
    me_res = client.get("/api/admin/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "admin"

    # Test protected endpoint without token
    unauth_res = client.get("/api/admin/me")
    assert unauth_res.status_code == 401

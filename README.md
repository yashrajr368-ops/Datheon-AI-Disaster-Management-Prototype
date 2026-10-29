# 🛡️ DATHEON AI

> **Intelligent Risk Analysis. Better Preparedness. Safer Communities.**  
> *Developed for **AI Manthan 2.0 — National Level Hackathon***  
> **Domain:** AI for Disaster Management  

---

## 📌 Executive Summary

**DATHEON AI** is an AI-powered disaster management decision-support prototype built to aid community preparedness, emergency coordinators, and civic administrators during catastrophic flood events. Operating on a multi-hazard scenario in the **Brahmaputra & Barak River Catchment Basins (Assam, India)**, DATHEON AI integrates hydro-meteorological indicators, terrain susceptibility indices, and socio-demographic exposure into an explainable risk matrix alongside an interactive Leaflet hazard map, dynamic emergency shelter directory, safe demonstration evacuation corridors, an intelligent disaster assistant, and automated PDF-printable formal assessment reports.

> ⚠️ **Student Hackathon Prototype Notice:**  
> All hydro-meteorological indicators, river levels, predictive risk classifications, and demonstration evacuation trajectories are generated via **simulated demonstration models**. This prototype is engineered for academic evaluation and does not constitute certified government forecasts. In live disasters, always obey official directives issued by the **National Disaster Management Authority (NDMA)**, **Central Water Commission (CWC)**, and **National Disaster Response Force (NDRF)**.

---

## 🏗️ Technical Architecture & Stack

```
DATHEON AI
├── frontend/ (React 18 + Vite + Tailwind CSS)
│   ├── Leaflet + OpenStreetMap (Dynamic Vector Markers & Hazard Polylines)
│   ├── Recharts (24h Telemetry Progression & Risk Distribution)
│   ├── Lucide React (Accessible Semantic Icons)
│   └── Axios (REST Client with Bearer Auth Interceptors)
│
└── backend/ (Python 3.12 + FastAPI + SQLite)
    ├── Multi-Criteria Decision Analysis (MCDA) Rule Engine (60% Weight)
    ├── Scikit-Learn Random Forest Regressor (40% Weight, 3k Synthetic Events)
    ├── SQLAlchemy ORM + SQLite Database
    ├── PyJWT Bearer Authentication & RBAC
    ├── Disaster Safety Knowledge Engine (NDMA, Sendai Framework, Red Cross)
    └── Pytest Automated Test Suite (12 / 12 Passing Tests)
```

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + Vite** | High-performance SPA with fast HMR |
| **Styling** | **Tailwind CSS** | Professional dark navy/cyan emergency theme |
| **Map Rendering** | **Leaflet + OpenStreetMap** | Interactive hazard markers, shelter pins, and routes |
| **Visualization** | **Recharts** | Real-time gauge telemetry & risk pie charts |
| **Backend API** | **Python FastAPI** | High-speed asynchronous REST endpoints |
| **Database** | **SQLite + SQLAlchemy** | Persistent locations, shelters, alerts, and audit logs |
| **ML Engine** | **Scikit-Learn + NumPy** | Random Forest model trained on synthetic catchment dataset |
| **Testing** | **Pytest** | Automated unit and integration test coverage |

---

## 🚀 Key Features

### 1. Main Dashboard (Feature 1)
- **Monitored Locations Counter:** Live status of regional river basin sectors.
- **Risk-Category Distribution:** Recharts interactive visual chart (Low, Moderate, High, Severe).
- **24-Hour Historical Indicator Trends:** Dual-axis line chart tracking precipitation (mm) against river levels relative to the danger mark.
- **Emergency Shelter Capacity & Occupancy Meter:** Live bed availability tracking.
- **Demonstration Alerts Feed:** Priority alerts tagged by severity with synthetic timestamps.
- **System Activity Audit Trail:** Real-time log of administrative and telemetry updates.

### 2. Interactive Disaster Map (Feature 2)
- **Brahmaputra Basin Flood Scenario:** Pins across Guwahati, Silchar, Kaziranga, Dibrugarh, Tezpur, Barpeta, Majuli, and Dispur.
- **Custom Dynamic SVG Pins:** Color-coded by risk category (Green, Amber, Orange, Red) with bounce animations on selection.
- **Hazard Filter Chips:** One-click filtering by hazard tier.
- **Selected Location Information Panel:** Granular indicators, distance to nearest shelters, and one-click routing shortcuts.

### 3. Transparent Risk Analysis (Feature 3)
- **User Indicator Inputs:** 24h rainfall (mm), river gauge level (m), 10-year historical flood frequency, terrain susceptibility (0-1), and population vulnerability (0-1).
- **Dual-Model Transparency:**
  - **Rule-Based MCDA (60%):** Explainable mathematical multi-criteria decision weights.
  - **Machine Learning (40%):** Trained `scikit-learn` Random Forest Regressor with feature importance weighting.
- **Factor Attribution Breakdown:** Raw values, units, normalized weights, and exact percentage contribution.
- **Data Quality Confidence Score:** Real-time sanity check for physical sensor plausibility.
- **NDMA & Sendai Framework Actions:** Actionable preparedness instructions tailored to the calculated tier.
- **Scenario Presets:** One-click load for Cloudburst, Waterlogging, Highland, and Embankment Breach.

### 4. Shelter Directory (Feature 4)
- **Synthetic High-Ground Refuges:** Multi-district emergency shelters with verified synthetic capacities.
- **Live Occupancy Progress Bars:** Clear capacity thresholds (Active, Near Capacity, Full).
- **Accessibility & Special Needs:** Details on wheelchair access, medical bay, senior access, and livestock enclosures.
- **Available Facilities Checklist:** RO clean water, diesel generators, food supplies, and first aid posts.
- **One-Click Evacuation Link:** "Select as Evacuation Destination" connects directly to the routing engine.

### 5. Route Demonstration (Feature 5)
- **Departure & Refuge Selection:** Choose any monitored catchment point and destination shelter.
- **Polyline Routing:** Integrates OpenStreetMap OSRM driving API with geodesic fail-safe waypoint interpolation.
- **Transit Estimation:** Total distance (km) and estimated transit time in adverse conditions.
- **Waypoint Turn Guidance:** Staged instructions noting elevation clearance and culvert caution.
- **Prominent Safety Warning:** Unmissable disclaimer preventing reliance during active emergencies.

### 6. AI Assistant (Feature 6)
- **Emergency Preparedness Chatbot:** Answers questions on flood readiness, 72-hour survival go-bags, indicator interpretation, and post-flood sanitation.
- **Authoritative Knowledge Base:** Grounded strictly in NDMA, Red Cross, and Sendai Framework guidelines.
- **Strict Guardrails:** Never fabricates official warnings or fake evacuation mandates.
- **Optional Gemini Integration:** Built-in adapter for live Google Gemini LLM when `GEMINI_API_KEY` is provided in `.env`.

### 7. Administrative Portal (Feature 7)
- **Secure Authentication:** JWT token-based login (`admin` / `datheon2026!`).
- **Location & Indicator Management:** Add new monitoring sectors or adjust rainfall/river gauge levels with automatic risk recalculation.
- **Shelter Record Management:** Register new shelters, update capacities, and manage facility lists.
- **Audit Logging:** Logs all administrative modifications for transparency.

### 8. Formal Report Generation (Feature 8)
- **Comprehensive Document:** Formats location coordinates, input telemetry, computed composite score, factor breakdown, designated shelters, and data provenance.
- **Print / PDF Export:** Clean CSS print styles for saving as PDF (`window.print()`).
- **JSON Data Export:** Download machine-readable `.json` evaluation data with a unique report ID.

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- **Python 3.10+** (Tested on Python 3.12.9)
- **Node.js 18+** (Node.js LTS v24+ recommended)
- **Git** (optional)

### 1. Clone & Environment Setup
```powershell
# Navigate to the project root
cd e:\hacketon

# Install Python backend dependencies
pip install -r requirements.txt
```

### 2. Frontend Dependencies
```powershell
cd e:\hacketon\frontend
npm install
```

### 3. Environment Configuration
A default `.env` is already configured in the repository root and `backend/.env`.
```env
PORT=8000
HOST=127.0.0.1
SECRET_KEY=datheon-super-secret-key-change-in-production-2026
ADMIN_USERNAME=admin
ADMIN_PASSWORD=datheon2026!
DATABASE_URL=sqlite:///./datheon.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Optional: Add Google Gemini API Key for live LLM inference in the AI Assistant
GEMINI_API_KEY=
```

---

## ▶️ Running the Application

### Start the Backend Server (Terminal 1)
```powershell
# From the project root:
python backend/run_backend.py
```
- Server starts at: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### Start the Frontend Dev Server (Terminal 2)
```powershell
# From the project root:
cd frontend
npm run dev
```
- Web Application opens at: `http://localhost:5173`

---

## 🧪 Automated Testing

DATHEON AI includes comprehensive test coverage for API endpoints, machine learning evaluation, and access controls.

To run the test suite:
```powershell
python -m pytest backend/tests -v
```
**Test Results:**
- `test_root_endpoint`: PASSED
- `test_health_check`: PASSED
- `test_dashboard_stats`: PASSED
- `test_dashboard_risk_distribution`: PASSED
- `test_dashboard_historical_trends`: PASSED
- `test_get_locations`: PASSED
- `test_get_location_details`: PASSED
- `test_risk_evaluation`: PASSED
- `test_shelters_directory`: PASSED
- `test_route_demonstration`: PASSED
- `test_chat_assistant`: PASSED
- `test_admin_auth_and_protected_endpoint`: PASSED
- **Total: 12 passed in < 8s**

---

## 📊 Features Status & Demonstration Transparency

| Feature | Operational Status | Data Nature | Implementation Notes |
| :--- | :--- | :--- | :--- |
| **Main Dashboard** | Fully Working | **Simulated** | Live Recharts graphs, telemetry counts, and alerts. |
| **Interactive Map** | Fully Working | **Simulated** | Leaflet OpenStreetMap with custom SVG markers and Assam coordinates. |
| **Risk Analysis** | Fully Working | **Simulated ML & Rule MCDA** | 60% explainable weighted formula + 40% scikit-learn Random Forest model. |
| **Shelter Directory** | Fully Working | **Synthetic Records** | District filters, live occupancy indicators, and accessibility specs. |
| **Route Demonstration** | Fully Working | **Demonstration Corridors** | OSRM routing service with geodesic fallback waypoints; strictly disclaimed. |
| **AI Assistant** | Fully Working | **Grounded Domain KB** | NDMA and Sendai Framework indexed guidelines with Gemini API fallback. |
| **Admin Panel** | Fully Working | **Live SQLite State** | JWT authentication (`admin` / `datheon2026!`), full CRUD, and audit trail. |
| **Report Generation** | Fully Working | **Live Document Generator** | Print-to-PDF and JSON download with unique report IDs. |

### Incomplete / Future Integrations
- **Real-Time Doppler Radar & Satellite Inundation APIs (e.g., Copernicus Sentinel-1, NASA GPM):** Currently represented using synthetic telemetry generators for reproducible hackathon evaluation.
- **Government Civil Defence SMS Broadcast Gateway:** Out of scope for academic prototype; simulated via in-app alerts feed.

---

## 🏆 How to Demonstrate to Hackathon Judges

1. **The Hook (Dashboard View):**
   - Open `http://localhost:5173`.
   - Point out the **Simulated Telemetry Engine** notice and explain the regional Brahmaputra basin context.
   - Show the **24-Hour Indicator Progression Chart** tracking rising river levels against rainfall.
2. **Interactive Spatial Assessment (Map View):**
   - Navigate to **Interactive Map**.
   - Filter by **Severe** and click on *Silchar Barak River Front*.
   - Point out the slide-out panel showing the 63.4 composite hazard score and the two nearest shelters.
   - Click **Demonstrate Evacuation Route** to seamlessly transition to Feature 5.
3. **Route Safety Disclaimers (Route Demo View):**
   - Emphasize the bold **Demonstration Trajectory Safety Notice**.
   - Review the calculated 2.03 km corridor, estimated transit duration, and elevated waypoint advice.
4. **Transparent Risk Engine (Risk Analysis View):**
   - Click on the **Risk Analysis** tab.
   - Click the preset **Flash Cloudburst Event**.
   - Show judges the side-by-side comparison of **Rule-Based MCDA (60%)** and **Scikit-Learn Random Forest (40%)**.
   - Highlight the **Factor Contribution Breakdown** table explaining why each indicator influenced the score.
5. **AI Assistant (AI Assistant View):**
   - Switch to the **AI Assistant** tab.
   - Click the prompt: *"🎒 What should be packed in a 72-hour flood emergency go-bag?"*
   - Note the verified citation of NDMA and Red Cross guidelines and the absence of fabricated official warnings.
6. **Administrative Governance (Admin Panel):**
   - Open **Admin Panel**, login with `admin` / `datheon2026!`.
   - Edit an existing location's rainfall indicator from 40mm to 160mm.
   - Demonstrate that the composite risk score immediately recalculates and records an audit log.
7. **The Deliverable (Formal Report Export):**
   - Click **Export Report** in the top navigation bar.
   - Show the generated formal report with report ID, metadata, factors, shelters, and NDMA instructions.
   - Click **Print / Save PDF** or **Download JSON** to show export capabilities.

---

## 📜 Ethical AI & Disclaimers

DATHEON AI is created in accordance with ethical AI guidelines for disaster response. The platform adheres to the following principles:
- **Never claim unvalidated predictions:** All risk levels are explicitly labeled as demonstration support metrics.
- **Never present routing as guaranteed safe:** Evacuation paths are marked with prominent warnings directing users to certified emergency services.
- **Preserve life safety precedence:** Civil defense orders always supersede algorithmic outputs.

---

*Built with ❤️ for **AI Manthan 2.0 — National Level Hackathon**.*

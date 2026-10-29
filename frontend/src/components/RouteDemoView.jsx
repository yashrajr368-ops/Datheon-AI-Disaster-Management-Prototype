import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Navigation,
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Home,
  ShieldAlert,
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { getLocations, getShelters, demonstrateRoute } from '../api';

const createOriginIcon = () =>
  L.divIcon({
    className: 'custom-origin-icon',
    html: `
      <div style="background-color: #10B981; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
        <span style="color: white; font-size: 12px; font-weight: bold;">S</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const createDestIcon = () =>
  L.divIcon({
    className: 'custom-dest-icon',
    html: `
      <div style="background-color: #0077B6; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
        <span style="color: white; font-size: 14px; font-weight: bold;">⌂</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

function RecenterMapOnRoute({ waypoints }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints && waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [waypoints, map]);
  return null;
}

export default function RouteDemoView({ initialOrigin, initialDestination }) {
  const [locations, setLocations] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [selectedOriginId, setSelectedOriginId] = useState('');
  const [selectedDestId, setSelectedDestId] = useState('');
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [locRes, shRes] = await Promise.all([getLocations(), getShelters()]);
        setLocations(locRes.data);
        setShelters(shRes.data);

        // Preselect origin and dest
        if (initialOrigin) {
          setSelectedOriginId(String(initialOrigin.id));
        } else if (locRes.data.length > 0) {
          setSelectedOriginId(String(locRes.data[0].id));
        }

        if (initialDestination) {
          setSelectedDestId(String(initialDestination.id));
        } else if (shRes.data.length > 0) {
          setSelectedDestId(String(shRes.data[0].id));
        }
      } catch (err) {
        console.error('Failed to load locations or shelters:', err);
      }
    }
    loadData();
  }, [initialOrigin, initialDestination]);

  const handleCalculateRoute = async () => {
    const origin = locations.find((l) => String(l.id) === String(selectedOriginId));
    const dest = shelters.find((s) => String(s.id) === String(selectedDestId));

    if (!origin || !dest) {
      setError('Please select both a starting location and an emergency shelter destination.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await demonstrateRoute({
        start_lat: origin.latitude,
        start_lng: origin.longitude,
        dest_lat: dest.latitude,
        dest_lng: dest.longitude,
        avoid_high_risk: true,
      });
      setRouteResult({
        ...res.data,
        origin,
        dest,
      });
    } catch (err) {
      console.error('Route calculation error:', err);
      setError('Failed to compute demonstration route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentOrigin = locations.find((l) => String(l.id) === String(selectedOriginId));
  const currentDest = shelters.find((s) => String(s.id) === String(selectedDestId));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-navy-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Demonstration Evacuation Corridor Routing
          <span className="text-xs bg-navy-800 text-flood-cyan border border-navy-700 px-2 py-0.5 rounded-full font-mono">
            Feature 5
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Simulate road trajectories from high-hazard sectors to designated emergency highland shelters.
        </p>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-200 space-y-1">
        <div className="flex items-center gap-2 font-bold text-red-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>IMPORTANT SAFETY DISCLAIMER — DEMONSTRATION TRAJECTORY ONLY</span>
        </div>
        <p className="text-slate-300 pl-6 leading-relaxed">
          This routing tool provides simulated visualization for academic demonstration at the <strong>AI Manthan 2.0 Hackathon</strong>.
          <strong className="text-red-300"> It does NOT guarantee route safety or road navigability during actual floods.</strong> Never attempt to cross flooded roadways, bridges, or culverts. Follow live evacuation directives issued by the NDRF, District Administration, and Civil Defence.
        </p>
      </div>

      {/* Origin & Destination Selector Bar */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-xl shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Starting Location */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> 1. Select Departure Point:
            </label>
            <select
              value={selectedOriginId}
              onChange={(e) => setSelectedOriginId(e.target.value)}
              className="w-full bg-navy-850 border border-navy-750 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-flood-blue"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.risk_category} Risk - Score {loc.risk_score})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Shelter */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-flood-cyan" /> 2. Select Destination Shelter:
            </label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full bg-navy-850 border border-navy-750 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-flood-blue"
            >
              {shelters.map((sh) => (
                <option key={sh.id} value={sh.id}>
                  {sh.name} ({sh.district} - {sh.capacity - sh.current_occupancy} beds available)
                </option>
              ))}
            </select>
          </div>

          {/* Calculate Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleCalculateRoute}
              disabled={loading}
              className="w-full py-2 px-3 bg-flood-blue hover:bg-flood-blue/90 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                'Calculating...'
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" /> Calculate Route
                </>
              )}
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* Route Display & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[500px]">
        {/* Leaflet Map with Route Polyline */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 rounded-xl overflow-hidden shadow-lg relative min-h-[420px]">
          <MapContainer
            center={[26.2006, 92.9376]}
            zoom={8}
            scrollWheelZoom={true}
            className="w-full h-full min-h-[420px]"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Recenter Map on calculated route waypoints */}
            {routeResult && <RecenterMapOnRoute waypoints={routeResult.waypoints} />}

            {/* Departure Marker */}
            {currentOrigin && (
              <Marker
                position={[currentOrigin.latitude, currentOrigin.longitude]}
                icon={createOriginIcon()}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>Origin:</strong> {currentOrigin.name}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Destination Marker */}
            {currentDest && (
              <Marker
                position={[currentDest.latitude, currentDest.longitude]}
                icon={createDestIcon()}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>Refuge:</strong> {currentDest.name}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Polyline Route */}
            {routeResult?.waypoints && (
              <Polyline
                positions={routeResult.waypoints}
                color="#00B4D8"
                weight={5}
                opacity={0.85}
                dashArray={routeResult.is_demonstration ? '8, 8' : undefined}
              />
            )}
          </MapContainer>

          {/* Polyline Legend Overlay */}
          <div className="absolute top-3 right-3 z-[1000] bg-navy-950/90 backdrop-blur border border-navy-750 px-3 py-1.5 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="w-3 h-1 bg-flood-cyan inline-block"></span>
              <span>Demonstration Corridor</span>
            </div>
          </div>
        </div>

        {/* Route Steps & Hazard Analysis Details */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-lg flex flex-col justify-between space-y-4">
          {routeResult ? (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="p-3.5 bg-navy-850 rounded-lg border border-navy-750 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Transit Estimation
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-white font-mono">
                      {routeResult.total_distance_km} <span className="text-xs text-slate-400 font-sans">km</span>
                    </div>
                    <div className="text-xs text-slate-400">Total Corridor Length</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-flood-cyan font-mono">
                      ~{routeResult.estimated_time_min} <span className="text-xs text-slate-400 font-sans">mins</span>
                    </div>
                    <div className="text-xs text-slate-400">Est. Transit Time</div>
                  </div>
                </div>
              </div>

              {/* Hazard Analysis Box */}
              <div className="p-3 bg-navy-850 rounded-lg border border-navy-750 text-xs space-y-1.5">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-flood-cyan" /> Corridor Safety Assessment
                </div>
                <div className="text-slate-300 text-[11px] space-y-1">
                  <div>Routing Model: <strong className="text-white">{routeResult.hazard_analysis.routing_engine}</strong></div>
                  <div>Elevation Assessment: <span className="text-emerald-400">{routeResult.hazard_analysis.elevation_safety_score}</span></div>
                  <div>Inundation Exposure: <span className="text-amber-400">{routeResult.hazard_analysis.waterlogging_exposure}</span></div>
                  <div className="pt-1 text-[10px] text-slate-400 border-t border-navy-800">
                    {routeResult.hazard_analysis.recommendation}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Directions */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-flood-cyan" /> Turn-by-Turn Waypoint Guidance
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {routeResult.steps.map((st, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-navy-850 border border-navy-750 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-white">Stage {idx + 1}</span>
                        <span className="font-mono text-slate-400">{st.distance_km} km ({st.duration_min} min)</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{st.instruction}</p>
                      <div className="text-[10px] text-slate-400">
                        Hazard Level: <span className="text-slate-300">{st.hazard_level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-navy-800 rounded-full text-slate-400">
                <Navigation className="w-8 h-8 text-flood-cyan" />
              </div>
              <h3 className="text-sm font-semibold text-white">Select Origin & Destination Above</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Pick a monitored location and a highland emergency refuge shelter, then click <strong>Calculate Route</strong> to preview the corridor on the map.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

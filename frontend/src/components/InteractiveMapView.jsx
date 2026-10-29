import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Shield,
  Home,
  Navigation,
  FileText,
  AlertTriangle,
  Info,
  ChevronRight,
  Droplets,
  Layers,
  Activity
} from 'lucide-react';
import { getLocations, getLocationDetails, getShelters } from '../api';

// Create custom SVG Leaflet marker icons based on risk category
const createRiskIcon = (category, isSelected = false) => {
  let color = '#10B981'; // Low
  if (category === 'Moderate') color = '#F59E0B';
  if (category === 'High') color = '#F97316';
  if (category === 'Severe') color = '#EF4444';

  const size = isSelected ? 36 : 28;
  const pulse = isSelected ? 'border-2 border-white animate-bounce' : '';

  const html = `
    <div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      border: 2px solid #FFFFFF;
    " class="${pulse}">
      <div style="
        width: 10px;
        height: 10px;
        background: #FFFFFF;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-risk-pin',
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const createShelterIcon = () => {
  const html = `
    <div style="
      background-color: #0077B6;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.4);
      border: 2px solid #90E0EF;
    ">
      <span style="color: white; font-size: 14px; font-weight: bold;">⌂</span>
    </div>
  `;
  return L.divIcon({
    className: 'custom-shelter-pin',
    html: html,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -15],
  });
};

// Map recentering helper component
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 9, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMapView({
  selectedLocation,
  setSelectedLocation,
  onNavigateToRoute,
  onOpenReportModal
}) {
  const [locations, setLocations] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [detailedLocation, setDetailedLocation] = useState(null);
  const [showSheltersOnMap, setShowSheltersOnMap] = useState(true);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([26.2006, 92.9376]); // Assam Region center

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [locRes, shRes] = await Promise.all([
          getLocations(activeFilter),
          getShelters()
        ]);
        setLocations(locRes.data);
        setShelters(shRes.data);
      } catch (err) {
        console.error('Failed to load map data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeFilter]);

  // When selectedLocation changes, fetch full details & update map center
  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.latitude, selectedLocation.longitude]);
      getLocationDetails(selectedLocation.id)
        .then((res) => setDetailedLocation(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedLocation]);

  const handleMarkerClick = (loc) => {
    setSelectedLocation(loc);
  };

  const getSeverityBadge = (category) => {
    switch (category) {
      case 'Severe':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-navy-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Interactive Flood Scenario Map
            <span className="text-xs bg-navy-800 text-flood-cyan border border-navy-700 px-2 py-0.5 rounded-full font-mono">
              Brahmaputra River Basin
            </span>
          </h1>
          <p className="text-slate-400 text-xs">
            Filter by hazard tier, explore hydrological indicators, and locate emergency highland refuges.
          </p>
        </div>

        {/* Risk Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          {['All', 'Severe', 'High', 'Moderate', 'Low'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                activeFilter === cat
                  ? 'bg-flood-blue text-white border-flood-blue shadow'
                  : 'bg-navy-850 text-slate-300 border-navy-700 hover:bg-navy-800'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowSheltersOnMap(!showSheltersOnMap)}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ml-1 flex items-center gap-1 ${
              showSheltersOnMap
                ? 'bg-navy-800 text-flood-cyan border-flood-cyan/50'
                : 'bg-navy-850 text-slate-400 border-navy-700'
            }`}
          >
            <Home className="w-3 h-3" /> Shelters: {showSheltersOnMap ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Main Map + Side Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        {/* Leaflet Map Box */}
        <div className="lg:col-span-8 bg-navy-900 border border-navy-750 rounded-xl overflow-hidden shadow-lg relative flex flex-col min-h-[460px] lg:min-h-full">
          {/* Map Simulation Notice Overlay */}
          <div className="absolute top-3 left-12 z-[1000] bg-navy-950/85 backdrop-blur border border-navy-700/80 px-3 py-1.5 rounded-lg shadow text-xs flex items-center gap-2 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Simulated Flood Scenario Layer</span>
          </div>

          <MapContainer
            center={mapCenter}
            zoom={8}
            scrollWheelZoom={true}
            className="w-full h-full min-h-[460px] z-10"
          >
            <RecenterMap center={mapCenter} zoom={9} />
            {/* OpenStreetMap Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Location Risk Markers */}
            {locations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <Marker
                  key={`loc-${loc.id}`}
                  position={[loc.latitude, loc.longitude]}
                  icon={createRiskIcon(loc.risk_category, isSelected)}
                  eventHandlers={{
                    click: () => handleMarkerClick(loc),
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1.5">
                      <div className="font-bold text-white text-sm">{loc.name}</div>
                      <div className="text-slate-400">{loc.district}, {loc.state}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getSeverityBadge(loc.risk_category)}`}>
                          {loc.risk_category} Risk ({loc.risk_score})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 grid grid-cols-2 gap-1 pt-1 border-t border-navy-800">
                        <div>Rainfall: <strong>{loc.rainfall_mm} mm</strong></div>
                        <div>River Rise: <strong>{loc.river_level_m} m</strong></div>
                      </div>
                      <button
                        onClick={() => handleMarkerClick(loc)}
                        className="w-full mt-2 py-1 px-2 bg-flood-blue text-white rounded text-[11px] font-medium"
                      >
                        Inspect Details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Shelter Markers */}
            {showSheltersOnMap &&
              shelters.map((sh) => (
                <Marker
                  key={`shelter-${sh.id}`}
                  position={[sh.latitude, sh.longitude]}
                  icon={createShelterIcon()}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-flood-cyan">⌂ {sh.name}</div>
                      <div className="text-slate-400">{sh.district}</div>
                      <div className="text-[11px] text-slate-300">
                        Occupancy: <strong>{sh.current_occupancy} / {sh.capacity} beds</strong>
                      </div>
                      <div className="text-[10px] text-emerald-400">{sh.accessibility_info}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-navy-950/90 backdrop-blur border border-navy-750 p-2.5 rounded-lg shadow-lg text-[11px] space-y-1.5">
            <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-flood-cyan" /> Map Legend
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Severe Risk (&gt;75)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High Risk (55-74)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate (30-54)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low Risk (&lt;30)
              </div>
              <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-navy-800">
                <span className="w-2.5 h-2.5 bg-flood-blue text-[9px] flex items-center justify-center rounded text-white">⌂</span>
                <span>Emergency Shelter Refuge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected-Location Information Panel */}
        <div className="lg:col-span-4 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-lg flex flex-col justify-between space-y-4">
          {selectedLocation ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-3 border-b border-navy-800">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(selectedLocation.risk_category)}`}>
                    {selectedLocation.risk_category} Risk
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID #{selectedLocation.id} • {selectedLocation.state}
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1.5">{selectedLocation.name}</h2>
                <p className="text-xs text-slate-400">
                  {selectedLocation.district} District • {selectedLocation.latitude.toFixed(4)}°N, {selectedLocation.longitude.toFixed(4)}°E
                </p>
              </div>

              {/* Composite Score Meter */}
              <div className="p-3.5 bg-navy-850 rounded-lg border border-navy-750 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Composite Disaster Risk Score</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {selectedLocation.risk_score} <span className="text-xs text-slate-400">/ 100</span>
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      selectedLocation.risk_category === 'Severe'
                        ? 'bg-red-500'
                        : selectedLocation.risk_category === 'High'
                        ? 'bg-orange-500'
                        : selectedLocation.risk_category === 'Moderate'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, selectedLocation.risk_score)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Method: MCDA 60% + RF ML 40%</span>
                  <span className="text-flood-cyan">Data Quality: 98%</span>
                </div>
              </div>

              {/* Physical Indicators Grid */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Monitored Catchment Indicators
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-navy-850 rounded-lg border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">24h Rainfall</span>
                    <span className="font-bold text-white font-mono text-sm">{selectedLocation.rainfall_mm} mm</span>
                  </div>
                  <div className="p-2.5 bg-navy-850 rounded-lg border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">River Gauge Level</span>
                    <span className={`font-bold font-mono text-sm ${selectedLocation.river_level_m > 2 ? 'text-red-400' : 'text-white'}`}>
                      {selectedLocation.river_level_m > 0 ? `+${selectedLocation.river_level_m}` : selectedLocation.river_level_m} m
                    </span>
                  </div>
                  <div className="p-2.5 bg-navy-850 rounded-lg border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">Terrain Susceptibility</span>
                    <span className="font-bold text-white font-mono">{selectedLocation.terrain_susceptibility} index</span>
                  </div>
                  <div className="p-2.5 bg-navy-850 rounded-lg border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">Demographic Vulnerability</span>
                    <span className="font-bold text-white font-mono">{selectedLocation.population_vulnerability} index</span>
                  </div>
                </div>
              </div>

              {/* Nearest Shelters */}
              {detailedLocation?.nearest_shelters && detailedLocation.nearest_shelters.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Nearest Emergency Shelters</span>
                    <span className="text-[10px] text-flood-cyan">Proximity</span>
                  </h3>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {detailedLocation.nearest_shelters.slice(0, 2).map((sh) => (
                      <div key={sh.id} className="p-2 rounded-lg bg-navy-850 border border-navy-750 text-xs flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white line-clamp-1">⌂ {sh.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Available: {sh.available_capacity} / {sh.capacity} beds
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-xs font-bold text-flood-cyan">{sh.distance_km} km</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-navy-800">
                <button
                  onClick={() => onNavigateToRoute(selectedLocation)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-flood-blue hover:bg-flood-blue/90 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  <Navigation className="w-3.5 h-3.5" /> Demonstrate Evacuation Route
                </button>
                <button
                  onClick={() => onOpenReportModal(selectedLocation)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700 rounded-lg text-xs font-medium transition"
                >
                  <FileText className="w-3.5 h-3.5 text-flood-cyan" /> Generate Assessment Report
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-navy-800 rounded-full text-slate-400">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-slate-300 text-sm font-semibold">Select a Location Marker on the Map</p>
              <p className="text-slate-400 text-xs max-w-xs">
                Click any colored hazard marker or choose from the list to view granular hydrological indicators and nearest shelter refuges.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

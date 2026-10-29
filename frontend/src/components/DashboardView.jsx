import React, { useEffect, useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Home,
  Activity,
  TrendingUp,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  ExternalLink,
  Flame,
  Radio
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  getDashboardStats,
  getRiskDistribution,
  getHistoricalTrends,
  getDashboardAlerts,
  getRecentActivity,
  getLocations
} from '../api';

export default function DashboardView({ onSelectLocation, onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, distRes, trendRes, alertsRes, actRes, locRes] = await Promise.all([
          getDashboardStats(),
          getRiskDistribution(),
          getHistoricalTrends(),
          getDashboardAlerts(),
          getRecentActivity(),
          getLocations()
        ]);
        setStats(statsRes.data);
        setDistribution(distRes.data);
        setTrends(trendRes.data.data || []);
        setAlerts(alertsRes.data || []);
        setActivity(actRes.data || []);
        setLocations(locRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-flood-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Loading Real-Time Disaster Telemetry & Indicators...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Simulation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Disaster Risk Decision-Support Dashboard
            <span className="text-xs bg-navy-800 text-flood-cyan border border-navy-700 px-2 py-0.5 rounded-full font-mono">
              Brahmaputra Basin Demonstration
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Aggregated hydro-meteorological indicators, hazard exposure, and shelter availability.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-850 border border-navy-700 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Simulated Telemetry Source: <strong>CWC/IMD Synthetic Model</strong></span>
          </div>
        </div>
      </div>

      {/* Primary KPI Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monitored Locations */}
        <div className="bg-navy-900 border border-navy-750 p-4 rounded-xl shadow-md hover:border-navy-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Monitored Locations</span>
            <div className="p-2 rounded-lg bg-flood-blue/20 text-flood-cyan">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {stats?.total_monitored_locations || 0}
            </span>
            <span className="text-xs text-slate-400">active sectors</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Regional river catchment</span>
            <span className="text-emerald-400 font-medium">100% telemetry online</span>
          </div>
        </div>

        {/* Critical Vulnerability Zones */}
        <div className="bg-navy-900 border border-navy-750 p-4 rounded-xl shadow-md hover:border-navy-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Critical / Severe Risk</span>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-400 font-mono">
              {stats?.critical_vulnerable_count || 0}
            </span>
            <span className="text-xs text-slate-400">of {stats?.total_monitored_locations} locations</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{stats?.severe_risk_count || 0} Severe • {stats?.high_risk_count || 0} High</span>
            <span className="text-amber-400 font-medium">Action Required</span>
          </div>
        </div>

        {/* Basin Average Risk Score */}
        <div className="bg-navy-900 border border-navy-750 p-4 rounded-xl shadow-md hover:border-navy-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Basin Avg Risk Index</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300 font-mono">
              {stats?.average_basin_risk_score || 0}
            </span>
            <span className="text-xs text-slate-400">/ 100 Index</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>MCDA + ML Hybrid</span>
            <span className="text-slate-400">Simulated 24-hr aggregate</span>
          </div>
        </div>

        {/* Shelter Capacity & Occupancy */}
        <div className="bg-navy-900 border border-navy-750 p-4 rounded-xl shadow-md hover:border-navy-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Shelter Capacity</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {stats?.total_shelter_occupied || 0}
            </span>
            <span className="text-xs text-slate-400">/ {stats?.total_shelter_capacity || 0} beds</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{stats?.total_shelters} Registered Shelters</span>
            <span className="text-emerald-400 font-medium font-mono">
              {stats?.shelter_occupancy_rate_percent}% Occupied
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts (Risk Distribution & 24h Trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Category Distribution */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Risk-Category Distribution</h2>
              <p className="text-[11px] text-slate-400">Breakdown of monitored demonstration locations</p>
            </div>
            <span className="text-[10px] bg-navy-800 text-slate-400 px-2 py-0.5 rounded border border-navy-700">
              Simulated
            </span>
          </div>

          <div className="h-56 mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111C38',
                    borderColor: '#263457',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono text-white">{stats?.total_monitored_locations}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Sectors</span>
            </div>
          </div>

          {/* Legend Chips */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-navy-800">
            {distribution.map((item) => (
              <div key={item.category} className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-navy-850 border border-navy-750">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  <span className="text-slate-300 font-medium">{item.category}</span>
                </div>
                <span className="font-mono font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Historical Indicator Trends */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-sm font-semibold text-white">24-Hour Indicator Progression</h2>
              <p className="text-[11px] text-slate-400">Rainfall (mm) vs. River Gauge Level above Danger Mark (m)</p>
            </div>
            <span className="text-[10px] bg-navy-800 text-slate-400 px-2 py-0.5 rounded border border-navy-700">
              Synthetic Time-Series
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C2541" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#48CAE4" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111C38',
                    borderColor: '#263457',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rainfall_mm"
                  name="Rainfall (mm)"
                  stroke="#48CAE4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#48CAE4' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="river_level_m"
                  name="River Gauge Level (m)"
                  stroke="#F59E0B"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#F59E0B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-navy-850 border border-navy-750 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Danger Threshold: <strong>+2.0m river rise</strong></span>
            <span className="text-amber-400">Noticeable surge observed between 15:00 and 21:00</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Demonstration Alerts & Monitored Locations Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Demonstration Alerts Feed */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Demonstration Alerts Feed</h2>
            </div>
            <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold">
              {alerts.length} Active (Simulated)
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="p-3.5 rounded-lg bg-navy-850 border border-navy-750 hover:border-navy-600 transition space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadge(al.severity)}`}>
                    {al.severity}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(al.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white">{al.title}</h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">{al.description}</p>
                <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between border-t border-navy-800">
                  <span>Sector: <strong className="text-slate-300">{al.location_name}</strong></span>
                  <span className="text-slate-400">Feed: {al.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monitored Locations Quick Assessment Table */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div>
              <h2 className="text-sm font-semibold text-white">Monitored Locations & Risk Indicators</h2>
              <p className="text-[11px] text-slate-400">Live decision support metrics across demonstration catchment</p>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              className="text-xs text-flood-cyan hover:underline flex items-center gap-1 font-medium"
            >
              Open Interactive Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-850 text-slate-400 font-semibold uppercase tracking-wider border-b border-navy-750">
                <tr>
                  <th className="py-2.5 px-3">Location / District</th>
                  <th className="py-2.5 px-2">24h Rain</th>
                  <th className="py-2.5 px-2">River Gauge</th>
                  <th className="py-2.5 px-2">Risk Index</th>
                  <th className="py-2.5 px-2">Category</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {locations.slice(0, 6).map((loc) => (
                  <tr key={loc.id} className="hover:bg-navy-850/60 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.district}, {loc.state}</div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-slate-300">
                      {loc.rainfall_mm} mm
                    </td>
                    <td className="py-2.5 px-2 font-mono">
                      <span className={loc.river_level_m > 2.0 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                        {loc.river_level_m > 0 ? `+${loc.river_level_m}` : loc.river_level_m} m
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono font-bold text-white">
                      {loc.risk_score}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(loc.risk_category)}`}>
                        {loc.risk_category}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => {
                          onSelectLocation(loc);
                          onNavigateTab('map');
                        }}
                        className="text-[11px] px-2 py-1 bg-navy-800 hover:bg-navy-700 text-flood-cyan rounded border border-navy-700 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-navy-850 rounded-lg border border-navy-750 flex items-center justify-between text-xs">
            <span className="text-slate-400">Looking for custom risk evaluation with scenario testing?</span>
            <button
              onClick={() => onNavigateTab('risk')}
              className="px-3 py-1 bg-flood-blue hover:bg-flood-blue/80 text-white rounded font-medium transition"
            >
              Run Risk Analysis Tool →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-flood-cyan" />
            <h2 className="text-sm font-semibold text-white">System Audit & Telemetry Activity Feed</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Simulated Audit Trail</span>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {activity.slice(0, 4).map((item) => (
            <div key={item.id} className="p-3 rounded-lg bg-navy-850 border border-navy-750 text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono bg-navy-800 px-1.5 py-0.5 rounded text-flood-cyan">{item.action}</span>
                <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">{item.details}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Triggered by: <span className="text-slate-300">{item.user_role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

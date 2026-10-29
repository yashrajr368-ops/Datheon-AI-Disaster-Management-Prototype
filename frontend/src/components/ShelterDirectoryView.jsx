import React, { useState, useEffect } from 'react';
import {
  Home,
  Search,
  Filter,
  Users,
  CheckCircle,
  AlertCircle,
  Navigation,
  Phone,
  Shield,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { getShelters } from '../api';

export default function ShelterDirectoryView({ onSelectShelterForRoute }) {
  const [shelters, setShelters] = useState([]);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShelters() {
      try {
        setLoading(true);
        const res = await getShelters(districtFilter, statusFilter, search);
        setShelters(res.data);
      } catch (err) {
        console.error('Failed to load shelters:', err);
      } finally {
        setLoading(false);
      }
    }
    loadShelters();
  }, [districtFilter, statusFilter, search]);

  const districts = ['All', 'Kamrup Metropolitan', 'Cachar', 'Golaghat', 'Dibrugarh', 'Sonitpur', 'Majuli'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Full':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Near Capacity':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-navy-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Designated Emergency Shelter Directory
            <span className="text-xs bg-navy-800 text-flood-cyan border border-navy-700 px-2 py-0.5 rounded-full font-mono">
              Synthetic Records
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Demonstration repository of high-ground refuge centers, accessibility facilities, and staging capacities.
          </p>
        </div>
        <div className="text-xs bg-navy-850 border border-navy-750 px-3 py-1.5 rounded-lg text-slate-300 self-start sm:self-auto">
          Notice: <strong className="text-amber-300">Simulated Capacity Telemetry</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-navy-900 border border-navy-750 p-4 rounded-xl shadow-md space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search shelters by name, facilities, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy-850 border border-navy-700 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-flood-blue"
            />
          </div>

          {/* District Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-navy-850 border border-navy-700 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-flood-blue"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-navy-850 border border-navy-700 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-flood-blue"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active (Available)</option>
              <option value="Near Capacity">Near Capacity</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shelters Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-flood-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : shelters.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          No shelter records found matching the chosen criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shelters.map((sh) => {
            const occupancyPct = Math.round((sh.current_occupancy / sh.capacity) * 100);
            const available = Math.max(0, sh.capacity - sh.current_occupancy);

            return (
              <div
                key={sh.id}
                className="bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-lg hover:border-navy-600 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top line: District & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-flood-cyan bg-navy-800 px-2 py-0.5 rounded border border-navy-700">
                      {sh.district}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${getStatusBadge(sh.status)}`}>
                      {sh.status}
                    </span>
                  </div>

                  {/* Name and Address */}
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-start gap-1.5">
                      <Home className="w-4 h-4 text-flood-blue shrink-0 mt-0.5" />
                      <span>{sh.name}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">{sh.address}</p>
                  </div>

                  {/* Occupancy Indicator Bar */}
                  <div className="p-3 bg-navy-850 rounded-lg border border-navy-750 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Demonstration Occupancy</span>
                      <span className="font-mono font-bold text-white">
                        {sh.current_occupancy} <span className="text-slate-400">/ {sh.capacity} beds</span>
                      </span>
                    </div>
                    <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          occupancyPct >= 90
                            ? 'bg-red-500'
                            : occupancyPct >= 65
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Available: <strong className="text-emerald-400 font-mono">{available}</strong></span>
                      <span className="font-mono">{occupancyPct}% full</span>
                    </div>
                  </div>

                  {/* Accessibility Features */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Accessibility & Special Needs:
                    </span>
                    <p className="text-xs text-slate-300 bg-navy-850/60 p-2 rounded border border-navy-800">
                      {sh.accessibility_info}
                    </p>
                  </div>

                  {/* Facilities */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Available Emergency Facilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sh.facilities.split(',').map((fac, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-navy-800 text-slate-300 border border-navy-700 px-2 py-0.5 rounded-full"
                        >
                          {fac.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-navy-800 flex items-center justify-between">
                    <span>Officer: <strong className="text-slate-300">{sh.contact_person}</strong></span>
                    <span className="font-mono text-flood-cyan flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {sh.contact_phone}
                    </span>
                  </div>
                </div>

                {/* Route Action Button */}
                <button
                  onClick={() => onSelectShelterForRoute(sh)}
                  className="w-full py-2 px-3 bg-navy-800 hover:bg-flood-blue text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-navy-700 hover:border-flood-blue transition flex items-center justify-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5 text-flood-cyan" /> Select as Evacuation Destination
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

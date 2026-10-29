import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  Home,
  MapPin,
  Save,
  LogOut
} from 'lucide-react';
import {
  loginAdmin,
  getAdminMe,
  getAdminLogs,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getShelters,
  createShelter,
  updateShelter,
  deleteShelter
} from '../api';

export default function AdminPanelView({ isAdminLoggedIn, setIsAdminLoggedIn }) {
  const [adminTab, setAdminTab] = useState('locations'); // 'locations', 'shelters', 'logs'
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('datheon2026!');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Data states
  const [locations, setLocations] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // Location Form
  const [newLoc, setNewLoc] = useState({
    name: '',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    latitude: 26.15,
    longitude: 91.75,
    rainfall_mm: 50.0,
    river_level_m: 1.0,
    historical_flood_events: 3,
    terrain_susceptibility: 0.5,
    population_vulnerability: 0.5,
  });

  // Edit Location Modal/State
  const [editingLoc, setEditingLoc] = useState(null);

  // Shelter Form
  const [newShelter, setNewShelter] = useState({
    name: '',
    district: 'Kamrup Metropolitan',
    address: '',
    latitude: 26.16,
    longitude: 91.76,
    capacity: 500,
    current_occupancy: 50,
    status: 'Active',
    accessibility_info: 'Wheelchair Ramp, Ground-Floor Clinic',
    facilities: 'Clean Water, Backup Generator, First Aid Post',
    contact_person: 'District Relief Officer',
    contact_phone: '+91 361-2234000',
  });

  // Load Data
  const loadAdminData = async () => {
    try {
      const [locRes, shRes, logsRes] = await Promise.all([
        getLocations(),
        getShelters(),
        getAdminLogs(),
      ]);
      setLocations(locRes.data);
      setShelters(shRes.data);
      setAuditLogs(logsRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
    }
  }, [isAdminLoggedIn]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await loginAdmin(username, password);
      localStorage.setItem('datheon_admin_token', res.data.access_token);
      setIsAdminLoggedIn(true);
      setStatusMsg({ text: 'Authentication successful. Admin session active.', type: 'success' });
      loadAdminData();
    } catch (err) {
      setAuthError('Invalid credentials. Default: admin / datheon2026!');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('datheon_admin_token');
    setIsAdminLoggedIn(false);
    setStatusMsg({ text: 'Admin session terminated.', type: 'info' });
  };

  // Create Location
  const handleCreateLocation = async (e) => {
    e.preventDefault();
    try {
      await createLocation(newLoc);
      setStatusMsg({ text: `Location '${newLoc.name}' added successfully!`, type: 'success' });
      setNewLoc({
        name: '',
        district: 'Kamrup Metropolitan',
        state: 'Assam',
        latitude: 26.15,
        longitude: 91.75,
        rainfall_mm: 50.0,
        river_level_m: 1.0,
        historical_flood_events: 3,
        terrain_susceptibility: 0.5,
        population_vulnerability: 0.5,
      });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.detail || 'Failed to create location', type: 'error' });
    }
  };

  // Update Location
  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    if (!editingLoc) return;
    try {
      await updateLocation(editingLoc.id, editingLoc);
      setStatusMsg({ text: `Location '${editingLoc.name}' updated!`, type: 'success' });
      setEditingLoc(null);
      loadAdminData();
    } catch (err) {
      setStatusMsg({ text: 'Failed to update location indicators', type: 'error' });
    }
  };

  // Delete Location
  const handleDeleteLocation = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}'?`)) return;
    try {
      await deleteLocation(id);
      setStatusMsg({ text: `Location '${name}' deleted!`, type: 'success' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ text: 'Failed to delete location', type: 'error' });
    }
  };

  // Create Shelter
  const handleCreateShelter = async (e) => {
    e.preventDefault();
    try {
      await createShelter(newShelter);
      setStatusMsg({ text: `Shelter '${newShelter.name}' registered!`, type: 'success' });
      setNewShelter({
        name: '',
        district: 'Kamrup Metropolitan',
        address: '',
        latitude: 26.16,
        longitude: 91.76,
        capacity: 500,
        current_occupancy: 50,
        status: 'Active',
        accessibility_info: 'Wheelchair Ramp, Ground-Floor Clinic',
        facilities: 'Clean Water, Backup Generator, First Aid Post',
        contact_person: 'District Relief Officer',
        contact_phone: '+91 361-2234000',
      });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ text: 'Failed to create shelter', type: 'error' });
    }
  };

  // Delete Shelter
  const handleDeleteShelter = async (id, name) => {
    if (!window.confirm(`Delete shelter '${name}'?`)) return;
    try {
      await deleteShelter(id);
      setStatusMsg({ text: `Shelter '${name}' deleted!`, type: 'success' });
      loadAdminData();
    } catch (err) {
      setStatusMsg({ text: 'Failed to delete shelter', type: 'error' });
    }
  };

  // If NOT Logged In: Show Professional Login Portal
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 bg-navy-900 border border-navy-750 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-flood-blue/20 text-flood-cyan rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Portal</h2>
          <p className="text-slate-400 text-xs">
            Authenticate to modify monitored indicators, register emergency shelters, and view audit trails.
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-navy-850 border border-navy-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-flood-blue font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-850 border border-navy-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-flood-blue font-mono"
              required
            />
          </div>

          <div className="p-2.5 bg-navy-850 rounded-lg border border-navy-750 text-[11px] text-slate-400">
            Hackathon Demo Credentials: <strong className="text-flood-cyan font-mono">admin</strong> / <strong className="text-flood-cyan font-mono">datheon2026!</strong>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2.5 px-4 bg-flood-blue hover:bg-flood-blue/90 text-white rounded-lg font-semibold text-xs transition shadow-lg shadow-flood-blue/20"
          >
            {authLoading ? 'Verifying Session...' : 'Authenticate & Unlock Panel'}
          </button>
        </form>
      </div>
    );
  }

  // Logged-in Admin View
  return (
    <div className="space-y-6">
      {/* Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-flood-cyan" />
            Authorized Disaster Administration Panel
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              Authenticated
            </span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage catchment sector telemetry, adjust simulated rainfall & river levels, configure emergency shelters, and review system logs.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 border border-navy-700 text-xs font-medium transition self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" /> End Admin Session
        </button>
      </div>

      {/* Feedback banner */}
      {statusMsg.text && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between gap-2 ${
            statusMsg.type === 'error'
              ? 'bg-red-500/10 border border-red-500/30 text-red-300'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ text: '', type: '' })} className="text-xs opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex space-x-2 border-b border-navy-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setAdminTab('locations')}
          className={`px-3 py-1.5 rounded-lg transition ${
            adminTab === 'locations' ? 'bg-flood-blue text-white' : 'text-slate-400 hover:text-white bg-navy-850'
          }`}
        >
          Manage Locations & Indicators ({locations.length})
        </button>
        <button
          onClick={() => setAdminTab('shelters')}
          className={`px-3 py-1.5 rounded-lg transition ${
            adminTab === 'shelters' ? 'bg-flood-blue text-white' : 'text-slate-400 hover:text-white bg-navy-850'
          }`}
        >
          Manage Emergency Shelters ({shelters.length})
        </button>
        <button
          onClick={() => setAdminTab('logs')}
          className={`px-3 py-1.5 rounded-lg transition ${
            adminTab === 'logs' ? 'bg-flood-blue text-white' : 'text-slate-400 hover:text-white bg-navy-850'
          }`}
        >
          System Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: LOCATIONS */}
      {adminTab === 'locations' && (
        <div className="space-y-6">
          {/* Add New Location Form */}
          <div className="bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-flood-cyan" />
              <h2 className="text-sm font-semibold text-white">Add New Monitored Catchment Location</h2>
            </div>
            <form onSubmit={handleCreateLocation} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhubri South Ghat"
                  value={newLoc.name}
                  onChange={(e) => setNewLoc({ ...newLoc, name: e.target.value })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">District</label>
                <input
                  type="text"
                  required
                  value={newLoc.district}
                  onChange={(e) => setNewLoc({ ...newLoc, district: e.target.value })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={newLoc.latitude}
                  onChange={(e) => setNewLoc({ ...newLoc, latitude: parseFloat(e.target.value) })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={newLoc.longitude}
                  onChange={(e) => setNewLoc({ ...newLoc, longitude: parseFloat(e.target.value) })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">24h Rain (mm)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={newLoc.rainfall_mm}
                  onChange={(e) => setNewLoc({ ...newLoc, rainfall_mm: parseFloat(e.target.value) })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">River Rise (m)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newLoc.river_level_m}
                  onChange={(e) => setNewLoc({ ...newLoc, river_level_m: parseFloat(e.target.value) })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Terrain Vulnerability (0-1)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  required
                  value={newLoc.terrain_susceptibility}
                  onChange={(e) => setNewLoc({ ...newLoc, terrain_susceptibility: parseFloat(e.target.value) })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-flood-blue hover:bg-flood-blue/90 text-white rounded font-semibold transition"
                >
                  Save New Location
                </button>
              </div>
            </form>
          </div>

          {/* Locations Table */}
          <div className="bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md space-y-3">
            <h2 className="text-sm font-semibold text-white">Existing Catchment Sectors & Indicators</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-850 text-slate-400 uppercase tracking-wider border-b border-navy-750">
                  <tr>
                    <th className="py-2.5 px-3">Name / District</th>
                    <th className="py-2.5 px-2">Rainfall</th>
                    <th className="py-2.5 px-2">River Rise</th>
                    <th className="py-2.5 px-2">Risk Score</th>
                    <th className="py-2.5 px-2">Category</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {locations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-navy-850/50">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-white">{loc.name}</div>
                        <div className="text-[10px] text-slate-400">{loc.district}</div>
                      </td>
                      <td className="py-2.5 px-2 font-mono">{loc.rainfall_mm} mm</td>
                      <td className="py-2.5 px-2 font-mono">+{loc.river_level_m} m</td>
                      <td className="py-2.5 px-2 font-mono font-bold text-white">{loc.risk_score}</td>
                      <td className="py-2.5 px-2">
                        <span className="font-bold">{loc.risk_category}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right space-x-2">
                        <button
                          onClick={() => setEditingLoc({ ...loc })}
                          className="px-2 py-1 bg-navy-800 hover:bg-navy-700 text-flood-cyan rounded border border-navy-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(loc.id, loc.name)}
                          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/40"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Location Modal */}
          {editingLoc && (
            <div className="fixed inset-0 bg-navy-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
              <div className="bg-navy-900 border border-navy-700 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-bold text-white">Edit Indicators for {editingLoc.name}</h3>
                <form onSubmit={handleUpdateLocation} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Rainfall (mm)</label>
                    <input
                      type="number"
                      step="1"
                      value={editingLoc.rainfall_mm}
                      onChange={(e) => setEditingLoc({ ...editingLoc, rainfall_mm: parseFloat(e.target.value) })}
                      className="w-full bg-navy-850 border border-navy-700 rounded px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">River Rise Level (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingLoc.river_level_m}
                      onChange={(e) => setEditingLoc({ ...editingLoc, river_level_m: parseFloat(e.target.value) })}
                      className="w-full bg-navy-850 border border-navy-700 rounded px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Terrain Susceptibility (0-1)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={editingLoc.terrain_susceptibility}
                      onChange={(e) => setEditingLoc({ ...editingLoc, terrain_susceptibility: parseFloat(e.target.value) })}
                      className="w-full bg-navy-850 border border-navy-700 rounded px-3 py-1.5 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingLoc(null)}
                      className="px-3 py-1.5 bg-navy-800 text-slate-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-flood-blue hover:bg-flood-blue/90 text-white rounded font-semibold"
                    >
                      Save & Recalculate Risk
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SHELTERS */}
      {adminTab === 'shelters' && (
        <div className="space-y-6">
          {/* Add Shelter */}
          <div className="bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-flood-cyan" />
              <h2 className="text-sm font-semibold text-white">Register Emergency Shelter Refuge</h2>
            </div>
            <form onSubmit={handleCreateShelter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Shelter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goalpara College Stadium"
                  value={newShelter.name}
                  onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">District</label>
                <input
                  type="text"
                  required
                  value={newShelter.district}
                  onChange={(e) => setNewShelter({ ...newShelter, district: e.target.value })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Capacity (Beds)</label>
                <input
                  type="number"
                  required
                  value={newShelter.capacity}
                  onChange={(e) => setNewShelter({ ...newShelter, capacity: parseInt(e.target.value) })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Demonstration Occupancy</label>
                <input
                  type="number"
                  required
                  value={newShelter.current_occupancy}
                  onChange={(e) => setNewShelter({ ...newShelter, current_occupancy: parseInt(e.target.value) })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Accessibility Info</label>
                <input
                  type="text"
                  value={newShelter.accessibility_info}
                  onChange={(e) => setNewShelter({ ...newShelter, accessibility_info: e.target.value })}
                  className="w-full bg-navy-850 border border-navy-700 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-flood-blue hover:bg-flood-blue/90 text-white rounded font-semibold transition"
                >
                  Register Shelter
                </button>
              </div>
            </form>
          </div>

          {/* Shelters Table */}
          <div className="bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md space-y-3">
            <h2 className="text-sm font-semibold text-white">Registered Shelter Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-850 text-slate-400 uppercase tracking-wider border-b border-navy-750">
                  <tr>
                    <th className="py-2.5 px-3">Shelter Name</th>
                    <th className="py-2.5 px-2">District</th>
                    <th className="py-2.5 px-2">Capacity</th>
                    <th className="py-2.5 px-2">Occupancy</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {shelters.map((sh) => (
                    <tr key={sh.id} className="hover:bg-navy-850/50">
                      <td className="py-2.5 px-3 font-semibold text-white">{sh.name}</td>
                      <td className="py-2.5 px-2 text-slate-300">{sh.district}</td>
                      <td className="py-2.5 px-2 font-mono">{sh.capacity}</td>
                      <td className="py-2.5 px-2 font-mono">{sh.current_occupancy}</td>
                      <td className="py-2.5 px-2">
                        <span className="font-bold">{sh.status}</span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleDeleteShelter(sh.id, sh.name)}
                          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/40"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {adminTab === 'logs' && (
        <div className="bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-flood-cyan" />
            <h2 className="text-sm font-semibold text-white">System Administrative Activity Audit Log</h2>
          </div>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-navy-850 rounded-lg border border-navy-750 text-xs flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-navy-800 text-flood-cyan px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {log.action}
                    </span>
                    <span className="text-slate-400 text-[10px]">By: {log.user_role}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  MapPin,
  Activity,
  Home,
  Navigation,
  Bot,
  Lock,
  FileText,
  Radio
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenReportModal, isAdminLoggedIn }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Interactive Map', icon: MapPin },
    { id: 'risk', label: 'Risk Analysis', icon: Activity },
    { id: 'shelters', label: 'Shelter Directory', icon: Home },
    { id: 'routes', label: 'Route Demo', icon: Navigation },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'admin', label: 'Admin Panel', icon: Lock, badge: isAdminLoggedIn ? 'Active' : null },
  ];

  return (
    <header className="bg-navy-900 border-b border-navy-700/80 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-flood-blue to-flood-cyan flex items-center justify-center shadow-md shadow-flood-blue/30">
              <ShieldAlert className="w-6 h-6 text-navy-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  DATHEON<span className="text-flood-cyan">.AI</span>
                </span>
                <span className="text-[10px] font-semibold bg-flood-blue/20 text-flood-cyan border border-flood-blue/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Manthan 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intelligent Risk Analysis. Better Preparedness. Safer Communities.
              </p>
            </div>
          </div>

          {/* Simulated Mode Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-800/80 border border-navy-700 text-xs text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Simulated Telemetry Engine</span>
          </div>

          {/* Quick Action: Generate Report */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-flood-blue/20 hover:bg-flood-blue/30 text-flood-cyan border border-flood-blue/40 transition"
              title="Generate Risk Assessment Report"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-navy-800 scrollbar-none text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'bg-flood-blue text-white shadow-md shadow-flood-blue/25 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

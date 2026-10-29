import React from 'react';
import { PhoneCall, Shield, Code, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-navy-800 text-slate-400 text-xs py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Identity & Hackathon */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-flood-cyan" />
              <span className="font-bold text-white tracking-wide">DATHEON AI</span>
            </div>
            <p className="text-slate-300">
              AI Manthan 2.0 — National Level Hackathon
            </p>
            <p className="text-slate-400 text-[11px]">
              Domain: AI for Disaster Management • Tagline: Intelligent Risk Analysis. Better Preparedness. Safer Communities.
            </p>
          </div>

          {/* Emergency Lifeline Contact Numbers */}
          <div className="space-y-2 bg-navy-850 p-3 rounded-lg border border-navy-750">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency Help Line Contacts (India)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>NDRF Helpline: <strong className="text-white">1078</strong></div>
              <div>National Emergency: <strong className="text-white">112</strong></div>
              <div>Ambulance: <strong className="text-white">108</strong></div>
              <div>Disaster Control: <strong className="text-white">1070</strong></div>
            </div>
          </div>

          {/* Tech Stack & Provenance */}
          <div className="space-y-2 md:text-right">
            <div className="flex items-center md:justify-end gap-1.5 text-slate-300 font-medium">
              <Code className="w-3.5 h-3.5 text-flood-cyan" />
              <span>Full-Stack Architecture</span>
            </div>
            <p className="text-[11px] text-slate-400">
              React + Vite • Tailwind CSS • FastAPI • SQLite • Leaflet OSM • Recharts • scikit-learn
            </p>
            <p className="text-[10px] text-slate-400">
              Decision Support Prototype • Clearly Labeled Demonstration Data
            </p>
          </div>
        </div>

        <div className="border-t border-navy-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© 2026 DATHEON AI Team. Built for AI Manthan 2.0 Hackathon.</p>
          <p className="text-center sm:text-right text-slate-400">
            Not for operational life-safety deployment without civil authority certification.
          </p>
        </div>
      </div>
    </footer>
  );
}

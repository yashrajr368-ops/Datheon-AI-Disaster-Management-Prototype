import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  ShieldAlert,
  AlertTriangle,
  Home,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { generateReport } from '../api';

export default function ReportGeneratorModal({ locationData, onClose }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const payload = {
          location_name: locationData?.name || locationData?.location_name || 'Assessed Catchment Sector',
          latitude: locationData?.latitude || 26.1824,
          longitude: locationData?.longitude || 91.7450,
          rainfall_mm: locationData?.rainfall_mm !== undefined ? locationData.rainfall_mm : 115.0,
          river_level_m: locationData?.river_level_m !== undefined ? locationData.river_level_m : 2.1,
          historical_flood_events: locationData?.historical_flood_events !== undefined ? locationData.historical_flood_events : 6,
          terrain_susceptibility: locationData?.terrain_susceptibility !== undefined ? locationData.terrain_susceptibility : 0.78,
          population_vulnerability: locationData?.population_vulnerability !== undefined ? locationData.population_vulnerability : 0.85,
        };
        const res = await generateReport(payload);
        setReport(res.data);
      } catch (err) {
        console.error('Failed to generate report:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [locationData]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.report_id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-navy-950/85 backdrop-blur z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-navy-900 border border-navy-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 bg-navy-850 border-b border-navy-750 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-flood-blue/20 text-flood-cyan flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Disaster Risk Assessment Formal Report</h2>
              <span className="text-[10px] text-slate-400 font-mono">
                {report?.report_id || 'Generating Report Document...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-flood-blue hover:bg-flood-blue/90 text-white rounded-lg text-xs font-semibold shadow transition disabled:opacity-50"
              title="Print or Save to PDF"
            >
              <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-750 rounded-lg text-xs font-medium transition disabled:opacity-50"
              title="Download structured JSON"
            >
              <Download className="w-3.5 h-3.5 text-flood-cyan" /> <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200 printable-area">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-flood-blue border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400">Compiling multi-indicator hydrological report...</p>
            </div>
          ) : report ? (
            <div className="space-y-6 text-xs">
              {/* Report Document Title Header */}
              <div className="border-b border-navy-750 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-flood-cyan uppercase tracking-wider font-semibold">
                    {report.hackathon} • {report.domain}
                  </div>
                  <h1 className="text-xl font-extrabold text-white mt-1">
                    {report.title}
                  </h1>
                  <p className="text-slate-400 text-xs italic mt-0.5">
                    "{report.tagline}"
                  </p>
                </div>
                <div className="text-right font-mono text-[11px] text-slate-400 shrink-0">
                  <div>Report ID: <strong className="text-white">{report.report_id}</strong></div>
                  <div>Timestamp: {new Date(report.timestamp).toLocaleString()}</div>
                  <div className="text-emerald-400 mt-1 font-sans">Simulated Prototype Assessment</div>
                </div>
              </div>

              {/* Location & Summary Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-navy-850 rounded-xl border border-navy-750">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Assessed Location
                  </span>
                  <div className="font-bold text-white text-sm">{report.location.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Lat: {report.location.latitude}°N • Lng: {report.location.longitude}°E
                  </div>
                </div>

                <div className="p-3.5 bg-navy-850 rounded-xl border border-navy-750">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Risk Classification
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-white">
                      {report.assessment_outcome.composite_risk_score}
                    </span>
                    <span className="text-slate-400 text-[10px]">/ 100</span>
                    <span className="ml-2 font-bold px-2 py-0.5 rounded bg-navy-900 border border-navy-750 text-flood-cyan">
                      {report.assessment_outcome.risk_category} Hazard
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Data Quality Confidence: {report.assessment_outcome.data_quality_score}%
                  </div>
                </div>

                <div className="p-3.5 bg-navy-850 rounded-xl border border-navy-750">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Transparent Methodology
                  </span>
                  <div className="text-[11px] text-slate-300 font-medium">
                    {report.assessment_outcome.methodology}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Rule Score: {report.assessment_outcome.rule_based_score} • ML Score: {report.assessment_outcome.ml_predicted_score}
                  </div>
                </div>
              </div>

              {/* Raw Input Indicators */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  1. Evaluated Input Indicators
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2 bg-navy-850 rounded border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">24h Rainfall</span>
                    <span className="font-mono font-bold text-white">{report.input_indicators.rainfall_24h_mm} mm</span>
                  </div>
                  <div className="p-2 bg-navy-850 rounded border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">River Gauge Level</span>
                    <span className="font-mono font-bold text-white">{report.input_indicators.river_level_relative_m} m</span>
                  </div>
                  <div className="p-2 bg-navy-850 rounded border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">10y Flood Events</span>
                    <span className="font-mono font-bold text-white">{report.input_indicators.historical_flood_events_10y} events</span>
                  </div>
                  <div className="p-2 bg-navy-850 rounded border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">Terrain Index</span>
                    <span className="font-mono font-bold text-white">{report.input_indicators.terrain_susceptibility_index}</span>
                  </div>
                  <div className="p-2 bg-navy-850 rounded border border-navy-750">
                    <span className="text-[10px] text-slate-400 block">Population Vulnerability</span>
                    <span className="font-mono font-bold text-white">{report.input_indicators.population_vulnerability_index}</span>
                  </div>
                </div>
              </div>

              {/* Contributing Factors Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  2. Factor Attribution & Risk Weights
                </h3>
                <div className="overflow-x-auto border border-navy-750 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-850 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Contributing Factor</th>
                        <th className="py-2 px-2">Raw Value</th>
                        <th className="py-2 px-2">Weight</th>
                        <th className="py-2 px-2">Impact %</th>
                        <th className="py-2 px-3">Hydrological Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-800">
                      {report.contributing_factors.map((f, i) => (
                        <tr key={i} className="hover:bg-navy-850/40">
                          <td className="py-2 px-3 font-semibold text-white">{f.name}</td>
                          <td className="py-2 px-2 font-mono text-slate-300">{f.raw_value} {f.unit}</td>
                          <td className="py-2 px-2 font-mono text-slate-400">{f.normalized_weight} pts</td>
                          <td className="py-2 px-2 font-mono font-bold text-flood-cyan">{f.contribution_percent}%</td>
                          <td className="py-2 px-3 text-[11px] text-slate-300">{f.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommended Preparedness Actions */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  3. Recommended Preparedness Actions (NDMA & Sendai Framework Aligned)
                </h3>
                <div className="p-3 bg-navy-850 rounded-lg border border-navy-750 space-y-1.5">
                  {report.recommended_preparedness_actions.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Designated Shelters */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  4. Available Designated Emergency Shelters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {report.designated_emergency_shelters.map((sh, i) => (
                    <div key={i} className="p-2.5 bg-navy-850 rounded-lg border border-navy-750 text-xs space-y-1">
                      <div className="font-semibold text-white flex items-center justify-between">
                        <span>⌂ {sh.name}</span>
                        <span className="text-[10px] text-emerald-400">{sh.status}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Capacity: {sh.capacity} beds ({sh.available_capacity} free) • District: {sh.district}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Facilities: {sh.facilities}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Provenance & Limitations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-navy-800 text-[11px]">
                <div className="space-y-1">
                  <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                    Data-Source Provenance Labels:
                  </span>
                  <ul className="list-disc pl-4 text-slate-400 space-y-0.5">
                    {report.data_source_labels.map((lbl, i) => (
                      <li key={i}>{lbl}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                    Scientific Limitations:
                  </span>
                  <ul className="list-disc pl-4 text-slate-400 space-y-0.5">
                    {report.limitations.slice(0, 2).map((lim, i) => (
                      <li key={i}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mandatory Hackathon Disclaimer */}
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-[11px] text-red-200">
                <strong className="text-red-300">Mandatory Hackathon Prototype Disclaimer: </strong>
                {report.legal_and_safety_disclaimer}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

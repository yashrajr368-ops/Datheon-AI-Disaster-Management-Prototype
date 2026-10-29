import React, { useState } from 'react';
import {
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  FileText,
  BarChart2,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { evaluateRisk } from '../api';

const SCENARIO_PRESETS = [
  {
    name: 'Flash Cloudburst Event',
    description: 'Intense 24h cloudburst with rapid river surge',
    values: {
      location_name: 'Guwahati Urban Bharalu Catchment',
      rainfall_mm: 185.0,
      river_level_m: 3.4,
      historical_flood_events: 7,
      terrain_susceptibility: 0.85,
      population_vulnerability: 0.90
    }
  },
  {
    name: 'Lowland Basin Waterlogging',
    description: 'Sustained monsoon rain in poor drainage terrain',
    values: {
      location_name: 'Barpeta Confluence Lowlands',
      rainfall_mm: 95.0,
      river_level_m: 1.8,
      historical_flood_events: 5,
      terrain_susceptibility: 0.92,
      population_vulnerability: 0.65
    }
  },
  {
    name: 'Resilient Highland Ridge',
    description: 'Elevated topography with natural slope drainage',
    values: {
      location_name: 'Dispur Capital Highland Ridge',
      rainfall_mm: 35.0,
      river_level_m: -1.0,
      historical_flood_events: 1,
      terrain_susceptibility: 0.20,
      population_vulnerability: 0.35
    }
  },
  {
    name: 'Severe Embankment Breach',
    description: 'Critical river overflow threatening dense informal settlement',
    values: {
      location_name: 'Silchar Barak River Breach Zone',
      rainfall_mm: 210.0,
      river_level_m: 4.8,
      historical_flood_events: 9,
      terrain_susceptibility: 0.88,
      population_vulnerability: 0.95
    }
  }
];

export default function RiskAnalysisView({ onOpenReportModal }) {
  const [formData, setFormData] = useState({
    location_name: 'Demonstration Catchment Sector',
    rainfall_mm: 110.0,
    river_level_m: 2.2,
    historical_flood_events: 5,
    terrain_susceptibility: 0.70,
    population_vulnerability: 0.75
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const validate = () => {
    const errs = {};
    if (formData.rainfall_mm < 0 || formData.rainfall_mm > 500) {
      errs.rainfall_mm = 'Rainfall must be between 0 and 500 mm';
    }
    if (formData.river_level_m < -5 || formData.river_level_m > 20) {
      errs.river_level_m = 'River gauge level must be between -5.0 and +20.0 m';
    }
    if (formData.historical_flood_events < 0 || formData.historical_flood_events > 30) {
      errs.historical_flood_events = 'Historical events must be between 0 and 30';
    }
    if (formData.terrain_susceptibility < 0 || formData.terrain_susceptibility > 1) {
      errs.terrain_susceptibility = 'Terrain susceptibility must be between 0.0 and 1.0';
    }
    if (formData.population_vulnerability < 0 || formData.population_vulnerability > 1) {
      errs.population_vulnerability = 'Population vulnerability must be between 0.0 and 1.0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEvaluate = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await evaluateRisk(formData);
      setResult(res.data);
    } catch (err) {
      console.error('Failed to evaluate risk:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setFormData(preset.values);
    setResult(null);
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-navy-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Transparent Disaster Risk Analysis & Decision Support
          <span className="text-xs bg-navy-800 text-flood-cyan border border-navy-700 px-2 py-0.5 rounded-full font-mono">
            Feature 3
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Input multi-hazard hydrological & demographic indicators to compute an explainable composite risk score.
        </p>
      </div>

      {/* Quick Preset Buttons */}
      <div className="bg-navy-900 border border-navy-750 p-3.5 rounded-xl">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-flood-cyan" /> Load Demonstration Scenarios:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SCENARIO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="text-left p-2.5 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-750 hover:border-navy-600 transition"
            >
              <div className="font-semibold text-white text-xs">{p.name}</div>
              <div className="text-[10px] text-slate-400 line-clamp-1">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form vs Calculation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Indicator Inputs */}
        <div className="lg:col-span-5 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-flood-cyan" />
              <h2 className="text-sm font-semibold text-white">Input Disaster Indicators</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Validated Form</span>
          </div>

          <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
            {/* Sector / Location Name */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Assessment Sector / Region Name
              </label>
              <input
                type="text"
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                className="w-full bg-navy-850 border border-navy-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-flood-blue font-sans text-xs"
                placeholder="e.g. Guwahati Urban Sector 4"
                required
              />
            </div>

            {/* 24-hr Rainfall */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-medium">
                  24-Hour Rainfall Indicator (mm)
                </label>
                <span className="font-mono text-flood-cyan font-bold">{formData.rainfall_mm} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="350"
                step="5"
                value={formData.rainfall_mm}
                onChange={(e) => setFormData({ ...formData, rainfall_mm: parseFloat(e.target.value) })}
                className="w-full accent-flood-blue bg-navy-800 rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0 mm (Dry)</span>
                <span>100 mm (Heavy)</span>
                <span>200+ mm (Extreme)</span>
              </div>
              {errors.rainfall_mm && <p className="text-red-400 text-[10px] mt-0.5">{errors.rainfall_mm}</p>}
            </div>

            {/* River Gauge Level */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-medium">
                  River Gauge Level (m relative to danger mark)
                </label>
                <span className={`font-mono font-bold ${formData.river_level_m > 2 ? 'text-red-400' : 'text-flood-cyan'}`}>
                  {formData.river_level_m > 0 ? `+${formData.river_level_m}` : formData.river_level_m} m
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="8"
                step="0.1"
                value={formData.river_level_m}
                onChange={(e) => setFormData({ ...formData, river_level_m: parseFloat(e.target.value) })}
                className="w-full accent-flood-blue bg-navy-800 rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>-2.0 m (Safe)</span>
                <span className="text-amber-400">0.0 m (Danger Mark)</span>
                <span className="text-red-400">+5.0 m (Extreme Breach)</span>
              </div>
              {errors.river_level_m && <p className="text-red-400 text-[10px] mt-0.5">{errors.river_level_m}</p>}
            </div>

            {/* Historical Flood Events */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-medium">
                  Historical Flood Events (Past 10 Years)
                </label>
                <span className="font-mono text-flood-cyan font-bold">{formData.historical_flood_events} events</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={formData.historical_flood_events}
                onChange={(e) => setFormData({ ...formData, historical_flood_events: parseInt(e.target.value) })}
                className="w-full accent-flood-blue bg-navy-800 rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0 (Rare)</span>
                <span>5 (Periodic)</span>
                <span>10+ (Chronic)</span>
              </div>
              {errors.historical_flood_events && (
                <p className="text-red-400 text-[10px] mt-0.5">{errors.historical_flood_events}</p>
              )}
            </div>

            {/* Terrain Susceptibility */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-medium">
                  Terrain Susceptibility Index (Slope & Drainage)
                </label>
                <span className="font-mono text-flood-cyan font-bold">{formData.terrain_susceptibility}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.terrain_susceptibility}
                onChange={(e) => setFormData({ ...formData, terrain_susceptibility: parseFloat(e.target.value) })}
                className="w-full accent-flood-blue bg-navy-800 rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.0 (Elevated ridge)</span>
                <span>0.5 (Moderate)</span>
                <span>1.0 (Low concave basin)</span>
              </div>
              {errors.terrain_susceptibility && (
                <p className="text-red-400 text-[10px] mt-0.5">{errors.terrain_susceptibility}</p>
              )}
            </div>

            {/* Population Vulnerability */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-medium">
                  Population & Socio-Demographic Vulnerability
                </label>
                <span className="font-mono text-flood-cyan font-bold">{formData.population_vulnerability}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={formData.population_vulnerability}
                onChange={(e) => setFormData({ ...formData, population_vulnerability: parseFloat(e.target.value) })}
                className="w-full accent-flood-blue bg-navy-800 rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.0 (Low exposure)</span>
                <span>0.5 (Average)</span>
                <span>1.0 (Dense / vulnerable)</span>
              </div>
              {errors.population_vulnerability && (
                <p className="text-red-400 text-[10px] mt-0.5">{errors.population_vulnerability}</p>
              )}
            </div>

            {/* Evaluate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-flood-blue hover:bg-flood-blue/90 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-flood-blue/20 transition disabled:opacity-50"
            >
              {loading ? (
                <>Calculating Algorithmic Risk Index...</>
              ) : (
                <>
                  <Activity className="w-4 h-4" /> Calculate Demonstration Risk Score
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Transparent Analysis Outcome */}
        <div className="lg:col-span-7 bg-navy-900 border border-navy-750 p-5 rounded-xl shadow-lg flex flex-col justify-between space-y-5">
          {result ? (
            <div className="space-y-5">
              {/* Outcome Header & Scores */}
              <div className="p-4 rounded-xl bg-navy-850 border border-navy-750 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Composite Risk Index Outcome
                    </span>
                    <h3 className="text-lg font-bold text-white">{formData.location_name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSeverityBadge(result.risk_category)}`}>
                      {result.risk_category} Hazard Level
                    </span>
                  </div>
                </div>

                {/* Score Dial & Progress */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-extrabold text-white font-mono">{result.risk_score}</span>
                  <span className="text-slate-400 text-sm">/ 100 Risk Index</span>
                </div>
                <div className="w-full bg-navy-950 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      result.risk_category === 'Severe'
                        ? 'bg-red-500'
                        : result.risk_category === 'High'
                        ? 'bg-orange-500'
                        : result.risk_category === 'Moderate'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, result.risk_score)}%` }}
                  ></div>
                </div>

                {/* Transparent Model Breakdown (Rule vs ML) */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-navy-750 text-xs">
                  <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Explainable Rule MCDA (60%)</span>
                    <span className="text-sm font-bold text-slate-200 font-mono">{result.rule_score} / 100</span>
                    <span className="text-[10px] text-slate-400 block">Weighted multi-criteria decision matrix</span>
                  </div>
                  <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
                    <span className="text-[10px] text-slate-400 block font-medium">Scikit-Learn Random Forest (40%)</span>
                    <span className="text-sm font-bold text-slate-200 font-mono">{result.ml_predicted_score} / 100</span>
                    <span className="text-[10px] text-slate-400 block">Trained on 3,000 synthetic flood events</span>
                  </div>
                </div>
              </div>

              {/* Factors Attribution Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-flood-cyan" /> Factor Contribution Breakdown
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Normalized Sum: 100%</span>
                </div>

                <div className="space-y-2">
                  {result.factors.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-navy-850 border border-navy-750 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{f.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px] font-mono">
                            {f.raw_value} {f.unit}
                          </span>
                          <span className="font-mono font-bold text-flood-cyan bg-navy-900 px-1.5 py-0.5 rounded text-[10px]">
                            {f.contribution_percent}% impact
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Preparedness Actions */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Actionable Preparedness Guidance (NDMA Aligned)
                </h4>
                <div className="p-3 bg-navy-850 rounded-lg border border-navy-750 space-y-1.5">
                  {result.suggested_actions.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limitations & Academic Disclaimer */}
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1">
                <div className="font-semibold text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Academic Prototype Limitations
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
                  {result.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>

              {/* Export Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onOpenReportModal(formData)}
                  className="flex items-center gap-2 py-2 px-4 bg-flood-blue hover:bg-flood-blue/80 text-white rounded-lg text-xs font-semibold shadow transition"
                >
                  <FileText className="w-3.5 h-3.5" /> Export Formal Assessment Report
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-navy-800 rounded-full text-slate-400">
                <Activity className="w-8 h-8 text-flood-cyan" />
              </div>
              <h3 className="text-sm font-semibold text-white">Ready for Risk Evaluation</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Adjust the rainfall, river level, terrain, and population indicators on the left or select a preset scenario above, then click <strong>Calculate Demonstration Risk Score</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

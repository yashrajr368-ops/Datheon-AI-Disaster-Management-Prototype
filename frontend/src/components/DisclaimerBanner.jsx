import React, { useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2 text-xs md:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-300">AI Manthan 2.0 Hackathon Prototype:</strong>{' '}
            All disaster telemetry, risk predictions, and evacuation routes are <span className="underline decoration-amber-400">simulated demonstration data</span>. Not officially validated for live emergency operations. In actual disasters, obey certified directives from the National Disaster Management Authority (NDMA), District Administration, and NDRF.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-400/80 hover:text-amber-200 p-1 shrink-0 transition"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

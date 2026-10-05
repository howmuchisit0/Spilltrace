import React from 'react';
import { Droplet, Clock, Map, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SpillAnalytics({ data }) {
  if (!data || !data.spill) return null;

  const { area_km2, detected_at, estimated_age } = data.spill;

  const detectionDate = new Date(detected_at);
  const formattedDate = detectionDate.toLocaleString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
  });

  return (
    <div className="analytics-widget glass-panel">
      <div className="widget-header">
        <Droplet className="icon-accent-red" size={16} />
        <h2>Spill overview</h2>
      </div>

      <div className="metric-grid">
        <div className="metric-box">
          <div className="metric-title">
            <Map size={12} className="icon-muted" />
            <span>Area</span>
          </div>
          <div className="metric-value">
            {area_km2.toFixed(1)} <span className="metric-unit">km²</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-title">
            <Clock size={12} className="icon-muted" />
            <span>Detected</span>
          </div>
          <div className="metric-value text-small">
            {formattedDate}
          </div>
        </div>

        {estimated_age && (
          <div className="metric-box full-width">
            <div className="metric-title">
              <AlertTriangle size={12} className={estimated_age.regime_valid ? 'icon-accent-orange' : 'icon-muted'} />
              <span>Estimated age</span>
            </div>
            <div className="metric-value">
              {estimated_age.estimated_age_hours.toFixed(1)} <span className="metric-unit">hours</span>
            </div>
            {!estimated_age.regime_valid && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                <AlertCircle size={11} />
                <span>Outside valid regime</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

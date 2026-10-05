import React from 'react';
import { X, Navigation, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { riskTier } from '../utils/riskTier';

function formatTimestamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function DossierPanel({ vessel, onClose }) {
  if (!vessel) return null;

  const overallScore = Math.round(vessel.score * 100);
  const tier = riskTier(overallScore);

  return (
    <motion.div 
      className="dossier-panel"
      layoutId={`vessel-${vessel.vessel_id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="dossier-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Navigation size={20} className="icon-muted" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{vessel.name}</h2>
            <div className="vessel-imo" style={{ marginTop: '2px' }}>{vessel.vessel_id}</div>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="dossier-grid">
        <div className="dossier-box full-width">
          <h3 className="box-title">Suspicion breakdown</h3>
          <div className="metric-grid">
            <div className="metric-box">
              <div className="metric-title"><span>Overall</span></div>
              <div className="metric-value" style={{ color: tier.color }}>
                {overallScore}<span className="metric-unit">%</span>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-title"><span>Proximity</span></div>
              <div className="metric-value text-small">
                {Math.round(vessel.proximity_score * 100)}%
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-title"><span>Trajectory</span></div>
              <div className="metric-value text-small">
                {Math.round(vessel.trajectory_score * 100)}%
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-title"><span>Anomaly</span></div>
              <div className="metric-value text-small">
                {Math.round(vessel.anomaly_score * 100)}%
              </div>
            </div>
          </div>
        </div>

        <div className="dossier-box full-width">
          <h3 className="box-title">Track history</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {vessel.track.map((point, i) => {
              const [lat, lon, timestamp] = point;
              const isLast = i === vessel.track.length - 1;
              return (
                <div
                  key={i}
                  className="profile-row"
                  style={{ borderBottom: isLast ? 'none' : undefined }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={12} className="icon-muted" />
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>{lat.toFixed(4)}, {lon.toFixed(4)}</span>
                  </div>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                    {formatTimestamp(timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
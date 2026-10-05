import React, { useState } from 'react';
import { Activity, ShieldAlert, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { riskTier } from '../utils/riskTier';

function trackedHours(track) {
  const start = new Date(track[0][2]);
  const end = new Date(track[track.length - 1][2]);
  return Math.max(0, Math.round((end - start) / 3600000));
}

export default function VesselRanking({ vessels, selectedVesselId, onSelectVessel }) {
  const [showAll, setShowAll] = useState(false);

  if (!vessels || vessels.length === 0) return null;

  const displayVessels = showAll ? vessels : vessels.slice(0, 5);

  return (
    <div className="vessel-list">
      {displayVessels.map((vessel, index) => {
        const isSelected = selectedVesselId === vessel.vessel_id;
        const totalScore = Number((vessel.score * 100).toFixed(0));
        const tier = riskTier(totalScore);

        return (
          <motion.div 
            key={vessel.vessel_id} 
            layoutId={`vessel-${vessel.vessel_id}`}
            className={`vessel-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectVessel(vessel.vessel_id)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
          >
            <div className="vessel-header" style={{ marginBottom: '6px' }}>
              <div className="vessel-title">
                <Navigation size={14} className="icon-muted" style={{ opacity: isSelected ? 1 : 0.5 }} />
                <span className="vessel-name">{vessel.name}</span>
              </div>
              <div className={`vessel-score ${tier.label}`}>
                {totalScore}%
              </div>
            </div>

            <div className="vessel-indicators" style={{ marginTop: '6px' }}>
              <div className="indicator">
                <Activity size={11} className="icon-muted" />
                <span>{trackedHours(vessel.track)}h tracked</span>
              </div>
              {vessel.anomaly_score > 0.5 && (
                <div className="indicator warning">
                  <ShieldAlert size={11} />
                  <span>Anomalous</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {vessels.length > 5 && (
        <button 
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : `Show all ${vessels.length} vessels`}
        </button>
      )}
    </div>
  );
}
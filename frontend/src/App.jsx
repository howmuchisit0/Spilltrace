import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from './components/MapView';
import VesselRanking from './components/VesselRanking';
import SpillAnalytics from './components/SpillAnalytics';
import DossierPanel from './components/DossierPanel';
import fallbackData from './data/fallbackData.json';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/spill-result?mode=real';

function App() {
  const [data, setData] = useState(null);
  const [selectedVesselId, setSelectedVesselId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.warn('Backend API unavailable, using embedded pipeline data:', err);
        setData(fallbackData);
      });
  }, []);

  if (!data) return <div className="status-message">Loading…</div>;

  const selectedVessel = data.vessels.find(v => v.vessel_id === selectedVesselId);

  return (
    <div className="dashboard-container">
      <div className="status-bar">
        <div className="live-badge">SpillTrace</div>
        <div className="demo-mode-badge">
          Demo · Synthetic AIS
        </div>
      </div>

      <div className="map-section">
        <MapView data={data} selectedVesselId={selectedVesselId} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <SpillAnalytics data={data} />
      </motion.div>
      
      <AnimatePresence mode="wait">
        {selectedVesselId ? (
          <DossierPanel 
            key="dossier" 
            vessel={selectedVessel} 
            onClose={() => setSelectedVesselId(null)} 
          />
        ) : (
          <motion.div 
            key="ranking"
            className="panel-section"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', top: 16, right: 16, bottom: 16, width: 380, overflowY: 'auto' }}
          >
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
              <h1 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.01em' }}>
                SpillTrace
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                Vessel attribution ranking
              </p>
            </div>
            <VesselRanking
              vessels={data.vessels}
              selectedVesselId={selectedVesselId}
              onSelectVessel={setSelectedVesselId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
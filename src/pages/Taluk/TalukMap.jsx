import { useState } from 'react';
import GISMap from '../../components/Map/GISMap';
import { INCIDENTS, RESOURCES } from '../../data/mockData';
import { Card } from '../../components/common/UIComponents';
import { Layers } from 'lucide-react';

export default function TalukMap() {
  const [showResources, setShowResources] = useState(true);

  // Flatten resources for the map
  const allResources = [
    ...RESOURCES.fireTrucks,
    ...RESOURCES.ambulances,
    ...RESOURCES.policeUnits,
    ...RESOURCES.rescueTeams,
  ].filter(r => r.status === 'Deployed' || r.status === 'En Route' || r.status === 'On Scene');

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🗺️ Taluk GIS Map</div>
          <div className="page-subtitle">Live view of incidents and deployed resources in your Taluk</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <input type="checkbox" checked={showResources} onChange={e => setShowResources(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
            Show Resources
          </label>
        </div>
      </div>

      <Card>
        <div style={{ padding: 0, position: 'relative' }}>
          <GISMap
            center={[10.9102, 76.9558]}
            zoom={12}
            height={600}
            incidents={INCIDENTS}
            resources={showResources ? allResources : []}
            showRadius={true}
          />

          <div className="map-legend">
            <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Layers size={12} /> Map Legend
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Incidents</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#7F1D1D' }}/> Extremely Severe</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#DC2626' }}/> Severe</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#EA580C' }}/> High</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#D97706' }}/> Medium</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#16A34A' }}/> Low</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Resources</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#DC2626' }}/> Fire</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#16A34A' }}/> Medical</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#2563EB' }}/> Police</div>
                <div className="map-legend-item"><div className="map-legend-dot" style={{ background: '#7C3AED' }}/> Rescue</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

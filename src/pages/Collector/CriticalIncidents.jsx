import { useState } from 'react';
import { INCIDENTS } from '../../data/mockData';
import { Card, SeverityBadge, StatusBadge, AIPanel, CategoryBadge } from '../../components/common/UIComponents';
import { CheckCircle, AlertTriangle, ShieldAlert, FileText, Megaphone, MapPin, Navigation, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CriticalIncidents() {
  const navigate = useNavigate();
  // Filter for incidents that reached Collector
  const queue = INCIDENTS.filter(i => ['Severe', 'Extremely Severe'].includes(i.severity) && i.status === 'Waiting for Collector');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inc = queue[selectedIdx] || INCIDENTS.find(i => i.id === 'INC-2024-001'); // Fallback to mock

  if (!inc) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <CheckCircle size={48} color="var(--severity-low)" style={{ marginBottom: '16px' }} />
        <h2>Zero Critical Incidents Pending</h2>
        <p>No incidents require executive approval right now.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><ShieldAlert size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Executive Incident Review</div>
          <div className="page-subtitle">Make strategic decisions on high-severity emergencies</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Pending Review: {selectedIdx + 1} of {queue.length || 1}
          </span>
        </div>
      </div>

      <div className="grid-3">
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AIPanel 
            title="AI Executive Summary" 
            summary={inc.aiSummary}
            recommendation={inc.aiRecommendation}
          />

          <Card title="Incident Overview">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>{inc.title}</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span className="font-mono text-primary badge badge-blue">{inc.id}</span>
                  <CategoryBadge category={inc.category} />
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}><MapPin size={12} style={{ display: 'inline' }} /> {inc.location.address}</div>
              </div>
            </div>
            
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)', padding: '16px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)' }}>
              {inc.description}
            </p>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <div className="text-xs text-muted font-bold text-uppercase mb-1">Population at Risk</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--severity-severe)' }}>{inc.populationAtRisk?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted font-bold text-uppercase mb-1">Affected Radius</div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{inc.affectedRadius} km</div>
              </div>
              <div>
                <div className="text-xs text-muted font-bold text-uppercase mb-1">District EOC Coordination</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--severity-low)' }}>Completed at {new Date(inc.districtCoordinatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </Card>

          <Card title="Resource Summary (Prepared by District EOC)">
            <div className="grid-2">
              {inc.resources?.length > 0 ? (
                <>
                  <div style={{ background: 'var(--bg-muted)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <div className="text-xs font-bold text-muted mb-2 text-uppercase">Fire & Rescue</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{inc.resources.filter(r => r.type === 'Fire Truck').length} Fire Trucks</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{inc.resources.filter(r => r.type === 'Rescue Team').length} Rescue Teams</div>
                  </div>
                  <div style={{ background: 'var(--bg-muted)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                    <div className="text-xs font-bold text-muted mb-2 text-uppercase">Medical & Police</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{inc.resources.filter(r => r.type === 'Ambulance').length} Ambulances</div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{inc.resources.filter(r => r.type === 'Police').length} Police Units</div>
                  </div>
                </>
              ) : (
                <div className="text-muted" style={{ gridColumn: 'span 2' }}>No resources mapped.</div>
              )}
            </div>
            <div style={{ marginTop: '12px', textAlign: 'right' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/collector/situation-map')}><Navigation size={12} /> View Live Map Operations</button>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title={<><Zap size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Executive Decisions</>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-danger" style={{ justifyContent: 'center' }} onClick={() => navigate('/collector/broadcast-approval')}>
                <Megaphone size={16} /> Review & Approve Broadcast
              </button>
              
              <button className="btn btn-warning" style={{ justifyContent: 'center' }} onClick={() => navigate('/collector/evacuation')}>
                <Navigation size={16} /> Manage Evacuation
              </button>
              
              <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
              
              <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => navigate('/collector/official-orders')}>
                <FileText size={16} /> Issue Official Order (PDF)
              </button>
              
              <button className="btn btn-ghost" style={{ justifyContent: 'center', color: 'var(--severity-severe)' }}>
                <ShieldAlert size={16} /> Escalate to State Admin
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

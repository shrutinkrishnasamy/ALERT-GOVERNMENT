import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIncidents } from '../../context/LiveContext';
import { Card, Timeline, SeverityBadge, StatusBadge } from '../../components/common/UIComponents';

export default function IncidentTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
  const myIncidents = useIncidents();
  const inc = myIncidents.find(i => i.id === (id || 'INC-2024-001')) || myIncidents[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">⏱️ Incident Timeline</div>
          <div className="page-subtitle">Full audit trail and chronological history of all incident events</div>
        </div>
      </div>

      <div className="grid-3">
        <Card title="Select Incident">
          <select className="form-select" value={selectedId} onChange={e => setSelectedId(e.target.value)} size={INCIDENTS.length} style={{ height: 'auto' }}>
            {INCIDENTS.map(i => <option key={i.id} value={i.id} style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>{i.id} — {i.title}</option>)}
          </select>
        </Card>

        <div style={{ gridColumn: 'span 2' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{inc.title}</div>
                <div className="font-mono text-muted text-sm">{inc.id}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <SeverityBadge severity={inc.severity} />
                <StatusBadge status={inc.status} />
              </div>
            </div>
            
            <div className="section-title" style={{ marginBottom: '16px' }}>Master Audit Trail</div>
            <Timeline events={inc.timeline} />
          </Card>
        </div>
      </div>
    </div>
  );
}

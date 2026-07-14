import { useState } from 'react';
import { RESOURCES } from '../../data/mockData';
import { useLive, useIncidents } from '../../context/LiveContext';
import GISMap from '../../components/Map/GISMap';
import { Card, SeverityBadge, StatusBadge, DeptUpdate } from '../../components/common/UIComponents';
import { Truck, Navigation, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActiveEmergencies() {
  const navigate = useNavigate();
  const myIncidents = useIncidents();
  const [selectedId, setSelectedId] = useState(null);

  // Filter out closed/resolved, show only active ones being coordinated/broadcasting
  const activeList = myIncidents.filter(i =>
    ['District Coordinated', 'Waiting for Collector', 'Collector Approved', 'Broadcasting', 'Broadcast Completed', 'Resources Active'].includes(i.status)
  );
  
  // Default to first active incident if selectedId is invalid
  const selected = activeList.find(i => i.id === selectedId) || activeList[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><ShieldAlert size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Active Emergencies</div>
          <div className="page-subtitle">Live multi-incident overview and real-time department updates</div>
        </div>
      </div>

      <div className="grid-3">
        {/* Left: List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeList.map(inc => (
            <div
              key={inc.id}
              className={`incident-card severity-${inc.severity.toLowerCase().replace(' ', '-')}`}
              style={{
                borderColor: selectedId === inc.id ? 'var(--primary)' : 'var(--border)',
                background: selectedId === inc.id ? 'var(--primary-light)' : 'var(--bg-surface)'
              }}
              onClick={() => setSelectedId(inc.id)}
            >
              <div className="incident-card-title">{inc.title}</div>
              <div className="incident-card-meta" style={{ marginBottom: '8px' }}>
                <span className="font-mono text-primary">{inc.id}</span>
                <span>{inc.taluk}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SeverityBadge severity={inc.severity} />
                <StatusBadge status={inc.status} />
              </div>
            </div>
          ))}
          {activeList.length === 0 && <p className="text-muted">No active emergencies right now.</p>}

          {selected && (
            <Card title="Resource Summary" action={<button className="btn btn-secondary btn-sm" onClick={() => navigate('/district/resource-command')}><Truck size={12}/> Manage</button>}>
              {selected.resources?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selected.resources.map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '8px', background: 'var(--bg-muted)', borderRadius: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{r.type} <span className="font-mono text-muted">({r.vehicleNo})</span></span>
                      <span style={{ color: r.status === 'On Scene' ? 'var(--severity-low)' : 'var(--primary)' }}>{r.status} {r.eta > 0 ? `- ETA ${r.eta}m` : ''}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="text-muted text-sm">No resources deployed yet.</div>}
            </Card>
          )}
        </div>

        {/* Center: Live Map */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selected && (
            <>
              <Card>
                <div style={{ padding: 0 }}>
                  <GISMap
                    center={[selected.location.lat, selected.location.lng]}
                    zoom={14}
                    height={400}
                    incidents={[selected]}
                    resources={selected.resources || []}
                    showRadius={true}
                    radiusKm={selected.affectedRadius || 2}
                  />
                </div>
              </Card>

              <Card title="Live Department Feed">
                <div style={{ padding: 0 }}>
                  {selected.departmentUpdates?.length > 0 ? (
                    selected.departmentUpdates.map((u, i) => (
                      <DeptUpdate key={i} icon={u.icon} dept={u.dept} time={u.time} message={u.message} />
                    ))
                  ) : <div className="text-muted text-sm p-3">No updates received.</div>}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

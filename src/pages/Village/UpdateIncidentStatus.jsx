import { useState } from 'react';
import { INCIDENTS } from '../../data/mockData';
import { SeverityBadge, StatusBadge, Timeline, AlertBanner } from '../../components/common/UIComponents';
import { Send, Plus, RefreshCw, ShieldAlert, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function UpdateIncidentStatus() {
  const [selectedId, setSelectedId] = useState('INC-2024-001');
  const [update, setUpdate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const incident = INCIDENTS.find(i => i.id === selectedId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setUpdate('');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><RefreshCw size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Update Incident Status</div>
          <div className="page-subtitle">Post live field updates to keep your team informed</div>
        </div>
      </div>

      {submitted && <AlertBanner type="success" icon={<CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} />}>Update posted successfully! District EOC has been notified.</AlertBanner>}

      <div className="grid-2">
        <div>
          {/* Incident selector */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-header"><div className="card-title">Select Incident</div></div>
            <div className="card-body">
              <select className="form-select" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                {INCIDENTS.map(i => <option key={i.id} value={i.id}>{i.id} — {i.title}</option>)}
              </select>
            </div>
          </div>

          {incident && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-header">
                <div className="card-title">{incident.title}</div>
                <SeverityBadge severity={incident.severity} />
              </div>
              <div className="card-body">
                <div style={{ marginBottom: '10px' }}>
                  <StatusBadge status={incident.status} />
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>{incident.location.address}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>{incident.description}</p>

                {/* Quick update buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['Fire truck arrived', 'Fire spreading', 'Rescue started', 'Evacuation underway', 'Situation stabilizing', 'Additional help needed'].map(t => (
                    <button key={t} type="button" className="btn btn-secondary btn-sm" onClick={() => setUpdate(u => u + (u ? '. ' : '') + t)}>
                      <Plus size={10} /> {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Update form */}
          <div className="card">
            <div className="card-header"><div className="card-title">📝 Post Field Update</div></div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Update Type</label>
                  <select className="form-select">
                    <option>Status Update</option>
                    <option>Resource Request</option>
                    <option>Situation Worsening</option>
                    <option>Situation Improving</option>
                    <option>Evacuation Update</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Field Update Message *</label>
                  <textarea className="form-textarea" rows={4} value={update}
                    onChange={e => setUpdate(e.target.value)}
                    placeholder="e.g. Fire truck TN38G1023 has arrived. Fire is being contained from south side. Rescue team evacuating Building B residents..."
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className="btn btn-primary" disabled={!update.trim()}>
                    <Send size={13} /> Post Update
                  </button>
                  <button type="button" className="btn sos-btn" style={{ fontSize: '12px', padding: '8px 16px' }}
                    onClick={() => Swal.fire({ title: 'SOS Escalated!', text: 'Collector notified directly.', icon: 'warning', confirmButtonColor: '#d33' })}>
                    <ShieldAlert size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> SOS Escalate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <div className="card-header"><div className="card-title">📅 Incident Timeline</div></div>
          <div className="card-body">
            {incident && <Timeline events={incident.timeline} />}
          </div>
        </div>
      </div>
    </div>
  );
}

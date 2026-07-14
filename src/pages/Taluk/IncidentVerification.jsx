import { useState } from 'react';
import { INCIDENTS } from '../../data/mockData';
import { SeverityBadge, AIPanel, Card, AlertBanner } from '../../components/common/UIComponents';
import GISMap from '../../components/Map/GISMap';
import { CheckCircle, XCircle, AlertTriangle, ShieldAlert, Phone, MapPin, Search, Image, FileImage, Camera, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function IncidentVerification() {
  const navigate = useNavigate();
  const queue = INCIDENTS.filter(i => i.status === 'Waiting for Taluk');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inc = queue[selectedIdx];

  const handleVerify = (action) => {
    let title = '', text = '', icon = 'success';
    if (action === 'approve') {
      title = 'Verified'; text = 'Incident Verified. Forwarded to District EOC automatically.';
    } else if (action === 'reject') {
      title = 'Rejected'; text = 'Incident Rejected. Marked as False Alarm.'; icon = 'error';
    } else {
      title = 'Escalated'; text = 'Escalated Urgently to Collector.'; icon = 'warning';
    }

    Swal.fire(title, text, icon).then(() => {
      if (selectedIdx < queue.length - 1) setSelectedIdx(s => s + 1);
      else navigate('/taluk');
    });
  };

  if (!inc) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <CheckCircle size={48} color="var(--severity-low)" style={{ marginBottom: '16px' }} />
        <h2>All Caught Up!</h2>
        <p>There are no pending incidents requiring verification.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/taluk')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><Search size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Incident Verification</div>
          <div className="page-subtitle">Review evidence and AI analysis before forwarding to District EOC</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Queue: {selectedIdx + 1} of {queue.length}
          </span>
        </div>
      </div>

      <div className="grid-3">
        {/* Left: Incident Details & Evidence */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>{inc.title}</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span className="font-mono text-primary">{inc.id}</span>
                  <span>·</span>
                  <span><MapPin size={11} style={{ display: 'inline' }} /> {inc.location.address}</span>
                </div>
              </div>
              <SeverityBadge severity={inc.severity} />
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '12px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              {inc.description}
            </p>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div>
                <div className="section-title" style={{ fontSize: '12px' }}>Reporter</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>V</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{inc.reportedBy}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Village EOC</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="section-title" style={{ fontSize: '12px' }}>Time Reported</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div>
                <div className="section-title" style={{ fontSize: '12px' }}>Contact VAO</div>
                <button className="btn btn-secondary btn-sm"><Phone size={12} /> Call Field</button>
              </div>
            </div>
          </Card>

          {/* Map */}
          <Card title={<><MapPin size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Incident Map & Infrastructure</>}>
            <div style={{ padding: 0 }}>
              <GISMap center={[inc.location.lat, inc.location.lng]} zoom={14} height={300} incidents={[inc]} />
            </div>
          </Card>

          {/* VEO Attached Media */}
          <Card title={<><Camera size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Attached Evidence (from VEO)</>}>
            <div style={{ padding: '0 0 4px 0' }}>
              {inc.media && inc.media.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, padding: '12px 0 4px' }}>
                  {inc.media.map((m, i) => (
                    <div key={i} style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      background: 'var(--bg-muted)'
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        height: 110,
                        background: m.url
                          ? `url(${m.url}) center/cover no-repeat`
                          : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {!m.url && (
                          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                            {m.type === 'video'
                              ? <Camera size={28} style={{ marginBottom: 4 }} />
                              : <FileImage size={28} style={{ marginBottom: 4 }} />}
                            <div style={{ fontSize: 10, fontWeight: 600 }}>No Preview</div>
                          </div>
                        )}
                        {/* Type badge */}
                        <span style={{
                          position: 'absolute', top: 6, left: 6,
                          background: m.type === 'video' ? '#1C4E80' : '#388E3C',
                          color: 'white', fontSize: 9, fontWeight: 700,
                          padding: '2px 7px', borderRadius: 2, textTransform: 'uppercase'
                        }}>
                          {m.type}
                        </span>
                      </div>
                      {/* Info */}
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.caption}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                          {new Date(m.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '28px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Image size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                  <div style={{ fontSize: 13, fontWeight: 500 }}>No media attached by VEO</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: AI & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AIPanel
            title="AI Verification Recommendation"
            summary={inc.aiSummary}
            recommendation="AI Confidence: 92%. Recommend Immediate Approval. No duplicate found in last 24h."
          />

          <Card title={<><AlertTriangle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Risk Analysis</>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Est. Population at Risk</span>
                <strong style={{ color: 'var(--severity-severe)' }}>{inc.populationAtRisk?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Nearby Schools (3km)</span>
                <strong>3</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Nearby Hospitals (3km)</span>
                <strong>1</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Weather Condition</span>
                <strong>Wind NE 28 km/h</strong>
              </div>
            </div>
          </Card>

          <Card title={<><Zap size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Taluk Decision</>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleVerify('approve')}>
                <CheckCircle size={16} /> Verify & Forward to District
              </button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border)' }} onClick={() => handleVerify('reject')}>
                <XCircle size={16} /> Reject (False Alarm)
              </button>
              <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} onClick={() => handleVerify('escalate')}>
                <ShieldAlert size={16} /> Escalate Urgently to Collector
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

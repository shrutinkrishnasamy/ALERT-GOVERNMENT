import { useAuth } from '../../context/AuthContext';
import { INCIDENTS } from '../../data/mockData';
import { FilePlus, Clock, Radio, ShieldAlert, AlertTriangle, Eye, MapPin, CloudRain, Thermometer, Wind, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GradientCard = ({ gradient, icon, label, value, sub }) => (
  <div className="gradient-stat-card" style={{ background: gradient }}>
    <div className="stat-icon-wrapper">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

export default function VillageDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activeIncidents = INCIDENTS.filter(i => i.status !== 'Resolved');
  const criticalCount = INCIDENTS.filter(i => ['Severe', 'Extremely Severe'].includes(i.severity)).length;

  return (
    <div className="animate-in">
      {/* AI Banner */}
      <div className="ai-brief-banner">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="ai-brief-header">
            <ShieldAlert size={14} /> AI DAILY BRIEF
          </div>
          <div className="ai-brief-title">Good Afternoon, {user?.name?.split(' ')[0]}! 👋</div>
          <div className="ai-brief-text">
            You have <strong>{activeIncidents.length} active incidents</strong> today · <strong>{criticalCount} critical</strong> escalated to Collector · Weather alert: Heavy rainfall expected by 3 PM
          </div>
          <div className="ai-brief-tags">
            <span className="ai-brief-tag"><XCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> INC-2024-001 — Extremely Severe</span>
            <span className="ai-brief-tag">⛈️ Weather Alert Active</span>
            <span className="ai-brief-tag">📝 2 Pending Updates</span>
          </div>
        </div>
      </div>

      {/* Gradient Stats */}
      <div className="stat-grid">
        <GradientCard gradient="var(--gradient-6)" icon={<FilePlus size={20} />} label="My Incidents Today" value="4" sub="2 new this session" />
        <GradientCard gradient="var(--gradient-5)" icon={<Clock size={20} />} label="Awaiting Verification" value="1" sub="Sent to Taluk" />
        <GradientCard gradient="var(--gradient-success)" icon={<Radio size={20} />} label="Broadcast Completed" value="1" sub="INC-2024-003" />
        <GradientCard gradient="var(--gradient-danger)" icon={<ShieldAlert size={20} />} label="Critical / SOS" value={criticalCount} sub="Needs attention" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Active Incidents Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Active Incidents in My Jurisdiction</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/village/active-incidents')}>View All</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeIncidents.map(inc => (
                  <tr key={inc.id}>
                    <td><span className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 12 }}>{inc.id}</span></td>
                    <td style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.title}</td>
                    <td>
                      <span className={`badge badge-${inc.severity === 'Low' ? 'green' : inc.severity === 'Medium' ? 'orange' : 'red'}`}>
                        <AlertTriangle size={10} /> {inc.severity}
                      </span>
                    </td>
                    <td><span className={`badge ${
                      inc.status === 'Broadcast Completed' ? 'badge-green' :
                      inc.status === 'District Coordinated' ? 'badge-blue' :
                      inc.status === 'Waiting for Collector' || inc.status === 'Taluk Verified' ? 'badge-orange' :
                      inc.status === 'Waiting for Taluk' ? 'badge-purple' :
                      'badge-gray'
                    }`}><Clock size={10} /> {inc.status}</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/village/update-status')}>
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Quick Actions</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/village/create-incident')}>
                <FilePlus size={16} /> Report New Incident
              </button>
              <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <AlertTriangle size={16} /> Trigger SOS Alert
              </button>
            </div>
          </div>

          {/* Weather Card */}
          <div className="card" style={{ background: 'var(--gradient-3)', border: 'none' }}>
            <div style={{ padding: 22, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
                Weather & Environment
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 40 }}>⛅</div>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>31°C</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{user?.village || 'Anaimalai'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, opacity: 0.85 }}><CloudRain size={13} /> 65%</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, opacity: 0.85 }}><Wind size={13} /> 14 km/h</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, opacity: 0.85 }}><Thermometer size={13} /> 28°C feel</div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card">
            <div className="card-header">
              <span className="card-title"><MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />Your Location</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{user?.village || 'Anaimalai'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.taluk} Taluk, {user?.district} District</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Jurisdiction: 12 wards · 3,200 households</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

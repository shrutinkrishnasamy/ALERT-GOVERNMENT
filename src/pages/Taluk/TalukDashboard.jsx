import { useAuth } from '../../context/AuthContext';
import { INCIDENTS } from '../../data/mockData';
import { CheckSquare, AlertTriangle, ArrowRight, Clock, Shield, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GradientCard = ({ gradient, icon, label, value, sub }) => (
  <div className="gradient-stat-card" style={{ background: gradient }}>
    <div className="stat-icon-wrapper">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const SevBadge = ({ severity }) => {
  const c = severity === 'Low' ? 'green' : severity === 'Medium' ? 'orange' : 'red';
  return <span className={`badge badge-${c}`}><AlertTriangle size={10} /> {severity}</span>;
};

export default function TalukDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pending = INCIDENTS.filter(i => i.status === 'Waiting for Taluk');
  const verified = INCIDENTS.filter(i => i.talukofficerVerifiedAt);
  const critical = pending.filter(i => ['Severe', 'Extremely Severe'].includes(i.severity));

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Taluk Command Center</div>
          <div className="page-subtitle">{user?.taluk} Taluk, {user?.district} District</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/taluk/verification')}>
            <CheckSquare size={14} /> Verify Queue
            {pending.length > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 999, padding: '1px 7px', fontSize: 10, fontWeight: 800 }}>{pending.length}</span>}
          </button>
        </div>
      </div>

      {/* Gradient Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <GradientCard gradient={pending.length > 0 ? 'var(--gradient-5)' : 'var(--gradient-4)'}
          icon={<Clock size={20} />} label="Pending Verification" value={pending.length}
          sub={pending.length > 0 ? 'Needs your action' : 'All verified!'} />
        <GradientCard gradient="var(--gradient-success)" icon={<CheckSquare size={20} />}
          label="Verified Today" value={verified.length} sub="Forwarded to District" />
        <GradientCard gradient={critical.length > 0 ? 'var(--gradient-danger)' : 'var(--gradient-4)'}
          icon={<AlertTriangle size={20} />} label="Critical Unverified" value={critical.length}
          sub={critical.length > 0 ? 'Urgent attention' : 'None pending'} />
      </div>

      {/* Main Grid */}
      <div className="grid-2">
        {/* Verification Queue */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pending.length > 0 ? 'var(--severity-medium)' : 'var(--severity-low)' }} className="pulse" />
              <span className="card-title">Priority Verification Queue</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/taluk/verification')}>View All</button>
          </div>
          <div>
            {pending.length === 0 ? (
              <div style={{ padding: 36, textAlign: 'center' }}>
                <Shield size={32} color="var(--severity-low)" style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--severity-low)' }}>Queue is empty!</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Great job — all incidents verified.</div>
              </div>
            ) : pending.map(inc => (
              <div key={inc.id} className="list-row">
                <div className="list-row-icon" style={{ background: 'var(--severity-medium-bg)', color: 'var(--severity-medium)' }}>
                  <Clock size={18} />
                </div>
                <div className="list-row-content">
                  <div className="list-row-title">{inc.title}</div>
                  <div className="list-row-meta">
                    <span className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 11 }}>{inc.id}</span>
                    <span><MapPin size={10} style={{ display: 'inline', marginRight: 2 }} />{inc.village}</span>
                  </div>
                </div>
                <SevBadge severity={inc.severity} />
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/taluk/verification')}>
                  Verify <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Verified */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Recently Verified</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/taluk/reports')}>Reports</button>
          </div>
          <div>
            {verified.length === 0 ? (
              <div style={{ padding: 36, textAlign: 'center', color: 'var(--text-muted)' }}>No verified incidents yet.</div>
            ) : verified.slice(0, 5).map(inc => (
              <div key={inc.id} className="list-row">
                <div className="list-row-icon" style={{ background: 'var(--severity-low-bg)', color: 'var(--severity-low)' }}>
                  <CheckSquare size={18} />
                </div>
                <div className="list-row-content">
                  <div className="list-row-title">{inc.title}</div>
                  <div className="list-row-meta">
                    <span className="font-mono" style={{ fontSize: 11 }}>{inc.id}</span>
                    <span>Verified {new Date(inc.talukofficerVerifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <span className="badge badge-green">Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

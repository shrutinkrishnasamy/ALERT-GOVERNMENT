
import { useAuth } from '../../context/AuthContext';
import { useLive, useIncidents } from '../../context/LiveContext';
import { RESOURCES, ANALYTICS_DATA } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Clock, Truck, AlertTriangle, Users, ArrowRight, Activity, MapPin, CheckCircle, ChevronRight, Zap, Cpu, Radio, FileText, Inbox, ClipboardList, Flame } from 'lucide-react';

const GradientCard = ({ gradient, icon, label, value, sub }) => (
  <div className="gradient-stat-card" style={{ background: gradient }}>
    <div className="stat-icon-wrapper">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const SevBadge = ({ severity }) => {
  const map = {
    'Low': { bg: 'var(--severity-low-bg)', c: 'var(--severity-low)' },
    'Medium': { bg: 'var(--severity-medium-bg)', c: 'var(--severity-medium)' },
    'High': { bg: 'var(--severity-high-bg)', c: 'var(--severity-high)' },
    'Severe': { bg: 'var(--severity-severe-bg)', c: 'var(--severity-severe)' },
    'Extremely Severe': { bg: 'var(--severity-extreme-bg)', c: 'var(--severity-extreme)' },
  };
  const s = map[severity] || map['Low'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, color: s.c,
      padding: '4px 12px', borderRadius: 999,
      fontSize: 11, fontWeight: 700,
    }}>
      <AlertTriangle size={10} /> {severity}
    </span>
  );
};

export default function DistrictDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const myIncidents = useIncidents();

  const active = myIncidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed');
  const queue = myIncidents.filter(i => i.status === 'Taluk Verified' || i.status === 'Waiting for Collector');
  const critical = myIncidents.filter(i => ['Severe', 'Extremely Severe'].includes(i.severity));
  const liveOps = myIncidents.filter(i => ['Waiting for Collector', 'District Coordinated'].includes(i.status));
  const totalDeployed = Object.values(RESOURCES).flat().filter(r => r.status === 'Deployed' || r.status === 'En Route').length;
  const totalAtRisk = active.reduce((a, i) => a + (i.populationAtRisk || 0), 0);

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">EOC Dashboard</div>
          <div className="page-subtitle">{user?.district} District · Emergency Operations Center</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/district/analytics')}>
            <Activity size={14} /> Analytics
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/district/approval-queue')}>
            <Inbox size={14} /> Action Queue
            {queue.length > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 999, padding: '1px 7px', fontSize: 10, fontWeight: 800 }}>{queue.length}</span>}
          </button>
        </div>
      </div>

      {/* Gradient Stat Cards */}
      <div className="stat-grid">
        <GradientCard gradient="var(--gradient-1)" icon={<ShieldAlert size={20} />}
          label="Active Emergencies" value={active.length} sub="Live incidents across district" />
        <GradientCard gradient="var(--gradient-5)" icon={<Clock size={20} />}
          label="Pending Queue" value={queue.length} sub={queue.length > 0 ? 'Requires coordination' : 'All clear'} />
        <GradientCard gradient="var(--gradient-3)" icon={<Truck size={20} />}
          label="Resources Deployed" value={totalDeployed} sub="Units active in field" />
        <GradientCard gradient="var(--gradient-4)" icon={<Users size={20} />}
          label="People at Risk" value={totalAtRisk.toLocaleString('en-IN')} sub={`Across ${active.length} incidents`} />
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 20 }}>

        {/* Left: Approval Queue + Live Emergencies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Approval Queue */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--severity-medium)' }} className="pulse" />
                <span className="card-title">Action Required — Approval Queue</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/district/approval-queue')}>
                View All <ChevronRight size={12} />
              </button>
            </div>
            <div>
              {queue.length === 0 ? (
                <div style={{ padding: '36px 22px', textAlign: 'center' }}>
                  <CheckCircle size={32} color="var(--severity-low)" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>Queue is clear — no pending items</div>
                </div>
              ) : queue.map(inc => (
                <div key={inc.id} className="list-row">
                  <div className="list-row-icon" style={{ background: 'var(--severity-medium-bg)', color: 'var(--severity-medium)' }}>
                    <ShieldAlert size={18} />
                  </div>
                  <div className="list-row-content">
                    <div className="list-row-title">{inc.title}</div>
                    <div className="list-row-meta">
                      <span className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 11 }}>{inc.id}</span>
                      <span><MapPin size={10} style={{ display: 'inline', marginRight: 2 }} />{inc.taluk}</span>
                    </div>
                  </div>
                  <SevBadge severity={inc.severity} />
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/district/approval-queue')}>
                    Coordinate <ArrowRight size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Emergencies */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--severity-severe)' }} className="pulse" />
                <span className="card-title">Live Active Emergencies</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/district/active-emergencies')}>
                Map View <ChevronRight size={12} />
              </button>
            </div>
            <div>
              {liveOps.map(inc => (
                <div key={inc.id} className="list-row">
                  <div className="list-row-icon" style={{ background: 'var(--severity-severe-bg)', color: 'var(--severity-severe)' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className="list-row-content">
                    <div className="list-row-title">{inc.title}</div>
                    <div className="list-row-meta">
                      <span className="font-mono" style={{ fontSize: 11 }}>{inc.id}</span>
                      <span className="badge badge-green" style={{ fontSize: 10 }}>{inc.status}</span>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/district/resource-command')}>
                    <Truck size={12} /> Resources
                  </button>
                </div>
              ))}
              {liveOps.length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No active live operations.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* District Health Score */}
          <div className="card" style={{ background: 'var(--gradient-primary)', border: 'none' }}>
            <div style={{ padding: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: 1.2, opacity: 0.65, marginBottom: 14, textTransform: 'uppercase' }}>
                <Activity size={12} /> District Health Score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>74</div>
                <div style={{ fontSize: 16, opacity: 0.6 }}>/ 100</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', height: 8, borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ width: '74%', height: '100%', background: '#FCD34D', borderRadius: 999, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.6 }}>
                Status: <strong style={{ color: '#FCD34D' }}>ELEVATED RISK</strong><br />
                INC-2024-001 driving risk score down.
              </div>
            </div>
          </div>

          {/* Incident Summary Bar Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Weekly Summary</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>This week</span>
            </div>
            <div style={{ padding: 20 }}>
              <div className="mini-chart">
                {ANALYTICS_DATA.incidentsByDay.map((d, i) => (
                  <div key={d.day} className={`mini-chart-bar${i === 3 ? ' active' : ''}`}
                    style={{ height: `${(d.incidents / 8) * 100}%` }}
                    title={`${d.day}: ${d.incidents} incidents`} />
                ))}
              </div>
              <div className="mini-chart-labels">
                {ANALYTICS_DATA.incidentsByDay.map(d => <span key={d.day}>{d.day}</span>)}
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Total</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
                    {ANALYTICS_DATA.incidentsByDay.reduce((a, d) => a + d.incidents, 0)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Avg/Day</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)' }}>
                    {(ANALYTICS_DATA.incidentsByDay.reduce((a, d) => a + d.incidents, 0) / 7).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Removed Quick Actions */}
        </div>
      </div>

    </div>
  );
}

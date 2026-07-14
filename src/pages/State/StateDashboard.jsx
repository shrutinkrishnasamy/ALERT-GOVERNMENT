import { useAuth } from '../../context/AuthContext';
import { INCIDENTS, DISTRICTS } from '../../data/mockData';
import { ShieldAlert, Map, BarChart2, Brain, Inbox, Activity, ChevronRight, AlertTriangle, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GISMap from '../../components/Map/GISMap';

const GradientCard = ({ gradient, icon, label, value, sub }) => (
  <div className="gradient-stat-card" style={{ background: gradient }}>
    <div className="stat-icon-wrapper">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const districtColors = { Green: 'var(--severity-low)', Yellow: 'var(--severity-medium)', Red: 'var(--severity-severe)' };

export default function StateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalActive = DISTRICTS.reduce((a, d) => a + d.activeIncidents, 0);
  const totalCritical = DISTRICTS.reduce((a, d) => a + d.criticalIncidents, 0);
  const alertedDistricts = DISTRICTS.filter(d => d.healthScore !== 'Green').length;

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">State Command Center</div>
          <div className="page-subtitle">Chief Secretary Dashboard · Tamil Nadu</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/state/prediction')}>
            <Brain size={14} /> AI Prediction
          </button>
        </div>
      </div>

      {/* Gradient Stats */}
      <div className="stat-grid">
        <GradientCard gradient="var(--gradient-5)" icon={<ShieldAlert size={20} />}
          label="Districts Alerted" value={alertedDistricts} sub={`of ${DISTRICTS.length} total`} />
        <GradientCard gradient="var(--gradient-danger)" icon={<AlertTriangle size={20} />}
          label="Critical Incidents" value={totalCritical} sub="Across all districts" />
        <GradientCard gradient="var(--gradient-6)" icon={<Users size={20} />}
          label="State NDRF Deployed" value="2" sub="Teams in field" />
        <GradientCard gradient="var(--gradient-1)" icon={<Activity size={20} />}
          label="Overall Risk" value="Moderate" sub="1 district elevated" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Embedded State Map */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">State Heatmap</span>
            </div>
            <div style={{ padding: 0 }}>
              <GISMap center={[11.1271, 78.6569]} zoom={6} height={400} incidents={INCIDENTS} />
            </div>
          </div>

          {/* Collector Escalations */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Escalations from Collectors</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/state/requests')}>Manage <ChevronRight size={12} /></button>
            </div>
            <div style={{ padding: 36, textAlign: 'center' }}>
              <Inbox size={36} color="var(--text-muted)" style={{ marginBottom: 10, opacity: 0.4 }} />
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>No pending state-level requests or fund allocations.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

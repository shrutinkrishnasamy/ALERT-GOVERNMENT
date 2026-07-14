import React from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, Info, ShieldAlert, XCircle, 
  Flame, Droplets, Wind, Zap, Plus, ChevronRight, Activity, Cpu, Bot
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './UIComponents.css'; 

// AI Daily Brief Banner
export const AIBriefBanner = ({ title, activeCount, criticalCount, recommendations, tags }) => (
  <div className="ai-brief-banner">
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="ai-brief-header">
        <Cpu size={14} /> AI DAILY BRIEF
      </div>
      <div className="ai-brief-title">{title}</div>
      <div className="ai-brief-text">
        You have <strong>{activeCount} active incidents</strong> today · <strong>{criticalCount} critical</strong> escalated to Collector · AI Recommendation: <em>{recommendations}</em>
      </div>
      {tags && (
        <div className="ai-brief-tags">
          {tags.map((t, i) => <span key={i} className="ai-brief-tag">{t}</span>)}
        </div>
      )}
    </div>
  </div>
);

// Stat Card (flat with bottom accent)
export const StatCard = ({ label, value, color = 'primary', icon, change }) => (
  <div className={`stat-card border-${color}`}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className={`stat-icon-wrapper bg-${color}-alpha`}>
        {icon}
      </div>
    </div>
    {change && (
      <div className={`stat-change text-${color}`}>
        <Activity size={12} style={{ display: 'inline', marginRight: '4px' }} />
        {change}
      </div>
    )}
  </div>
);

// Card container
export const Card = ({ title, children, action, className = '', style = {} }) => (
  <div className={`card ${className}`} style={style}>
    {title && (
      <div className="card-header">
        <div className="card-title">{title}</div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="card-body">
      {children}
    </div>
  </div>
);

// Severity Badge
export const SeverityBadge = ({ severity }) => {
  const colorMap = {
    'Low': 'green', 'Medium': 'orange', 'High': 'orange', 'Severe': 'red', 'Extremely Severe': 'red'
  };
  const c = colorMap[severity] || 'gray';
  return (
    <span className={`badge badge-${c}`}>
      <AlertTriangle size={11} /> {severity}
    </span>
  );
};

// Status Badge
export const StatusBadge = ({ status }) => (
  <span className="badge badge-gray">
    <Clock size={11} /> {status}
  </span>
);

// Category Badge
export const CategoryBadge = ({ category }) => {
  const getIcon = () => {
    if(category?.includes('Fire')) return <Flame size={11}/>;
    if(category?.includes('Flood')) return <Droplets size={11}/>;
    if(category?.includes('Cyclone')) return <Wind size={11}/>;
    return <AlertTriangle size={11}/>;
  };
  return (
    <span className="badge badge-blue">
      {getIcon()} {category}
    </span>
  );
};

// AI Panel
export const AIPanel = ({ title = "AI Analysis", summary, recommendation, loading = false, confidence = null, action = null }) => {
  const data = [
    { name: 'Confidence', value: confidence || 0 },
    { name: 'Remaining', value: 100 - (confidence || 0) },
  ];
  
  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className={`ai-icon-container ${loading ? 'ai-scanning' : ''}`}>
            <Cpu size={16} color="var(--primary)" />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '0.5px' }}>{title.toUpperCase()}</span>
        </div>
        {!loading && <div className="ai-badge">AI Confirmed</div>}
      </div>
      
      <div className="ai-panel-body" style={{ display: 'flex', gap: '20px' }}>
        {loading ? (
          <div className="ai-loading-state" style={{ width: '100%' }}>
            <div className="scan-line"></div>
            <p>Processing data streams...</p>
          </div>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom: '12px' }}>{summary}</p>
              {recommendation && (
                <div className="ai-recommendation" style={{ marginBottom: action ? '16px' : '0' }}>
                  <span className="rec-label"><Zap size={12} /> RECOMMENDATION:</span> {recommendation}
                </div>
              )}
              {action && <div>{action}</div>}
            </div>
            {confidence !== null && (
              <div style={{ width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={45}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell key="cell-0" fill="var(--primary)" />
                        <Cell key="cell-1" fill="var(--border)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)'
                  }}>
                    {confidence}%
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>CONFIDENCE</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Timeline
export const Timeline = ({ events }) => (
  <div className="timeline-container">
    {events.map((ev, i) => (
      <div key={i} className="timeline-item">
        <div className="timeline-dot"></div>
        <div className="timeline-content">
          <div className="timeline-time">{new Date(ev.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          <div className="timeline-title">{ev.title}</div>
          {ev.desc && <div className="timeline-desc">{ev.desc}</div>}
        </div>
      </div>
    ))}
  </div>
);

// Alert Banner
export const AlertBanner = ({ type = 'info', children, icon }) => {
  const colors = {
    info: 'var(--primary)', success: 'var(--severity-low)',
    warning: 'var(--severity-high)', critical: 'var(--severity-extreme)'
  };
  const bg = colors[type];
  return (
    <div style={{ 
      display: 'flex', gap: '12px', alignItems: 'center', 
      padding: '16px 20px', borderRadius: 'var(--radius-md)', 
      background: `${bg}10`, border: `1px solid ${bg}30`,
      color: bg, marginBottom: '20px'
    }}>
      <div style={{ fontSize: '20px' }}>{icon || <Info size={20} />}</div>
      <div style={{ fontSize: '14px', lineHeight: 1.5, fontWeight: 500 }}>{children}</div>
    </div>
  );
};

// Department Update
export const DeptUpdate = ({ icon, dept, time, message }) => (
  <div style={{ display: 'flex', gap: '12px', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
    <div style={{ fontSize: '18px', color: 'var(--primary)' }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{dept}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{time}</span>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{message}</div>
    </div>
  </div>
);

// Modal
export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><XCircle size={18} /></button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

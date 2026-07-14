import { useState } from 'react';
import { NOTIFICATIONS } from '../../data/mockData';
import { Bell, Clock, CheckCircle, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DistrictNotifications() {
  const [filter, setFilter] = useState('all');
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.type === 'critical';
    return true;
  });

  const getIcon = (type) => {
    switch(type) {
      case 'critical': return <ShieldAlert size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} />;
      case 'warning': return <AlertTriangle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} />;
      case 'success': return <CheckCircle size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} />;
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div className="page-title">🔔 District EOC Notifications</div>
          <div className="page-subtitle">Alerts, updates, and system messages</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setNotifs(ns => ns.map(n => ({ ...n, read: true })))}><CheckCircle size={14} /> Mark all read</button>
          <button className="btn btn-ghost btn-sm text-danger" onClick={() => setNotifs([])}><Trash2 size={14} /> Clear all</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ background: 'var(--bg-muted)' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['all', 'unread', 'critical'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ textTransform: 'capitalize' }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No notifications found.</div>
          ) : (
            filtered.map(n => (
              <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`} style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '20px' }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {n.time}
                  </div>
                </div>
                {!n.read && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { INCIDENTS } from '../../data/mockData';
import { SeverityBadge, StatusBadge, CategoryBadge, Timeline, AIPanel, Modal } from '../../components/common/UIComponents';
import { Search, Filter, MapPin, Clock, Eye, ClipboardList } from 'lucide-react';

export default function ActiveIncidents() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = INCIDENTS.filter(i =>
    (filter === 'All' || i.severity === filter || i.status === filter) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><ClipboardList size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Active Incidents</div>
          <div className="page-subtitle">All incidents you've reported — track real-time status</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'High', 'Severe', 'Extremely Severe'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: '16px', maxWidth: '100%' }}>
        <Search size={14} color="var(--text-muted)" />
        <input placeholder="Search by incident ID, title, location..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Location</th>
                <th>Reported At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inc => (
                <tr key={inc.id}>
                  <td><span className="font-mono text-primary" style={{ fontSize: '12px', fontWeight: 600 }}>{inc.id}</span></td>
                  <td><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inc.title}</span></td>
                  <td><CategoryBadge category={inc.category} /></td>
                  <td><SeverityBadge severity={inc.severity} /></td>
                  <td><StatusBadge status={inc.status} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <MapPin size={10} /> {inc.location.address.split(',')[0]}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      <Clock size={10} /> {new Date(inc.reportedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(inc)}>
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <SeverityBadge severity={selected.severity} />
              <StatusBadge status={selected.status} />
              <CategoryBadge category={selected.category} />
              <span className="badge badge-gray font-mono">{selected.id}</span>
            </div>

            <AIPanel summary={selected.aiSummary} recommendation={selected.aiRecommendation} />

            <div className="grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <div className="section-title"><MapPin size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Location</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{selected.location.address}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {selected.location.lat}, {selected.location.lng}
                </p>
              </div>
              <div>
                <div className="section-title">👥 Population at Risk</div>
                <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--severity-severe)' }}>{selected.populationAtRisk?.toLocaleString()}</p>
              </div>
            </div>

            <div className="section-title">📅 Status Timeline</div>
            <Timeline events={selected.timeline} />
          </div>
        )}
      </Modal>
    </div>
  );
}

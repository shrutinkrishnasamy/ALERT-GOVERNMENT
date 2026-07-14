import { useState } from 'react';
import { INCIDENTS } from '../../data/mockData';
import { SeverityBadge, StatusBadge, CategoryBadge, Timeline, Modal, AIPanel } from '../../components/common/UIComponents';
import { Search, Eye, MapPin, Clock, ClipboardList } from 'lucide-react';

export default function TalukActiveIncidents() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  // In a real app, this would filter by the user's taluk. Using all mocked incidents for demo.
  const filtered = INCIDENTS.filter(i =>
    (filter === 'All' || i.severity === filter || i.status === filter) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><ClipboardList size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Active Incidents — Taluk</div>
          <div className="page-subtitle">Monitor ongoing emergencies in your jurisdiction</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Waiting for Taluk', 'District Coordinated'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="search-bar" style={{ marginBottom: '16px', maxWidth: '100%' }}>
        <Search size={14} color="var(--text-muted)" />
        <input placeholder="Search incidents..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
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

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title}>
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <SeverityBadge severity={selected.severity} />
              <StatusBadge status={selected.status} />
              <CategoryBadge category={selected.category} />
            </div>
            <AIPanel summary={selected.aiSummary} />
            <div className="section-title">Timeline</div>
            <Timeline events={selected.timeline} />
          </div>
        )}
      </Modal>
    </div>
  );
}

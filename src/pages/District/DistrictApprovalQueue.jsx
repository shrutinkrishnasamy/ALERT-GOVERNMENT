import { useState } from 'react';
import { useIncidents } from '../../context/LiveContext';
import { Card, SeverityBadge, StatusBadge, CategoryBadge, AIPanel } from '../../components/common/UIComponents';
import { CheckCircle, AlertTriangle, ArrowRight, ShieldAlert, Truck, Radio, Bot, Zap, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function DistrictApprovalQueue() {
  const navigate = useNavigate();
  const myIncidents = useIncidents();
  const queue = myIncidents.filter(i => i.status === 'Taluk Verified' || i.status === 'Waiting for Collector');
  const [selectedId, setSelectedId] = useState(queue[0]?.id);
  
  const inc = queue.find(i => i.id === selectedId) || queue[0];
  const selectedIdx = queue.findIndex(i => i.id === inc?.id);

  const handleAction = (action) => {
    if (action === 'coordinate') {
      navigate('/district/resource-command');
    } else if (action === 'escalate') {
      Swal.fire('Escalated', 'Drafted Broadcast & Resources. Forwarded to Collector for Final Approval.', 'success').then(() => {
        if (selectedIdx < queue.length - 1) setSelectedIdx(s => s + 1);
        else navigate('/district');
      });
    }
  };

  if (!inc) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <CheckCircle size={48} color="var(--severity-low)" style={{ marginBottom: '16px' }} />
        <h2>Queue Empty</h2>
        <p>No incidents are waiting for District Coordination right now.</p>
      </div>
    );
  }

  const isSevere = ['High', 'Severe', 'Extremely Severe'].includes(inc.severity);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><ClipboardList size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> District Approval Queue</div>
          <div className="page-subtitle">Coordinate resources and broadcasts for Taluk-verified incidents</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Queue: {selectedIdx + 1} of {queue.length}
          </span>
        </div>
      </div>

      <div className="grid-3">
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>{inc.title}</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="font-mono badge badge-gray">{inc.id}</span>
                  <CategoryBadge category={inc.category} />
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', background: 'var(--bg-muted)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div className="text-xs text-muted font-bold text-uppercase">Reported By</div>
                <div className="text-sm font-bold">{inc.reportedBy} (Village)</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                <div className="text-xs text-muted font-bold text-uppercase">Verified By</div>
                <div className="text-sm font-bold" style={{ color: 'var(--primary)' }}>TAL2104 (Taluk)</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
                <div className="text-xs text-muted font-bold text-uppercase">Taluk Note</div>
                <div className="text-sm">"{inc.talukofficerNote || 'Verified authentic.'}"</div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{inc.description}</p>
          </Card>

          <Card title={<><Bot size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> AI Escalation Recommendation</>}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: isSevere ? 'var(--severity-severe)' : 'var(--severity-low)', marginBottom: '8px' }}>
                  {isSevere ? 'Collector Approval Required' : 'District Level Approval Permitted'}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {isSevere
                    ? "Due to high severity, chemical proximity, and high population risk, this incident cannot be broadcasted without the District Collector's executive approval. Prepare the resource plan and draft broadcast, then forward."
                    : "Low severity incident. District EOC is authorized to approve cell broadcasts and assign resources directly without Collector escalation."}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title={<><Zap size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Required Actions</>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn btn-primary" style={{ justifyContent: 'space-between' }} onClick={() => handleAction('coordinate')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={16} /> 1. Assign Resources</span>
                <ArrowRight size={14} />
              </button>

              <button className="btn btn-primary" style={{ justifyContent: 'space-between' }} onClick={() => navigate('/district/alert-broadcast')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Radio size={16} /> 2. Prepare Broadcast</span>
                <ArrowRight size={14} />
              </button>

              <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

              {isSevere ? (
                <button className="btn btn-warning" style={{ justifyContent: 'center' }} onClick={() => handleAction('escalate')}>
                  <ShieldAlert size={16} /> Forward to Collector
                </button>
              ) : (
                <button className="btn btn-success" style={{ justifyContent: 'center' }} onClick={() => Swal.fire('Deployed!', 'Broadcast & Resources Deployed!', 'success')}>
                  <CheckCircle size={16} /> Approve & Deploy Directly
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

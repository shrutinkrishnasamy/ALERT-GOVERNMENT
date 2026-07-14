import { useState, useEffect } from 'react';
import { INCIDENTS } from '../../data/mockData';
import { Card, AIPanel } from '../../components/common/UIComponents';
import GISMap from '../../components/Map/GISMap';
import { CheckCircle, XCircle, Megaphone, Smartphone, Radio, AlertTriangle, ShieldCheck, Activity, Loader, ChevronRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function BroadcastApproval() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');

  // Trigger re-render when mutating INCIDENTS
  const [tick, setTick] = useState(0);
  
  // Find all incidents in the broadcast queue
  const queue = INCIDENTS.filter(i => ['Pending Dispatch', 'Dispatching', 'Live'].includes(i.broadcastStatus));
  
  // If no selectedId but queue has items, select the first one
  useEffect(() => {
    if (!selectedId && queue.length > 0) {
      setSearchParams({ id: queue[0].id });
    }
  }, [selectedId, queue, setSearchParams]);

  const inc = queue.find(i => i.id === selectedId) || queue[0];

  const draft = inc?.broadcastDraft || {
    radius: 5,
    languages: ['Tamil', 'English'],
    type: 'Evacuation',
    radioScript: 'Draft script not found.',
    towersAffected: 12,
    estimatedDevices: 34200,
    populationCovered: 42000,
  };

  const [script, setScript] = useState(draft.radioScript);
  const [dispatchStep, setDispatchStep] = useState(0);

  // Update script if incident changes
  useEffect(() => {
    setScript(draft.radioScript);
  }, [inc]);

  const startDispatch = () => {
    if (inc) {
      inc.broadcastStatus = 'Dispatching';
      setDispatchStep(0);
      setTick(t => t + 1);
    }
  };

  useEffect(() => {
    if (inc?.broadcastStatus === 'Dispatching') {
      const steps = [
        { delay: 1000 }, // Connecting to DoT
        { delay: 1500 }, // Authorizing
        { delay: 2000 }, // Initiating
      ];
      
      let timeout;
      if (dispatchStep < 3) {
        timeout = setTimeout(() => {
          setDispatchStep(prev => prev + 1);
        }, steps[dispatchStep].delay);
      } else {
        timeout = setTimeout(() => {
          inc.broadcastStatus = 'Live';
          setTick(t => t + 1);
        }, 500);
      }
      return () => clearTimeout(timeout);
    }
  }, [inc?.broadcastStatus, dispatchStep, inc]);

  if (queue.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <CheckCircle size={48} color="var(--severity-low)" style={{ marginBottom: '16px' }} />
        <h2>Broadcast Queue Empty</h2>
        <p>No incidents have been approved for broadcast yet.</p>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/collector')}>Go to Dashboard</button>
      </div>
    );
  }

  const renderDetail = () => {
    if (!inc) return <div>Select an incident</div>;

    if (inc.broadcastStatus === 'Dispatching') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <Card style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '18px', fontWeight: 800 }}>Dispatching to DoT...</h3>
            
            <div className={`dispatch-step ${dispatchStep === 0 ? 'active' : dispatchStep > 0 ? 'completed' : ''}`}>
              {dispatchStep > 0 ? <CheckCircle size={20} color="var(--severity-low)" /> : <Loader size={20} className={dispatchStep === 0 ? 'spinner text-primary' : 'text-muted'} />}
              <span style={{ fontSize: '14px', fontWeight: dispatchStep === 0 ? 700 : 500 }}>1. Connecting to DoT Gateway</span>
            </div>
            
            <div className={`dispatch-step ${dispatchStep === 1 ? 'active' : dispatchStep > 1 ? 'completed' : ''}`}>
              {dispatchStep > 1 ? <CheckCircle size={20} color="var(--severity-low)" /> : <Loader size={20} className={dispatchStep === 1 ? 'spinner text-primary' : 'text-muted'} />}
              <span style={{ fontSize: '14px', fontWeight: dispatchStep === 1 ? 700 : 500 }}>2. Authorizing Digital Signature</span>
            </div>
            
            <div className={`dispatch-step ${dispatchStep === 2 ? 'active' : dispatchStep > 2 ? 'completed' : ''}`}>
              {dispatchStep > 2 ? <CheckCircle size={20} color="var(--severity-low)" /> : <Loader size={20} className={dispatchStep === 2 ? 'spinner text-primary' : 'text-muted'} />}
              <span style={{ fontSize: '14px', fontWeight: dispatchStep === 2 ? 700 : 500 }}>3. Initiating Cell Broadcast Protocol</span>
            </div>
          </Card>
        </div>
      );
    }

    if (inc.broadcastStatus === 'Live') {
      return (
        <div className="animate-in">
          <div className="live-broadcasting-banner" style={{ marginBottom: '24px' }}>
            <Radio className="pulse" size={20} /> LIVE BROADCASTING IN PROGRESS
          </div>

          <div className="grid-3" style={{ marginBottom: '24px' }}>
            <div className="stat-card border-danger">
              <div className="stat-label">Towers Pinging</div>
              <div className="stat-value text-danger">{draft.towersAffected}</div>
              <div className="stat-change text-muted">Across {draft.radius}km radius</div>
            </div>
            <div className="stat-card border-primary">
              <div className="stat-label">Devices Reached</div>
              <div className="stat-value">~{draft.estimatedDevices.toLocaleString()}</div>
              <div className="stat-change text-primary"><Activity size={14}/> +1,240 in last minute</div>
            </div>
            <div className="stat-card border-success">
              <div className="stat-label">Dispatch Status</div>
              <div className="stat-value text-success">Verified</div>
              <div className="stat-change text-success"><ShieldCheck size={14}/> DoT Acknowledgement Received</div>
            </div>
          </div>

          <Card title="Live Coverage Map">
             <div style={{ padding: 0 }}>
               <GISMap 
                 center={[inc.location.lat, inc.location.lng]} 
                 zoom={12} 
                 height={400} 
                 incidents={[inc]} 
                 showRadius={true} 
                 radiusKm={draft.radius} 
                 activeBroadcasts={[inc.id]} 
               />
             </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="animate-in">
        <div className="grid-2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card title="Broadcast Parameters (Set by District EOC)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Alert Type</span>
                  <strong style={{ color: 'var(--severity-severe)' }}>{draft.type}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Target Radius</span>
                  <strong>{draft.radius} km</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Languages</span>
                  <strong>{draft.languages.join(', ')}</strong>
                </div>
              </div>
            </Card>

            <AIPanel
              title="AI Radio Script Review"
              summary="The current script accurately reflects the severity. The wording is authoritative and clear."
              recommendation="AI suggests adding: 'Avoid NH-544 completely' due to recent police roadblocks."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card title="Review Broadcast Content">
              <textarea className="form-textarea" rows={6} value={script} onChange={e => setScript(e.target.value)} style={{ fontSize: '14px', lineHeight: 1.6 }} />
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="var(--severity-severe)" /> This triggers live DoT broadcasts.
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-danger btn-lg" onClick={startDispatch}>
                  <Megaphone size={16} /> Approve & Dispatch Now
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Card title="Target Area" style={{ marginTop: '16px' }}>
          <div style={{ padding: 0 }}>
            <GISMap center={[inc.location.lat, inc.location.lng]} zoom={12} height={240} incidents={[inc]} showRadius={true} radiusKm={draft.radius} />
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><Radio size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Broadcast Dashboard</div>
          <div className="page-subtitle">Manage and monitor live public emergency alerts</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Broadcast Queue</h3>
          {queue.map(q => (
            <div 
              key={q.id} 
              onClick={() => setSearchParams({ id: q.id })}
              style={{ 
                padding: '12px 16px', 
                background: selectedId === q.id ? 'var(--primary-light)' : 'var(--bg-surface)',
                border: `1px solid ${selectedId === q.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: selectedId === q.id ? 'var(--primary)' : 'var(--text-primary)', marginBottom: '4px' }}>{q.id}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {q.broadcastStatus === 'Live' ? <span style={{ color: 'var(--severity-severe)', fontWeight: 700 }}>● Live</span> : 
                   q.broadcastStatus === 'Dispatching' ? <span style={{ color: 'var(--severity-medium)', fontWeight: 700 }}>Dispatching...</span> : 
                   'Pending Dispatch'}
                </div>
              </div>
              <ChevronRight size={16} color={selectedId === q.id ? 'var(--primary)' : 'var(--text-muted)'} />
            </div>
          ))}
        </div>

        {/* Detail View */}
        <div>
          {renderDetail()}
        </div>
      </div>
    </div>
  );
}

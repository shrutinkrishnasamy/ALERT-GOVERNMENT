import { useState } from 'react';
import { RESOURCES } from '../../data/mockData';
import { useLive, useIncidents } from '../../context/LiveContext';
import { Card, SeverityBadge, AIPanel, AlertBanner } from '../../components/common/UIComponents';
import GISMap from '../../components/Map/GISMap';
import { Truck, Search, Plus, MapPin, Navigation } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ResourceCommand() {
  const myIncidents = useIncidents();
  const [selectedInc, setSelectedInc] = useState(null);
  const [renderTick, setRenderTick] = useState(0);
  
  const inc = myIncidents.find(i => i.id === selectedInc) || myIncidents[0];

  const assigned = inc.resources || [];
  const availableFire = RESOURCES.fireTrucks.filter(r => r.status === 'Available');
  const availablePolice = RESOURCES.policeUnits.filter(r => r.status === 'Available');

  const handleAssign = (unit, type) => {
    const personnel = type === 'Fire Truck' ? ['Ramesh Kumar', 'Arjun Singh', 'Mani', 'Velu', 'Kannan'] : 
                      type === 'Ambulance' ? ['Dr. Priya', 'Dr. Ravi', 'Dr. Senthil'] : 
                      ['SI Arjun', 'SI Kumar', 'Constable Vijay', 'Inspector Raj'];
                      
    const optionsHtml = personnel.map(p => `<option value="${p}">${p}</option>`).join('');

    Swal.fire({
      title: `Deploy ${type}`,
      html: `
        <div style="text-align: left; margin-top: 10px;">
          <p style="margin-bottom: 16px; color: var(--text-muted);"><strong>Unit:</strong> <span class="font-mono text-primary" style="font-weight:bold;">${unit.vehicleNo}</span> (${unit.station})</p>
          <label style="font-size: 12px; font-weight: 700; margin-bottom: 6px; display: block; text-transform: uppercase;">Assign Officer / Driver</label>
          <select id="personnel-select" style="width: 100%; margin-bottom: 16px; padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-surface); color: var(--text-primary);">
            ${optionsHtml}
          </select>
          <label style="font-size: 12px; font-weight: 700; margin-bottom: 6px; display: block; text-transform: uppercase;">Estimated Time of Arrival (mins)</label>
          <input type="number" id="eta-input" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-surface); color: var(--text-primary);" value="${Math.floor(Math.random() * 10) + 5}" min="1" max="60" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Deployment',
      confirmButtonColor: 'var(--primary)',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          personnel: document.getElementById('personnel-select').value,
          eta: parseInt(document.getElementById('eta-input').value, 10)
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        unit.status = 'Deployed'; // remove from available list
        
        if (!inc.resources) inc.resources = [];
        inc.resources.push({
          type,
          id: unit.id,
          vehicleNo: unit.vehicleNo,
          officer: result.value.personnel,
          status: 'En Route',
          eta: result.value.eta,
          lat: inc.location.lat - (Math.random() * 0.05 + 0.02),
          lng: inc.location.lng - (Math.random() * 0.05 + 0.02)
        });

        setRenderTick(t => t + 1); // trigger instant re-render to update lists

        Swal.fire({
          icon: 'success',
          title: 'Deployed!',
          html: `<b>${unit.vehicleNo}</b> is now en route with ${result.value.personnel}.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><Truck size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Resource Command Center</div>
          <div className="page-subtitle">Assign, track, and manage field units per incident</div>
        </div>
      </div>

      <div className="grid-3">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Select Incident">
            <select className="form-select" value={selectedInc || inc?.id || ''} onChange={e => setSelectedInc(e.target.value)}>
              {myIncidents.map(i => <option key={i.id} value={i.id}>{i.id} — {i.title}</option>)}
            </select>
          </Card>

          <AIPanel
            title="AI Resource Recommendation"
            summary="Based on Extremely Severe fire in industrial zone and 12,400 population risk, AI predicts high requirement for fire and medical units."
            recommendation="Deploy 3 Fire Trucks, 2 Ambulances, and 1 NDRF Team immediately."
          />

          <Card title="Available Units (Coimbatore)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fire Department</div>
              {availableFire.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-muted)', borderRadius: '4px', fontSize: '12px' }}>
                  <div>
                    <span className="font-bold">{r.vehicleNo}</span> <span className="text-muted">({r.station})</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px' }} onClick={() => handleAssign(r, 'Fire Truck')}><Plus size={14}/></button>
                </div>
              ))}
              
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '8px' }}>Police Department</div>
              {availablePolice.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-muted)', borderRadius: '4px', fontSize: '12px' }}>
                  <div>
                    <span className="font-bold">{r.vehicleNo}</span> <span className="text-muted">({r.station})</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px' }} onClick={() => handleAssign(r, 'Police')}><Plus size={14}/></button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center/Right: Assigned & Map */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <div style={{ padding: 0 }}>
              <GISMap center={[inc.location.lat, inc.location.lng]} zoom={13} height={320} incidents={[inc]} resources={assigned} />
            </div>
          </Card>

          <Card title={`Units Assigned to ${inc.id}`}>
            <div className="grid-2">
              {assigned.length > 0 ? assigned.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    {r.type === 'Fire Truck' ? <Truck size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> : r.type === 'Ambulance' ? '🚑' : r.type === 'Police' ? '🚔' : '🚁'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                      {r.type} <span className="font-mono text-primary">{r.vehicleNo}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Officer: {r.officer}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge badge-${r.status === 'On Scene' ? 'green' : 'blue'}`}>{r.status}</span>
                      {r.eta > 0 && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}><Navigation size={10} style={{ display:'inline' }}/> {r.eta} min away</span>}
                    </div>
                  </div>
                </div>
              )) : <div className="text-muted" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px' }}>No units assigned yet.</div>}
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
}

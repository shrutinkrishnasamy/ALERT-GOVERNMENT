import { useState } from 'react';
import { Card } from '../../components/common/UIComponents';
import { AlertTriangle, MapPin, Calendar, Radio, PlusCircle, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function StateAdvisories() {
  const [declared, setDeclared] = useState(false);

  // Mocking an incoming advisory from State AI Prediction
  const advisory = {
    id: 'ADV-1029',
    type: 'Heavy Rain / Red Alert',
    message: 'Very heavy rainfall predicted tomorrow. Suggest declaring holiday for all educational institutions.',
    issuedBy: 'State AI Prediction Center',
    date: new Date().toLocaleDateString('en-GB'),
    status: declared ? 'Action Taken' : 'Pending Action'
  };

  const handleDeclareEmergency = () => {
    Swal.fire({
      title: 'Declare District Emergency',
      text: 'This will automatically generate an official order (School Holiday) and prepare a District-Wide Cell Broadcast.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--severity-high)',
      confirmButtonText: 'Yes, Declare & Broadcast',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeclared(true);
        Swal.fire(
          'Emergency Declared!',
          'Official Order has been issued and Cell Broadcast pushed to all District residents.',
          'success'
        );
      }
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div className="page-title">⚠️ State Advisories & Directives</div>
          <div className="page-subtitle">Incoming high-priority alerts and AI predictions from the State Operations Center</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ 
                width: 40, height: 40, borderRadius: '8px', 
                background: 'var(--severity-high-bg)', color: 'var(--severity-high)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{advisory.type}</h3>
                <div className="text-sm text-muted" style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {advisory.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> From: {advisory.issuedBy}</span>
                </div>
              </div>
            </div>
            <span className={`badge ${declared ? 'badge-success' : 'badge-danger'}`}>
              {advisory.status}
            </span>
          </div>

          <div style={{ 
            padding: '16px', 
            background: 'var(--bg-muted)', 
            borderRadius: '8px', 
            borderLeft: '4px solid var(--severity-high)',
            marginBottom: '20px',
            fontSize: '15px',
            lineHeight: '1.5'
          }}>
            <strong>Directive Details:</strong><br/>
            {advisory.message}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            {!declared ? (
              <button className="btn btn-danger" onClick={handleDeclareEmergency}>
                <Radio size={16} /> Declare Emergency & Broadcast to District
              </button>
            ) : (
              <button className="btn btn-success" disabled>
                <CheckCircle size={16} /> Actions Completed
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

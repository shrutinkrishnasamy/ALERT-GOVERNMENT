import { useState, useEffect } from 'react';
import { useIncidents } from '../../context/LiveContext';
import { Card, AIPanel, AlertBanner } from '../../components/common/UIComponents';
import GISMap from '../../components/Map/GISMap';
import { Radio, Smartphone, AlertTriangle, ShieldAlert, Sparkles, Send, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AlertBroadcast() {
  const navigate = useNavigate();
  const incidents = useIncidents();
  const [selectedInc, setSelectedInc] = useState(incidents[0]?.id);
  const inc = incidents.find(i => i.id === selectedInc) || incidents[0];
  const isSevere = ['High', 'Severe', 'Extremely Severe'].includes(inc?.severity || '');

  const [radius, setRadius] = useState(inc?.affectedRadius || 5);
  const [type, setType] = useState('Evacuation');
  const [languages, setLanguages] = useState(['Tamil', 'English']);
  
  const [cellScript, setCellScript] = useState('');
  const [radioScript, setRadioScript] = useState('');
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    if (!inc) return;
    setIsDispatched(false);
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const locStr = inc.locationName || `${inc.taluk || ''} ${inc.district || ''}`.trim();
    
    setCellScript(
      `அவசர அறிவிப்பு: ${locStr} பகுதியில் ${inc.type === 'Fire' ? 'தீ விபத்து' : 'அவசர நிலை'} ஏற்பட்டுள்ளது. ${radius} கிலோமீட்டர் சுற்றளவில் உள்ள மக்கள் உடனடியாக பாதுகாப்பான இடத்திற்கு செல்லவும்.\n\nEMERGENCY ALERT: ${inc.title} at ${locStr}. Residents within ${radius}km radius must evacuate immediately.`
    );
    
    setRadioScript(
      `Emergency Broadcast for District Listeners:\n\nThis is an urgent public safety message from the District Collector's Office issued at ${timeStr}. A major incident (${inc.title}) has occurred at ${locStr}, specifically affecting the surrounding areas within a ${radius}-kilometer radius.\n\nWe urge all residents in this zone to evacuate immediately and follow designated safe routes as directed by local authorities. Please do not panic, but act swiftly. Emergency response teams are already on-site to control the situation.\n\nStay tuned to this station for continuous updates and further instructions.`
    );
  }, [inc, radius]);

  const handleRadioPdf = () => {
    const today = new Date().toLocaleDateString('en-GB');
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const locStr = inc?.locationName || `${inc?.taluk || ''} ${inc?.district || ''}`.trim();
    const docHtml = `
      <div style="font-family: 'Times New Roman', serif; color: black; text-align: left; padding: 20px; line-height: 1.5;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" style="height: 80px; margin-bottom: 10px;" />
          <div style="font-weight: bold; font-size: 18px;">GOVERNMENT OF TAMIL NADU</div>
          <div style="font-weight: bold; font-size: 16px;">DISTRICT EMERGENCY OPERATIONS CENTRE</div>
          <div style="font-size: 14px;">Collectorate Campus, ${inc?.district || 'Coimbatore'} - 641018, Tamil Nadu.</div>
          <div style="font-size: 14px;">Website: www.tn.gov.in | Email: eoc.${(inc?.district || 'coimbatore').toLowerCase()}@tn.gov.in</div>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 20px;">
          <div>NOTIFICATION NO: EOC/2026/${(inc?.type || 'EMG').toUpperCase()}/${inc?.id.split('-').pop() || '0045'}</div>
          <div>DATE: ${today}</div>
        </div>
        
        <div style="text-align: center; font-weight: bold; font-size: 16px; text-decoration: underline; margin-bottom: 15px;">
          EMERGENCY BROADCAST NOTICE
        </div>
        
        <div style="font-size: 14px; margin-bottom: 20px; text-align: justify;">
          District Emergency Operations Centre, ${inc?.district || 'Coimbatore'} has issued this emergency broadcast message for immediate dissemination through all authorized FM, AIR and Community Radio Stations in the interest of public safety.
        </div>
        
        <table style="width: 100%; font-size: 14px; margin-bottom: 20px; border: none;">
          <tr><td style="width: 200px; font-weight: bold;">Incident Type</td><td>: ${(inc?.type || 'Emergency').toUpperCase()}</td></tr>
          <tr><td style="font-weight: bold;">Location</td><td>: ${locStr}</td></tr>
          <tr><td style="font-weight: bold;">Reported Time</td><td>: ${timeStr}</td></tr>
          <tr><td style="font-weight: bold;">Severity</td><td>: ${(inc?.severity || 'HIGH').toUpperCase()}</td></tr>
          <tr><td style="font-weight: bold;">Source</td><td>: Emergency Operations Center</td></tr>
          <tr><td style="font-weight: bold;">Affected Population</td><td>: ${inc?.populationAtRisk || 'Unknown'} (Approx.)</td></tr>
          <tr><td style="font-weight: bold;">Message Language</td><td>: ${languages.join(' & ')}</td></tr>
          <tr><td style="font-weight: bold;">Prepared By</td><td>: AI Emergency Communication Assistant</td></tr>
        </table>
        
        <div style="text-align: center; font-weight: bold; font-size: 16px; text-decoration: underline; margin-bottom: 15px; border-top: 1px solid black; padding-top: 15px;">
          OFFICIAL RADIO BROADCAST SCRIPT
        </div>
        
        <div style="font-size: 14px; margin-bottom: 20px; text-align: justify; white-space: pre-wrap;">${radioScript}</div>
        
        <div style="font-weight: bold; font-size: 14px; text-decoration: underline; margin-bottom: 10px; border-top: 1px solid black; padding-top: 15px;">
          PUBLIC SAFETY INSTRUCTIONS
        </div>
        <ul style="font-size: 14px; margin-bottom: 40px; padding-left: 20px;">
          <li>Stay away from the affected area.</li>
          <li>Follow instructions from Police and Emergency Departments.</li>
          <li>Avoid unnecessary travel and crowding.</li>
          <li>Keep emergency contact numbers accessible.</li>
          <li>Listen only to official announcements.</li>
        </ul>
        
        <div style="text-align: right; font-weight: bold; font-size: 14px;">
          DISTRICT COLLECTOR<br/>
          ${inc?.district || 'Coimbatore'} District<br/>
          (i/c)
        </div>
      </div>
    `;

    Swal.fire({
      html: docHtml,
      width: '800px',
      showCancelButton: true,
      confirmButtonText: 'Confirm & Dispatch',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-wide-pdf'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsDispatched(true);
        Swal.fire('Dispatched', 'PDF Generated & Dispatched to District Radio Stations successfully.', 'success');
      }
    });
  };

  const toggleLang = (l) => {
    setLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  };

  const handleAction = () => {
    if (isSevere) {
      Swal.fire('Draft Saved', 'Forwarding to Collector for final approval.', 'success').then(() => navigate('/district'));
    } else {
      Swal.fire('Dispatched', 'Broadcast Approved and Dispatched directly by District EOC.', 'success');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><Radio size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Alert Broadcast Configuration</div>
          <div className="page-subtitle">Configure geo-targeted cell broadcasts and multilingual radio scripts</div>
        </div>
      </div>

      <div className="grid-3">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="1. Select Incident">
            <select className="form-select" value={selectedInc} onChange={e => setSelectedInc(e.target.value)}>
              {incidents.map(i => <option key={i.id} value={i.id}>{i.id} — {i.title}</option>)}
            </select>
          </Card>

          <Card title="2. Broadcast Parameters">
            <div className="form-group">
              <label className="form-label">Alert Type</label>
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option>Information</option>
                <option>Warning</option>
                <option>Emergency</option>
                <option>Evacuation</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Target Radius (KM)</label>
              <input type="range" min="1" max="20" value={radius} onChange={e => setRadius(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>1km</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>{radius} km</span>
                <span>20km</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Languages</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Tamil', 'English', 'Malayalam', 'Hindi'].map(l => (
                  <button key={l} type="button" 
                    className={`btn btn-sm ${languages.includes(l) ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => toggleLang(l)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <AIPanel 
            title="AI Coverage Prediction"
            summary={`A ${radius}km radius covers approximately ${Math.round(radius * radius * 800).toLocaleString()} devices connected to ${Math.round(radius * 1.5)} telecom towers.`}
          />
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <div style={{ padding: 0 }}>
              <GISMap center={[inc.location.lat, inc.location.lng]} zoom={13} height={300} incidents={[inc]} showRadius={true} radiusKm={radius} />
            </div>
          </Card>

          <Card title="3. Cell Broadcast Message">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button className="btn btn-ghost btn-sm text-primary"><Sparkles size={14}/> Regenerate with AI</button>
            </div>
            <textarea className="form-textarea" rows={4} value={cellScript} onChange={e => setCellScript(e.target.value)} style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.6 }} />
          </Card>

          <Card title="4. Radio Script (Elaborate)">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button className="btn btn-ghost btn-sm text-primary"><Sparkles size={14}/> Regenerate with AI</button>
            </div>
            <textarea className="form-textarea" rows={7} value={radioScript} onChange={e => setRadioScript(e.target.value)} style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <button 
                 className={`btn btn-sm ${isDispatched ? 'btn-success' : 'btn-secondary'}`} 
                 onClick={handleRadioPdf}
               >
                  <FileText size={14} style={{ marginRight: 4 }}/> 
                  {isDispatched ? 'Dispatched to Stations' : 'Export PDF & Dispatch to Stations'}
               </button>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {isSevere ? (
              <AlertBanner type="critical" icon={<ShieldAlert size={16}/>}>
                <strong>Collector Approval Required:</strong> Severity is too high for direct broadcast.
              </AlertBanner>
            ) : (
              <div className="text-muted text-sm">Direct approval authorized.</div>
            )}

            <button className={`btn btn-lg ${isSevere ? 'btn-warning' : 'btn-success'}`} onClick={handleAction}>
              {isSevere ? (
                <><Send size={16} /> Draft & Forward to Collector</>
              ) : (
                <><Radio size={16} /> Approve & Broadcast Now</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, AIPanel } from '../../components/common/UIComponents';
import { Send, AlertTriangle, CloudRain, Droplets, MapPin, CheckCircle, FilePlus } from 'lucide-react';
import Swal from 'sweetalert2';

const DISTRICTS = ['Coimbatore', 'Chennai', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Erode', 'Cuddalore', 'Nagapattinam'];

export default function DisasterPrediction() {
  const [district, setDistrict] = useState('Coimbatore');
  const [warningType, setWarningType] = useState('Heavy Rain');
  const [message, setMessage] = useState('Very heavy rainfall predicted tomorrow. Suggest declaring holiday for all educational institutions.');

  const handleIssueAdvisory = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Advisory Sent!',
      text: `Warning dispatched to the Collector of ${district}.`,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 3000
    });
  };

  const handleDraftAdvisory = () => {
    setDistrict('Cuddalore'); // Pre-fill with one of the affected districts
    setWarningType('Cyclone');
    setMessage('URGENT: Cyclone formation detected in Bay of Bengal. High probability (82%) of landfall within 72 hours. Please alert coastal communities, issue fisherman warnings, and pre-deploy NDRF battalions immediately.');
    
    // Smooth scroll to the form if needed
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
    Swal.fire({
      title: 'Draft Created',
      text: 'The advisory form has been automatically populated based on AI recommendations.',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">🧠 AI Disaster Prediction</div>
          <div className="page-subtitle">Predictive models for weather, floods, and large-scale threats</div>
        </div>
      </div>
      
      <div className="grid-2">
        <AIPanel 
          title="72-Hour Weather & Flood Risk Model"
          summary="Cyclone formation detected in Bay of Bengal. High probability (82%) of landfall between Cuddalore and Nagapattinam within 72 hours. Projected rainfall: 25-30cm."
          recommendation="Alert Collectors of Coastal Districts. Pre-deploy 4 NDRF battalions. Issue preliminary fisherman warnings."
          confidence={82}
          action={
            <button className="btn btn-secondary" onClick={handleDraftAdvisory} style={{ marginTop: '8px' }}>
              <FilePlus size={14} /> Draft Advisory from Prediction
            </button>
          }
        />
        
        <Card title="Issue Official Collector Advisory" icon={<AlertTriangle size={18} color="var(--severity-high)" />}>
          <form onSubmit={handleIssueAdvisory}>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Target District
              </label>
              <select 
                className="form-select" 
                value={district} 
                onChange={e => setDistrict(e.target.value)}
              >
                {DISTRICTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Warning Type</label>
              <select 
                className="form-select" 
                value={warningType}
                onChange={e => setWarningType(e.target.value)}
              >
                <option value="Heavy Rain">🌧️ Heavy Rain / Red Alert</option>
                <option value="Dam Opening">🌊 Dam Opening / Flood Warning</option>
                <option value="Cyclone">🌀 Cyclone / Gale Wind Warning</option>
                <option value="Tsunami">🌊 Tsunami Alert</option>
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Advisory Message</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
              <Send size={16} /> Dispatch Warning to Collector
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

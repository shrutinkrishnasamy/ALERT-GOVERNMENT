import { useAuth } from '../../context/AuthContext';
import { INCIDENTS } from '../../data/mockData';
import { ShieldAlert, ArrowRight, Activity, MapPin, Radio, Brain, Route, AlertTriangle, Cpu, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const GradientCard = ({ gradient, icon, label, value, sub }) => (
  <div className="gradient-stat-card" style={{ background: gradient }}>
    <div className="stat-icon-wrapper">{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const SevBadge = ({ severity }) => {
  const c = severity === 'Low' ? 'green' : severity === 'Medium' ? 'orange' : 'red';
  return <span className={`badge badge-${c}`}><AlertTriangle size={10} /> {severity}</span>;
};

export default function CollectorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const criticalIncidents = INCIDENTS.filter(i => ['Severe', 'Extremely Severe'].includes(i.severity));
  const broadcastPending = INCIDENTS.filter(i => i.status === 'Waiting for Collector').length;
  const evacuations = 1;
  const peopleAtRisk = 12400;

  const handleGeneratePdf = (inc) => {
    const today = new Date().toLocaleDateString('en-GB');
    const docHtml = `
      <div style="font-family: 'Times New Roman', serif; color: black; text-align: left; padding: 40px; line-height: 1.5; background: white;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" style="height: 80px; margin-bottom: 10px;" />
          <div style="font-weight: bold; font-size: 18px;">GOVERNMENT OF TAMIL NADU</div>
          <div style="font-weight: bold; font-size: 16px;">DISTRICT COLLECTORATE</div>
          <div style="font-size: 14px;">Collectorate Campus, ${user?.district || 'Coimbatore'} - 641018, Tamil Nadu.</div>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 20px;">
          <div>FILE NO: DC/2026/EMG/${inc.id.split('-').pop()}</div>
          <div>DATE: ${today}</div>
        </div>
        
        <div style="text-align: center; font-weight: bold; font-size: 16px; text-decoration: underline; margin-bottom: 15px;">
          REQUEST FOR BROADCAST APPROVAL
        </div>
        
        <div style="font-size: 14px; margin-bottom: 20px; text-align: justify;">
          Respected Sir/Madam, <br/><br/>
          An emergency incident has been officially reported by the Village Administrative Officer (VAO) and verified by the Taluk Office. 
          Approval is requested to issue a cell broadcast and radio alert to ensure immediate public safety.
        </div>
        
        <table style="width: 100%; font-size: 14px; margin-bottom: 20px; border: none;">
          <tr><td style="width: 200px; font-weight: bold; padding-bottom: 8px;">Incident ID</td><td style="padding-bottom: 8px;">: ${inc.id}</td></tr>
          <tr><td style="font-weight: bold; padding-bottom: 8px;">Incident Title</td><td style="padding-bottom: 8px;">: ${inc.title}</td></tr>
          <tr><td style="font-weight: bold; padding-bottom: 8px;">Exact Location</td><td style="padding-bottom: 8px;">: ${inc.locationName || inc.taluk || 'Unknown Location'}</td></tr>
          <tr><td style="font-weight: bold; padding-bottom: 8px;">Taluk Name</td><td style="padding-bottom: 8px;">: ${inc.taluk || 'Coimbatore North'}</td></tr>
          <tr><td style="font-weight: bold; padding-bottom: 8px;">Reporting VAO</td><td style="padding-bottom: 8px;">: ${inc.reporter || 'M. Ramesh (VAO)'}</td></tr>
          <tr><td style="font-weight: bold; padding-bottom: 8px;">Severity</td><td style="padding-bottom: 8px;">: ${inc.severity.toUpperCase()}</td></tr>
          <tr><td style="font-weight: bold; padding-bottom: 8px;">Requested Actions</td><td style="padding-bottom: 8px;">: Emergency Evacuation & Public Broadcast</td></tr>
        </table>
        
        <div style="margin-top: 60px; display: flex; justify-content: space-between; font-size: 14px; font-weight: bold;">
          <div style="text-align: left;">
            <br/><br/>
            PREPARED BY (DEOC)
          </div>
          <div style="text-align: right;">
            APPROVED / REJECTED<br/><br/><br/><br/>
            DISTRICT COLLECTOR<br/>
            ${user?.district || 'Coimbatore'} District
          </div>
        </div>
      </div>
    `;

    Swal.fire({
      html: docHtml,
      width: '800px',
      showCancelButton: true,
      confirmButtonText: 'Print / Download PDF',
      cancelButtonText: 'Close',
      customClass: {
        popup: 'swal-wide-pdf'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Create a hidden iframe and trigger browser print (Save as PDF)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.contentDocument.write('<html><head><title>Broadcast_Approval_Request</title></head><body>' + docHtml + '</body></html>');
        iframe.contentDocument.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        
        // Cleanup iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }
    });
  };

  const handleApprove = (inc) => {
    Swal.fire({
      title: 'Confirm Approval',
      text: "Have you obtained the Collector's physical signature to approve this broadcast?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve & Move to Broadcast Queue',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        inc.broadcastStatus = 'Pending Dispatch';
        Swal.fire('Approved!', 'The incident has been added to the Broadcast Queue.', 'success').then(() => {
          navigate(`/collector/broadcast-approval?id=${inc.id}`);
        });
      }
    });
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Executive Dashboard</div>
          <div className="page-subtitle">District Collector · {user?.district} District</div>
        </div>
      </div>

      {/* Executive Approval Banner */}
      {broadcastPending > 0 && (
        <div style={{
          background: 'var(--gradient-danger)', borderRadius: 'var(--radius-lg)',
          padding: '20px 28px', marginBottom: 24, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', color: 'white',
          boxShadow: '0 8px 32px rgba(239,68,68,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ShieldAlert size={28} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>EXECUTIVE APPROVAL REQUIRED</div>
              <div style={{ fontSize: 13, opacity: 0.85 }}>{broadcastPending} critical incidents waiting for your broadcast & evacuation approval.</div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Stats */}
      <div className="stat-grid">
        <GradientCard gradient="var(--gradient-danger)" icon={<ShieldAlert size={20} />}
          label="Critical Incidents" value={criticalIncidents.length} sub="Needs executive action" />
        <GradientCard gradient="var(--gradient-5)" icon={<Radio size={20} />}
          label="Broadcasts Pending" value={broadcastPending} sub={broadcastPending > 0 ? 'Awaiting approval' : 'All approved'} />
        <GradientCard gradient="var(--gradient-6)" icon={<Route size={20} />}
          label="Active Evacuations" value={evacuations} sub="Zones under evacuation" />
        <GradientCard gradient="var(--gradient-1)" icon={<Activity size={20} />}
          label="Est. People at Risk" value={peopleAtRisk.toLocaleString()} sub="12% increase" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Critical Escalations */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--severity-severe)' }} className="pulse" />
              <span className="card-title">Critical Escalations Queue</span>
            </div>
          </div>
          <div>
            {criticalIncidents.map(inc => (
              <div key={inc.id} className="list-row">
                <div className="list-row-icon" style={{ background: 'var(--severity-severe-bg)', color: 'var(--severity-severe)' }}>
                  <AlertTriangle size={18} />
                </div>
                <div className="list-row-content">
                  <div className="list-row-title">{inc.title}</div>
                  <div className="list-row-meta">
                    <span className="font-mono" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 11 }}>{inc.id}</span>
                    <span><MapPin size={10} style={{ display: 'inline', marginRight: 2 }} />{inc.taluk}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: 1.5 }}>
                    {inc.description.length > 80 ? inc.description.substring(0, 80) + '...' : inc.description}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                  <SevBadge severity={inc.severity} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleGeneratePdf(inc)}>
                      Get PDF Request
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleApprove(inc)}>
                      Approve Broadcast
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* District Health */}
          <div className="card" style={{ background: 'var(--gradient-primary)', border: 'none' }}>
            <div style={{ padding: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, opacity: 0.65, marginBottom: 14, textTransform: 'uppercase' }}>
                District Overall Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: '6px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900 }}>
                  74
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Elevated Risk</div>
                  <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5 }}>1 critical incident driving risk. Resources at 45%.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                  onClick={() => navigate('/collector/situation-map')}>
                  <MapPin size={12} /> Map
                </button>
                <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                  onClick={() => navigate('/collector/ai-reports')}>
                  <Cpu size={12} /> AI Report
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

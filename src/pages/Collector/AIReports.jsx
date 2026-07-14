import { useAuth } from '../../context/AuthContext';
import { INCIDENTS } from '../../data/mockData';
import { Card } from '../../components/common/UIComponents';
import { Download, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useState } from 'react';

export default function AIReports() {
  const { user } = useAuth();
  const [isGenerated, setIsGenerated] = useState(false);

  // We take the top critical incidents to represent today's approved/managed events
  const dailyIncidents = INCIDENTS.filter(i => ['Severe', 'Extremely Severe', 'High'].includes(i.severity)).slice(0, 4);
  const today = new Date().toLocaleDateString('en-GB');

  const handleGeneratePdf = () => {
    let rowsHtml = '';
    dailyIncidents.forEach((inc, idx) => {
      // Mocking different actions based on severity or type
      let action = 'Resources Deployed & Monitored';
      if (inc.severity === 'Extremely Severe' || inc.severity === 'Severe') {
        action = 'Broadcast Approved, Evacuation Ordered, NDRF Alerted';
      } else if (inc.type === 'Fire') {
        action = 'Fire Units Deployed, Broadcast Sent';
      }

      rowsHtml += `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace;">${inc.id}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${10 + idx}:30 AM</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${inc.title}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">VEO Officer (${inc.reportedBy})</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${inc.taluk || inc.locationName}</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-size: 12px; color: #444;">${inc.aiSummary || inc.description}</td>
        </tr>
      `;
    });

    const docHtml = `
      <div style="font-family: 'Times New Roman', serif; color: black; text-align: left; padding: 40px; line-height: 1.5; background: white;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" style="height: 80px; margin-bottom: 10px;" />
          <div style="font-weight: bold; font-size: 18px;">GOVERNMENT OF TAMIL NADU</div>
          <div style="font-weight: bold; font-size: 16px;">DISTRICT COLLECTORATE, ${user?.district?.toUpperCase() || 'COIMBATORE'}</div>
        </div>
        
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 20px;">
          <div>PRESS RELEASE NO: PR/2026/${new Date().getMonth() + 1}/${new Date().getDate()}</div>
          <div>DATE: ${today}</div>
        </div>
        
        <div style="text-align: center; font-weight: bold; font-size: 16px; text-decoration: underline; margin-bottom: 15px;">
          OFFICIAL DAILY SITUATION REPORT & PRESS RELEASE
        </div>
        
        <div style="font-size: 14px; margin-bottom: 20px; text-align: justify;">
          FOR IMMEDIATE RELEASE: <br/><br/>
          The District Administration and Emergency Operations Centre (DEOC) successfully managed and coordinated response efforts for the following critical incidents reported across the district today (${today}). 
          All necessary safety protocols, including public broadcasts and emergency evacuations, were authorized and executed promptly to ensure citizen safety.
        </div>
        
        <table style="width: 100%; font-size: 13px; margin-bottom: 30px; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Incident No</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Date & Time</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Incident Title</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">VAO / VEO Name</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Taluk</th>
              <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">AI Summary</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        
        <div style="font-size: 14px; margin-bottom: 40px; text-align: justify;">
          The situation across the district is currently under strict monitoring. We urge the public to refrain from spreading rumors on social media and rely solely on official announcements.
        </div>
        
        <div style="display: flex; justify-content: flex-end; font-size: 14px; font-weight: bold;">
          <div style="text-align: center;">
            ISSUED BY:<br/><br/><br/><br/>
            DISTRICT COLLECTOR<br/>
            ${user?.district || 'Coimbatore'} District
          </div>
        </div>
      </div>
    `;

    Swal.fire({
      html: docHtml,
      width: '850px',
      showCancelButton: true,
      confirmButtonText: 'Download & Forward to Press',
      cancelButtonText: 'Close',
      customClass: {
        popup: 'swal-wide-pdf'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsGenerated(true);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.contentDocument.write('<html><head><title>Daily_Press_Release_${today.replace(/\\//g, '-')}</title></head><body>' + docHtml + '</body></html>');
        iframe.contentDocument.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }
    });
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div className="page-title">🧠 AI Generated Reports</div>
          <div className="page-subtitle">Auto-generated daily situation reports and official press releases</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card title="Daily Situation Report (Press Release)">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span className="text-muted text-sm">Date: {today} | Target: Media / Public Relations</span>
            <button className="btn btn-ghost btn-sm text-primary"><Sparkles size={14}/> Regenerate AI Summary</button>
          </div>
          
          <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead style={{ background: 'var(--bg-muted)' }}>
                <tr>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Incident No</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Time</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Incident Title</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Officer</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Taluk</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>AI Summary</th>
                </tr>
              </thead>
              <tbody>
                {dailyIncidents.map((inc, i) => (
                  <tr key={inc.id}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'monospace' }}>{inc.id}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>{10 + i}:30 AM</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{inc.title}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>VEO Officer ({inc.reportedBy})</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>{inc.taluk || inc.locationName}</td>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      {inc.aiSummary || inc.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className={`btn btn-sm ${isGenerated ? 'btn-success' : 'btn-primary'}`} 
              onClick={handleGeneratePdf}
            >
              {isGenerated ? <CheckCircle2 size={16} /> : <FileText size={16} />}
              {isGenerated ? 'Forwarded to Press' : 'Export PDF & Forward to Press'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

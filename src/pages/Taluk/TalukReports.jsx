import { Card } from '../../components/common/UIComponents';
import { ANALYTICS_DATA } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, BarChart2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TalukReports() {
  const handleExport = () => {
    Swal.fire({
      title: 'Export PDF Report',
      html: `
        <div style="text-align: left; display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">Select Date *</label>
            <input type="date" id="swal-date" class="form-input" style="width: 100%; box-sizing: border-box;">
          </div>
          
          <div id="incident-selection-container" style="display: none;">
            <label style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">Select Incident *</label>
            <select id="swal-incident-select" class="form-input" style="width: 100%; box-sizing: border-box;">
              <option value="">-- Choose Incident --</option>
            </select>
          </div>

          <div id="incident-details" style="display: none; background: var(--bg-muted); padding: 12px; border-radius: 6px; font-size: 12px; border: 1px solid var(--border);">
             <!-- Details shown here -->
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Generate Report',
      confirmButtonColor: 'var(--primary)',
      didOpen: () => {
        const dateInput = document.getElementById('swal-date');
        const incidentContainer = document.getElementById('incident-selection-container');
        const incidentSelect = document.getElementById('swal-incident-select');
        const detailsContainer = document.getElementById('incident-details');

        // Mock data for incidents
        const mockIncidents = [
          { id: 'INC-2026-015', name: 'Warehouse Fire', veo: 'Rajesh Kumar', time: '09:20 AM' },
          { id: 'INC-2026-016', name: 'Severe Flood', veo: 'Suresh', time: '02:30 PM' },
          { id: 'INC-2026-017', name: 'Chemical Spill', veo: 'Anita', time: '06:45 PM' }
        ];

        dateInput.addEventListener('change', (e) => {
          if (e.target.value) {
            incidentContainer.style.display = 'block';
            incidentSelect.innerHTML = '<option value="">-- Choose Incident --</option>' + 
              mockIncidents.map(inc => `<option value="${inc.id}">${inc.time} - ${inc.name} (${inc.id})</option>`).join('');
            detailsContainer.style.display = 'none';
          } else {
            incidentContainer.style.display = 'none';
            detailsContainer.style.display = 'none';
          }
        });

        incidentSelect.addEventListener('change', (e) => {
          const selected = mockIncidents.find(inc => inc.id === e.target.value);
          if (selected) {
            detailsContainer.style.display = 'block';
            detailsContainer.innerHTML = `
              <div style="margin-bottom: 4px;"><strong>Reported By:</strong> ${selected.veo}</div>
              <div style="margin-bottom: 4px;"><strong>Time:</strong> ${selected.time}</div>
              <div style="color: var(--primary); font-weight: 600; margin-top: 8px;">✓ Ready to generate report</div>
            `;
            incidentSelect.dataset.veo = selected.veo;
            incidentSelect.dataset.name = selected.name;
            incidentSelect.dataset.time = selected.time;
          } else {
            detailsContainer.style.display = 'none';
          }
        });
      },
      preConfirm: () => {
        const date = document.getElementById('swal-date').value;
        const incidentSelect = document.getElementById('swal-incident-select');
        const incidentId = incidentSelect.value;
        
        if (!date || !incidentId) {
          Swal.showValidationMessage('Please select a date and an incident');
          return false;
        }

        const incident = incidentSelect.dataset.name + ' (' + incidentId + ')';
        const veo = incidentSelect.dataset.veo;
        const time = incidentSelect.dataset.time;

        return { incident, veo, date, time };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const params = new URLSearchParams(result.value);
        window.open('/taluk/print-report?' + params.toString(), '_blank');
      }
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title"><BarChart2 size="1.2em" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Taluk Reports & Analytics</div>
          <div className="page-subtitle">Performance and incident statistics for the current month</div>
        </div>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={14} /> Export PDF Report
        </button>
      </div>

      <div className="grid-2">
        <Card title="Incidents by Category">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ANALYTICS_DATA.incidentsByType}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ANALYTICS_DATA.incidentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Incidents`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Incidents by Severity">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.incidentsBySeverity} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-muted)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ANALYTICS_DATA.incidentsBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Incident Volume (Last 7 Days)" className="span-2" style={{ gridColumn: '1 / -1' }}>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.incidentsByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-muted)' }} />
                <Bar dataKey="incidents" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

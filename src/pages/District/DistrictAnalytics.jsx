import { Card } from '../../components/common/UIComponents';
import { ANALYTICS_DATA } from '../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Download, Filter } from 'lucide-react';
import Swal from 'sweetalert2';

export default function DistrictAnalytics() {
  const handleExport = () => {
    Swal.fire({
      title: 'Generating Report',
      html: 'Compiling district analytics into PDF format...',
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      Swal.fire('Export Successful', 'District_Analytics_Report.pdf has been saved to your downloads.', 'success');
    });
  };
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📈 District Analytics</div>
          <div className="page-subtitle">Comprehensive data on emergency response performance</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm"><Filter size={14} /> Filter</button>
          <button className="btn btn-primary btn-sm" onClick={handleExport}><Download size={14} /> Export Report</button>
        </div>
      </div>

      <div className="grid-3">
        <Card title="Average Response Time (mins)">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA.responseTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <Tooltip cursor={{ fill: 'var(--bg-muted)' }} />
                <Area type="monotone" dataKey="avg" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Incidents by Category">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.incidentsByType} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-muted)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {ANALYTICS_DATA.incidentsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Broadcasts Sent">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA.broadcastByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-muted)' }} />
                <Bar dataKey="broadcasts" fill="var(--severity-low)" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

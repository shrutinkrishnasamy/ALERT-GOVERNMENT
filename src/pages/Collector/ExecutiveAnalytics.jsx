import { Card } from '../../components/common/UIComponents';
import { ANALYTICS_DATA } from '../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Download } from 'lucide-react';

export default function ExecutiveAnalytics() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📈 Executive Analytics</div>
          <div className="page-subtitle">High-level insights into district emergency response</div>
        </div>
        <button className="btn btn-primary btn-sm"><Download size={14} /> Download Exec Report</button>
      </div>
      <div className="grid-2">
        <Card title="Average Response Time (mins)" style={{ gridColumn: 'span 2' }}>
          <div style={{ height: 300 }}>
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
      </div>
    </div>
  );
}

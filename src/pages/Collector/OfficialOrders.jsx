import { useState } from 'react';
import { Card } from '../../components/common/UIComponents';
import { FileText, Download, CheckCircle } from 'lucide-react';

export default function OfficialOrders() {
  const [issued, setIssued] = useState(false);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div className="page-title">📜 Issue Official Order</div>
          <div className="page-subtitle">Generate signed PDF orders for disaster management</div>
        </div>
      </div>
      <Card>
        {!issued ? (
          <form onSubmit={e => { e.preventDefault(); setIssued(true); }}>
            <div className="form-group">
              <label className="form-label">Order Type</label>
              <select className="form-select">
                <option>Section 144 (Curfew)</option>
                <option>School/College Holiday</option>
                <option>Disaster Relief Fund Allocation</option>
                <option>Mandatory Evacuation</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Details</label>
              <textarea className="form-textarea" rows={4} placeholder="Enter details for the order..." />
            </div>
            <button type="submit" className="btn btn-danger"><FileText size={16}/> Generate & Sign Order</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle size={48} color="var(--severity-low)" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Order Issued Successfully</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>The PDF has been generated, signed, and dispatched to all departments.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary"><Download size={14} /> Download PDF</button>
              <button className="btn btn-ghost" onClick={() => setIssued(false)}>Issue Another</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

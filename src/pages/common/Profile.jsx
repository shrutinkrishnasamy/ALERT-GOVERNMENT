import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Key, Briefcase, Calendar, Droplet, PhoneCall } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div className="page-title">My Profile</div>
        </div>
      </div>

      <div style={{ maxWidth: '550px', margin: '0 auto' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Officer Information</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-surface)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" alt="TN Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--severity-low-bg)', color: 'var(--severity-low)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, border: '1px solid var(--severity-low-border)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--severity-low)' }}></div>
                    Online
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>{user?.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Government of Tamil Nadu</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Briefcase size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Department</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Revenue & Disaster Management</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Shield size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Officer ID</span>
                <span className="font-mono text-primary" style={{ fontWeight: 600 }}>{user?.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Jurisdiction</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user?.village ? `${user.village}, ` : ''}{user?.taluk ? `${user.taluk}, ` : ''}{user?.district}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Calendar size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Date of Joining</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user?.doj || '12 Aug 2018'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Droplet size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Blood Group</span>
                <span className="badge badge-red">{user?.bloodGroup || 'O+'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Phone size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Phone</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user?.phone || '+91 98765 43210'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Mail size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Email</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <PhoneCall size={16} color="var(--text-muted)" />
                <span style={{ width: '110px', fontWeight: 600 }}>Emergency Contact</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user?.emergencyContact || '+91 98765 11223'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

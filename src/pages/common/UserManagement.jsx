import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { USERS, DISTRICTS } from '../../data/mockData';
import { Card } from '../../components/common/UIComponents';
import { Users, Plus, Shield, Ban, Trash2, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

// Ensure all users have a status
USERS.forEach(u => {
  if (!u.status) u.status = 'Active';
});

const ROLE_LABELS = {
  village: 'VEO (Village)',
  taluk: 'Taluk Officer',
  collector: 'Collector',
  state: 'Admin (State)'
};

export default function UserManagement() {
  const { user } = useAuth();
  const [tick, setTick] = useState(0); // For re-renders
  const [showForm, setShowForm] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  
  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    role: '',
    district: user?.district || '',
    taluk: user?.taluk || '',
    village: '',
    email: '',
    phone: ''
  });

  // Permission Logic
  const canCreateRoles = useMemo(() => {
    if (user?.role === 'state') return ['collector', 'taluk', 'village'];
    if (user?.role === 'collector') return ['taluk', 'village'];
    if (user?.role === 'taluk') return ['village'];
    return [];
  }, [user]);

  const canSuspendRoles = canCreateRoles; // Suspend matches create permissions
  const canDelete = user?.role === 'state';

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubordinate = (parentUser) => {
    setNewUser({
      name: '',
      role: parentUser.role === 'collector' ? 'taluk' : 'village',
      district: parentUser.district,
      taluk: parentUser.role === 'taluk' ? parentUser.taluk : '',
      village: '',
      email: '',
      phone: ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Automatically expand the row so they can see the new user when created
    if (!expandedRows[parentUser.id]) {
      toggleRow(parentUser.id);
    }
  };

  const handleSuspend = (targetUser) => {
    if (!canSuspendRoles.includes(targetUser.role)) {
      Swal.fire('Access Denied', 'You do not have permission to suspend this role.', 'error');
      return;
    }

    const newStatus = targetUser.status === 'Active' ? 'Suspended' : 'Active';
    Swal.fire({
      title: `${newStatus === 'Suspended' ? 'Suspend' : 'Activate'} User?`,
      text: `Are you sure you want to ${newStatus === 'Suspended' ? 'suspend' : 'activate'} ${targetUser.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
    }).then((result) => {
      if (result.isConfirmed) {
        targetUser.status = newStatus;
        setTick(t => t + 1);
        Swal.fire('Success', `User has been ${newStatus.toLowerCase()}.`, 'success');
      }
    });
  };

  const handleDelete = (targetUser) => {
    if (!canDelete) {
      Swal.fire('Access Denied', 'Only State Admins can delete users.', 'error');
      return;
    }

    Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to permanently delete ${targetUser.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = USERS.findIndex(u => u.id === targetUser.id);
        if (index > -1) {
          USERS.splice(index, 1);
          setTick(t => t + 1);
          Swal.fire('Deleted', 'User has been removed.', 'success');
        }
      }
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newUser.role || !newUser.name) {
      Swal.fire('Error', 'Name and Role are required.', 'error');
      return;
    }

    // Generate ID based on role prefix
    const prefixMap = { village: 'VEO', taluk: 'TAL', collector: 'COL' };
    const prefix = prefixMap[newUser.role] || 'USR';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `${prefix}${randomNum}`;

    const createdUser = {
      ...newUser,
      id: newId,
      password: `${newUser.role}123`, // Default demo password
      title: ROLE_LABELS[newUser.role],
      status: 'Active',
      firstLogin: true
    };

    USERS.unshift(createdUser); // Add to top so it's visible immediately in their parent's expanded list
    setTick(t => t + 1);
    setShowForm(false);
    
    // Reset form
    setNewUser({
      name: '', role: '', 
      district: user?.district || '', 
      taluk: user?.taluk || '', 
      village: '', email: '', phone: ''
    });

    Swal.fire({
      title: 'User Created',
      html: `Successfully created <b>${createdUser.name}</b>.<br/><br/><b>Officer ID:</b> ${createdUser.id}<br/><b>Password:</b> ${createdUser.password}`,
      icon: 'success'
    });
  };

  // Hierarchy Logic
  const topLevelUsers = useMemo(() => {
    return USERS.filter(u => {
      if (u.id === user?.id) return false;
      if (user?.role === 'state') return u.role === 'collector';
      if (user?.role === 'collector') return u.district === user.district && u.role === 'taluk';
      if (user?.role === 'taluk') return u.district === user.district && u.taluk === user.taluk && u.role === 'village';
      return false;
    });
  }, [user, tick]);

  const renderChildren = (parentUser, level) => {
    let children = [];
    if (parentUser.role === 'collector') {
      children = USERS.filter(u => u.district === parentUser.district && u.role === 'taluk');
    } else if (parentUser.role === 'taluk') {
      children = USERS.filter(u => u.district === parentUser.district && u.taluk === parentUser.taluk && u.role === 'village');
    }

    if (children.length === 0) {
      return (
        <tr key={`${parentUser.id}-empty`}>
          <td colSpan="5" style={{ padding: '12px', paddingLeft: `${level * 30 + 50}px`, fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', background: level === 1 ? 'var(--bg-primary)' : 'var(--bg-body)' }}>
            No subordinates assigned yet.
          </td>
        </tr>
      );
    }

    return children.map(child => renderUserRow(child, level));
  };

  const renderUserRow = (u, level = 0) => {
    const isExpanded = expandedRows[u.id];
    const paddingLeft = level * 30 + 16;
    const isCollector = u.role === 'collector';
    const isTaluk = u.role === 'taluk';
    const hasChildren = isCollector || isTaluk;

    return (
      <React.Fragment key={u.id}>
        <tr style={{ borderBottom: '1px solid var(--border)', background: level === 0 ? 'var(--bg-surface)' : level === 1 ? 'var(--bg-primary)' : 'var(--bg-body)' }}>
          <td style={{ padding: '16px', paddingLeft: `${paddingLeft}px` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {hasChildren ? (
                <button 
                  className="btn btn-ghost btn-sm" 
                  style={{ padding: '4px', width: '28px', height: '28px', borderRadius: '50%', background: isExpanded ? 'var(--border)' : 'transparent' }} 
                  onClick={() => toggleRow(u.id)}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : <div style={{ width: '28px' }} />}
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }}>{u.id}</div>
              </div>
            </div>
          </td>
          <td style={{ padding: '16px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--bg-body)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
              <Shield size={14} color="var(--primary)" /> {ROLE_LABELS[u.role] || u.role}
            </div>
          </td>
          <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {u.village && <div>Village: {u.village}</div>}
            {u.taluk && <div>Taluk: {u.taluk}</div>}
            <div>District: {u.district}</div>
          </td>
          <td style={{ padding: '16px' }}>
            {u.status === 'Suspended' ? (
              <span className="badge badge-red">Suspended</span>
            ) : (
              <span className="badge badge-green">Active</span>
            )}
          </td>
          <td style={{ padding: '16px', textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              
              {/* Add Subordinate Button */}
              {hasChildren && canCreateRoles.includes(isCollector ? 'taluk' : 'village') && (
                <button 
                  className="btn btn-sm"
                  style={{ color: 'var(--primary)', background: 'var(--primary-bg)', borderColor: 'transparent' }}
                  onClick={() => handleAddSubordinate(u)}
                  title={`Add ${isCollector ? 'Taluk Officer' : 'VEO'} under this jurisdiction`}
                >
                  <Plus size={14} /> Add
                </button>
              )}

              {canSuspendRoles.includes(u.role) && (
                <button 
                  className={`btn btn-sm ${u.status === 'Suspended' ? 'btn-secondary' : ''}`}
                  style={{ color: u.status === 'Suspended' ? 'inherit' : 'var(--severity-severe)', background: u.status === 'Suspended' ? 'inherit' : 'var(--severity-severe-bg)', borderColor: 'transparent' }}
                  onClick={() => handleSuspend(u)}
                  title={u.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                >
                  {u.status === 'Suspended' ? <CheckCircle size={14} /> : <Ban size={14} />}
                </button>
              )}
              
              {canDelete && (
                <button 
                  className="btn btn-sm"
                  style={{ color: 'var(--severity-severe)', background: 'var(--severity-severe-bg)', borderColor: 'transparent' }}
                  onClick={() => handleDelete(u)}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </td>
        </tr>
        {isExpanded && hasChildren && renderChildren(u, level + 1)}
      </React.Fragment>
    );
  };

  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="page-title"><Users size="1.2em" style={{ verticalAlign: 'middle', marginRight: '8px' }} /> User Role Management</div>
          <div className="page-subtitle">Manage subordinate officers in your jurisdiction</div>
        </div>
        {canCreateRoles.length > 0 && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : <><Plus size={16} /> Create New User</>}
          </button>
        )}
      </div>

      {showForm && (
        <Card title="Create New Officer" style={{ marginBottom: '24px' }}>
          <form onSubmit={handleCreateSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="e.g. Ramesh Kumar" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="">Select Role...</option>
                {canCreateRoles.map(r => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <select className="form-select" required disabled={user?.role !== 'state'} value={newUser.district} onChange={e => setNewUser({...newUser, district: e.target.value})}>
                <option value="">Select District...</option>
                {DISTRICTS.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {['taluk', 'village'].includes(newUser.role) && (
              <div className="form-group">
                <label className="form-label">Taluk</label>
                <input type="text" className="form-input" required disabled={['taluk', 'village'].includes(user?.role)} value={newUser.taluk} onChange={e => setNewUser({...newUser, taluk: e.target.value})} />
              </div>
            )}

            {newUser.role === 'village' && (
              <div className="form-group">
                <label className="form-label">Village</label>
                <input type="text" className="form-input" required value={newUser.village} onChange={e => setNewUser({...newUser, village: e.target.value})} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} placeholder="+91" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="officer@alertgov.tn.in" />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary">Create Officer</button>
            </div>
          </form>
        </Card>
      )}

      <Card style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Officer ID & Name</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Jurisdiction</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topLevelUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No subordinate users found in your jurisdiction.
                </td>
              </tr>
            ) : topLevelUsers.map(u => renderUserRow(u, 0))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

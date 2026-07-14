import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FilePlus, List, UploadCloud, RefreshCw,
  Map, BarChart2, ShieldAlert, FileText, CheckSquare,
  Navigation, Radio, Brain, LogOut, Bell, Shield,
  Inbox, Satellite, AlertCircle, ClipboardList, Route, Users, AlertTriangle
} from 'lucide-react';
import { INCIDENTS } from '../../data/mockData';

const ROLE_LABELS = {
  village: 'Village EOC',
  taluk: 'Taluk Office',
  district: 'District EOC',
  collector: "Collector's Office",
  state: 'State Admin',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  // Badge counts
  const queueCount = INCIDENTS.filter(i => i.status === 'Taluk Verified' || i.status === 'Waiting for Collector').length;
  const pendingTaluk = INCIDENTS.filter(i => i.status === 'Waiting for Taluk').length;

  const menuMap = {
    village: [
      { section: 'Main' },
      { path: '/village',                  label: 'Dashboard',        icon: <LayoutDashboard size={18} /> },
      { path: '/village/create-incident',  label: 'Create Incident',  icon: <FilePlus size={18} /> },
      { path: '/village/active-incidents', label: 'Active Incidents', icon: <List size={18} /> },
      { section: 'Actions' },
      { path: '/village/upload-media',     label: 'Upload Media',     icon: <UploadCloud size={18} /> },

    ],
    taluk: [
      { section: 'Main' },
      { path: '/taluk',                  label: 'Dashboard',              icon: <LayoutDashboard size={18} /> },
      { path: '/taluk/verification',     label: 'Incident Verification',  icon: <CheckSquare size={18} />, badge: pendingTaluk },
      { path: '/taluk/active-incidents', label: 'Active Incidents',       icon: <List size={18} /> },

      { path: '/taluk/reports',          label: 'Reports',                icon: <BarChart2 size={18} /> },
    ],
    district: [
      { section: 'Operations' },
      { path: '/district',                   label: 'EOC Dashboard',      icon: <LayoutDashboard size={18} /> },
      { path: '/district/approval-queue',    label: 'Incident Queue',     icon: <Inbox size={18} />, badge: queueCount },
      { path: '/district/active-emergencies',label: 'Active Emergencies', icon: <ShieldAlert size={18} /> },
      { section: 'Command' },
      { path: '/district/map',               label: 'Live GIS Map',       icon: <Satellite size={18} /> },
      { path: '/district/resource-command',  label: 'Resource Command',   icon: <Navigation size={18} /> },
      { path: '/district/alert-broadcast',   label: 'Broadcast Center',   icon: <Radio size={18} /> },
      { section: 'Intelligence' },
      { path: '/district/analytics',         label: 'Analytics',          icon: <BarChart2 size={18} /> },
      { path: '/district/timeline',          label: 'Reports',            icon: <FileText size={18} /> },
    ],
    collector: [
      { section: 'Executive' },
      { path: '/collector',                   label: 'Dashboard',           icon: <LayoutDashboard size={18} /> },

      { path: '/collector/broadcast-approval',label: 'Broadcast Approval',  icon: <Radio size={18} /> },
      { section: 'Management' },
      { path: '/collector/situation-map',     label: 'Operations Map',      icon: <Map size={18} /> },
      { path: '/collector/official-orders',   label: 'Official Orders',     icon: <ClipboardList size={18} /> },
      { path: '/collector/ai-reports',        label: 'AI Reports',          icon: <Brain size={18} /> },
      { path: '/collector/state-advisories',  label: 'State Advisories',    icon: <AlertTriangle size={18} /> },
    ],
    state: [
      { section: 'State Overview' },
      { path: '/state',           label: 'State Dashboard',    icon: <LayoutDashboard size={18} /> },
      { path: '/state/districts', label: 'District Status',    icon: <Users size={18} /> },
      { section: 'Actions' },
      { path: '/state/analytics', label: 'Analytics',          icon: <BarChart2 size={18} /> },
      { path: '/state/prediction',label: 'AI Prediction',      icon: <Brain size={18} /> },
    ],
  };

  const links = menuMap[user?.role] || [];
  const initials = user?.name?.substring(0, 2).toUpperCase() || '??';

  return (
    <div className="sidebar">
      {/* Header / Brand */}
      <div className="sidebar-header">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" alt="TN Logo" style={{ width: '55px', height: '55px', objectFit: 'contain', marginLeft: '-4px' }} />
        <div className="sidebar-brand">
          <div className="sidebar-brand-name">AlertGov</div>
          <div className="sidebar-brand-sub">{ROLE_LABELS[user?.role] || 'Dashboard'}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {links.map((item, idx) => {
          if (item.section) {
            return <div key={`s-${idx}`} className="sidebar-section-label">{item.section}</div>;
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length === 2}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <NavLink
          to={`/${user?.role}/notifications`}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Bell size={18} /> <span>Notifications</span>
        </NavLink>

        <div className="sidebar-user" onClick={() => navigate(`/${user?.role}/profile`)}>
          <div className="user-avatar-sm">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.id}</div>
          </div>
          <LogOut size={16} color="var(--text-muted)" onClick={(e) => { e.stopPropagation(); handleLogout(); }} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </div>
  );
}

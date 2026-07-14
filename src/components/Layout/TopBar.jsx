import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, Search, MapPin, Calendar, LayoutDashboard, FilePlus, List, UploadCloud, 
  RefreshCw, Map, BarChart2, ShieldAlert, FileText, CheckSquare, Navigation, 
  Radio, Brain, LogOut, Shield, Inbox, Satellite, AlertCircle, ClipboardList, 
  Route, Users, ChevronDown, AlertTriangle 
} from 'lucide-react';
import { INCIDENTS } from '../../data/mockData';

const ROLE_LABELS = {
  village: 'Village EOC',
  taluk: 'Taluk Office',
  district: 'District EOC',
  collector: "Collector's Office",
  state: 'State Admin',
};

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  // Badge counts
  const queueCount = INCIDENTS.filter(i => i.status === 'Taluk Verified' || i.status === 'Waiting for Collector').length;
  const pendingTaluk = INCIDENTS.filter(i => i.status === 'Waiting for Taluk').length;

  const menuMap = {
    village: [
      { path: '/village',                  label: 'Dashboard',        icon: <LayoutDashboard size={16} /> },
      { path: '/village/create-incident',  label: 'Create Incident',  icon: <FilePlus size={16} /> },
      { path: '/village/active-incidents', label: 'Active Incidents', icon: <List size={16} /> },
      { path: '/village/upload-media',     label: 'Upload Media',     icon: <UploadCloud size={16} /> },

    ],
    taluk: [
      { path: '/taluk',                  label: 'Dashboard',              icon: <LayoutDashboard size={16} /> },
      { path: '/taluk/verification',     label: 'Incident Verification',  icon: <CheckSquare size={16} />, badge: pendingTaluk },
      { path: '/taluk/active-incidents', label: 'Active Incidents',       icon: <List size={16} /> },

      { path: '/taluk/reports',          label: 'Reports',                icon: <BarChart2 size={16} /> },
      { path: '/taluk/users',            label: 'Manage Users',           icon: <Users size={16} /> },
    ],
    district: [
      { path: '/district',                   label: 'Dashboard',          icon: <LayoutDashboard size={16} /> },
      { path: '/district/approval-queue',    label: 'Queue',              icon: <Inbox size={16} />, badge: queueCount },
      { path: '/district/active-emergencies',label: 'Active',             icon: <ShieldAlert size={16} /> },
      { path: '/district/resource-command',  label: 'Resources',          icon: <Navigation size={16} /> },
      { path: '/district/alert-broadcast',   label: 'Broadcasts',         icon: <Radio size={16} /> },
      { path: '/district/analytics',         label: 'Analytics',          icon: <BarChart2 size={16} /> },
    ],
    collector: [
      { path: '/collector',                   label: 'Dashboard',           icon: <LayoutDashboard size={16} /> },

      { path: '/collector/broadcast-approval',label: 'Broadcast',           icon: <Radio size={16} /> },
      { path: '/collector/users',             label: 'Manage Users',        icon: <Users size={16} /> },
      { path: '/collector/situation-map',     label: 'Map',                 icon: <Map size={16} /> },
      { path: '/collector/ai-reports',        label: 'AI Report',           icon: <FileText size={16} /> },
      { path: '/collector/state-advisories',  label: 'State Advisories',    icon: <AlertTriangle size={16} /> },
    ],
    state: [
      { path: '/state',           label: 'Dashboard',          icon: <LayoutDashboard size={16} /> },
      { path: '/state/districts', label: 'Districts',          icon: <MapPin size={16} /> },
      { path: '/state/prediction',label: 'AI Prediction',      icon: <Brain size={16} /> },
      { path: '/state/users',     label: 'Manage Users',       icon: <Users size={16} /> },
    ],
  };

  const links = menuMap[user?.role] || [];
  const initials = user?.name?.substring(0, 2).toUpperCase() || '??';

  return (
    <div className="topbar">
      {/* Left: Brand */}
      <div className="topbar-brand">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYrCtU8k-Z8dC8m0yFrXAll8qUAYJeg6ypB-MGZ2-keA&s=10" alt="TN Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
        <div className="topbar-brand-text">
          <div className="topbar-brand-name">AlertGov</div>
          <div className="topbar-brand-sub">{ROLE_LABELS[user?.role] || 'Dashboard'}</div>
        </div>
      </div>

      {/* Middle: Navigation Links */}
      <nav className="topbar-nav">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.split('/').length === 2}
            className={({ isActive }) => `topnav-item${isActive ? ' active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge > 0 && <span className="topnav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Right: User actions & status */}
      <div className="topbar-actions">
        {/* Date + Time */}
        <div className="topbar-time-chip">
          <span className="date-text">{dateStr}</span>
          <span className="time-text">{timeStr}</span>
        </div>

        {/* Bell */}
        <button
          className="btn btn-ghost topbar-icon-btn"
          onClick={() => navigate(`/${user?.role}/notifications`)}
        >
          <Bell size={18} color="var(--text-secondary)" />
          <span className="topbar-notification-dot" />
        </button>

        {/* User Profile */}
        <div className="topbar-user-profile" onClick={() => navigate(`/${user?.role}/profile`)}>
          <div className="topbar-avatar">{initials}</div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">{user?.name}</span>
            <span className="topbar-user-id">{user?.id}</span>
          </div>
          <button className="btn btn-ghost" style={{ padding: '4px', marginLeft: '4px' }} onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
            <LogOut size={16} color="var(--text-muted)" />
          </button>
        </div>
      </div>
    </div>
  );
}

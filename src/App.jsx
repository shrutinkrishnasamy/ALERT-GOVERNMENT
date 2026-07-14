import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LiveProvider } from './context/LiveContext';
import AppShell from './components/Layout/AppShell';

// Auth
import LoginPage from './pages/Login/LoginPage';

// Common
import Profile from './pages/common/Profile';
import Notifications from './pages/common/Notifications';

// Landing
import LandingPage from './pages/Landing/LandingPage';

// Public Pages
import WebsitePolicies from './pages/Public/WebsitePolicies';
import HelpPage from './pages/Public/HelpPage';
import ContactUs from './pages/Public/ContactUs';
import Feedback from './pages/Public/Feedback';

// Village Pages
import VillageDashboard from './pages/Village/VillageDashboard';
import CreateIncident from './pages/Village/CreateIncident';
import ActiveIncidents from './pages/Village/ActiveIncidents';
import UpdateIncidentStatus from './pages/Village/UpdateIncidentStatus';
import UploadMedia from './pages/Village/UploadMedia';

// Taluk Pages
import TalukDashboard from './pages/Taluk/TalukDashboard';
import IncidentVerification from './pages/Taluk/IncidentVerification';
import TalukActiveIncidents from './pages/Taluk/TalukActiveIncidents';
import TalukMap from './pages/Taluk/TalukMap';
import TalukReports from './pages/Taluk/TalukReports';
import PrintReport from './pages/Taluk/PrintReport';

// District Pages
import DistrictDashboard from './pages/District/DistrictDashboard';
import DistrictApprovalQueue from './pages/District/DistrictApprovalQueue';
import ActiveEmergencies from './pages/District/ActiveEmergencies';
import ResourceCommand from './pages/District/ResourceCommand';
import AlertBroadcast from './pages/District/AlertBroadcast';
import DistrictGISMap from './pages/District/DistrictGISMap';
import DistrictAnalytics from './pages/District/DistrictAnalytics';
import IncidentTimeline from './pages/District/IncidentTimeline';

// Collector Pages
import CollectorDashboard from './pages/Collector/CollectorDashboard';
import CriticalIncidents from './pages/Collector/CriticalIncidents';
import BroadcastApproval from './pages/Collector/BroadcastApproval';
import DistrictSituationMap from './pages/Collector/DistrictSituationMap';
import ExecutiveAnalytics from './pages/Collector/ExecutiveAnalytics';
import OfficialOrders from './pages/Collector/OfficialOrders';
import AIReports from './pages/Collector/AIReports';
import StateAdvisories from './pages/Collector/StateAdvisories';

// State Pages
import StateDashboard from './pages/State/StateDashboard';
import StateMap from './pages/State/StateMap';
import DistrictStatus from './pages/State/DistrictStatus';
import DisasterPrediction from './pages/State/DisasterPrediction';
import DistrictMonitor from './pages/State/DistrictMonitor';

// Admin / User Management
import UserManagement from './pages/common/UserManagement';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) {
    // Redirect to their actual role dashboard if they try to access another role's route
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
};

const RoleRouter = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Default redirect based on role
  if (user.role === 'village') return <Navigate to="/village" replace />;
  if (user.role === 'taluk') return <Navigate to="/taluk" replace />;
  if (user.role === 'district') return <Navigate to="/district" replace />;
  if (user.role === 'collector') return <Navigate to="/collector" replace />;
  if (user.role === 'state') return <Navigate to="/state" replace />;
  
  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LiveProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/policies" element={<WebsitePolicies />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/feedback" element={<Feedback />} />
          
          <Route path="/dashboard" element={<RoleRouter />} />

          {/* VILLAGE ROUTES */}
          <Route path="/village" element={<ProtectedRoute allowedRole="village"><AppShell /></ProtectedRoute>}>
            <Route index element={<VillageDashboard />} />
            <Route path="create-incident" element={<CreateIncident />} />
            <Route path="active-incidents" element={<ActiveIncidents />} />
            <Route path="update-status" element={<UpdateIncidentStatus />} />
            <Route path="upload-media" element={<UploadMedia />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* TALUK ROUTES */}
          <Route path="/taluk/print-report" element={<ProtectedRoute allowedRole="taluk"><PrintReport /></ProtectedRoute>} />
          <Route path="/taluk" element={<ProtectedRoute allowedRole="taluk"><AppShell /></ProtectedRoute>}>
            <Route index element={<TalukDashboard />} />
            <Route path="verification" element={<IncidentVerification />} />
            <Route path="active-incidents" element={<TalukActiveIncidents />} />
            <Route path="map" element={<TalukMap />} />
            <Route path="reports" element={<TalukReports />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* DISTRICT ROUTES */}
          <Route path="/district" element={<ProtectedRoute allowedRole="district"><AppShell /></ProtectedRoute>}>
            <Route index element={<DistrictDashboard />} />
            <Route path="approval-queue" element={<DistrictApprovalQueue />} />
            <Route path="active-emergencies" element={<ActiveEmergencies />} />
            <Route path="resource-command" element={<ResourceCommand />} />
            <Route path="alert-broadcast" element={<AlertBroadcast />} />
            <Route path="map" element={<DistrictGISMap />} />
            <Route path="analytics" element={<DistrictAnalytics />} />
            <Route path="timeline" element={<IncidentTimeline />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* COLLECTOR ROUTES */}
          <Route path="/collector" element={<ProtectedRoute allowedRole="collector"><AppShell /></ProtectedRoute>}>
            <Route index element={<CollectorDashboard />} />
            <Route path="critical-incidents" element={<CriticalIncidents />} />
            <Route path="broadcast-approval" element={<BroadcastApproval />} />
            <Route path="situation-map" element={<DistrictSituationMap />} />
            <Route path="analytics" element={<ExecutiveAnalytics />} />
            <Route path="official-orders" element={<OfficialOrders />} />
            <Route path="ai-reports" element={<AIReports />} />
            <Route path="state-advisories" element={<StateAdvisories />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* STATE ROUTES */}
          <Route path="/state" element={<ProtectedRoute allowedRole="state"><AppShell /></ProtectedRoute>}>
            <Route index element={<StateDashboard />} />
            <Route path="map" element={<StateMap />} />
            <Route path="districts" element={<DistrictStatus />} />
            <Route path="monitor/:district" element={<DistrictMonitor />} />
            <Route path="prediction" element={<DisasterPrediction />} />
            {/* Using generic placeholders for the remaining to avoid errors */}
            <Route path="requests" element={<div style={{padding: 40}}>Collector Requests (State)</div>} />
            <Route path="analytics" element={<div style={{padding: 40}}>State Analytics</div>} />
            <Route path="resources" element={<div style={{padding: 40}}>Resource Distribution</div>} />
            <Route path="users" element={<UserManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </LiveProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

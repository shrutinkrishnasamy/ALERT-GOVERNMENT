# AlertGov AI Frontend Implementation Plan

- [x] **Project Setup & Base Architecture**
  - [x] Initialize Vite React project
  - [x] Configure Tailwind (or vanilla CSS as requested) — *Using robust vanilla CSS token system `index.css`*
  - [x] Set up React Router for RBAC
  - [x] Create Global Context (`AuthContext.jsx`)
  - [x] Generate mock data (`mockData.js`)

- [x] **Shared UI Components**
  - [x] `AppShell`, `Sidebar`, `TopBar`
  - [x] Common widgets: `StatCard`, `SeverityBadge`, `StatusBadge`, `AIPanel`, `Timeline`, `Modal`
  - [x] Interactive GIS Map integration (Leaflet)

- [x] **Authentication Flow**
  - [x] Single Login Page (Officer ID based)
  - [x] RBAC Routing Engine

- [x] **Role 1: Village Emergency Operator (VEO)**
  - [x] Dashboard
  - [x] Create Incident (AI Severity, GPS, Voice)
  - [x] Active Incidents Table
  - [x] Update Incident Status
  - [x] Upload Media
  - [x] Notifications
  - [x] Profile

- [x] **Role 2: Taluk Officer**
  - [x] Dashboard (Verification Queue)
  - [x] Incident Verification (AI Analysis)
  - [x] Active Incidents
  - [x] GIS Map
  - [x] Reports (Recharts)
  - [x] Notifications

- [x] **Role 3: District EOC (Command Center)**
  - [x] Dashboard (Multi-incident tracking, Health Score)
  - [x] Approval Queue
  - [x] Active Emergencies (Live Map & Dept feed)
  - [x] Resource Command (Fire/Police dispatch)
  - [x] Alert Broadcast Configuration (AI Radio Script)
  - [x] District GIS Map
  - [x] Analytics
  - [x] Incident Timeline
  - [x] Notifications

- [x] **Role 4: District Collector (Executive)**
  - [x] Executive Dashboard
  - [x] Critical Incidents (Escalation Review)
  - [x] Broadcast Approval
  - [x] Evacuation Management
  - [x] District Situation Map
  - [x] Executive Analytics
  - [x] Official Orders (PDF generation UI)
  - [x] AI Generated Reports
  - [x] Notifications

- [x] **Role 5: State Administrator**
  - [x] State Dashboard
  - [x] State Map
  - [x] District Status Matrix
  - [x] Disaster Prediction (AI)
  - [x] Generic pages mapped

- [x] **Verification & Polish**
  - [x] Ensure white/clean professional government aesthetic
  - [x] Map interactions functional
  - [x] Charts rendering

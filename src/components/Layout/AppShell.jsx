import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div className="app-container">
      <TopBar />
      <main className="main-content page-content">
        <Outlet />
      </main>
    </div>
  );
}

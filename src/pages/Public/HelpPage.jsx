import React from 'react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function HelpPage() {
  return (
    <div className="public-page">
      <header className="public-header">
        <Link to="/">← Back to Home</Link>
        <h1>Help</h1>
      </header>
      <div className="public-content">
        <p>Need assistance with ALERTGOV AI? Please review the options below.</p>
        
        <h3>Officer Login Issues</h3>
        <p>If you are unable to log in, please ensure you are using the correct tier prefix (e.g., VEO, TAL, DEC, COL, STA) followed by your ID. If you have forgotten your credentials, contact your immediate superior in the command chain.</p>
        
        <h3>Reporting an Incident</h3>
        <p>Village level officers should navigate to the 'Create Incident' screen to report emergencies immediately. Ensure location services are enabled for geotagging.</p>
        
        <h3>System Requirements</h3>
        <p>AlertGov AI is optimized for all modern web browsers (Chrome, Firefox, Safari, Edge). Ensure JavaScript is enabled. For field workers, the mobile app requires Android 8.0+ or iOS 12.0+.</p>

        <h3>Emergency Contact</h3>
        <p>In case of a system failure during an active disaster, fall back to the State Control Room hotline: <strong>1070</strong>.</p>
      </div>
    </div>
  );
}

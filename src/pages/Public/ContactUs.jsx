import React from 'react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function ContactUs() {
  return (
    <div className="public-page">
      <header className="public-header">
        <Link to="/">← Back to Home</Link>
        <h1>Contact Us</h1>
      </header>
      <div className="public-content">
        <h2>State Administration, Tamil Nadu</h2>
        <p><strong>Address:</strong> Secretariat, Fort St. George, Chennai - 600009</p>
        <p><strong>Email:</strong> cs[at]tn[dot]gov[dot]in</p>
        <p><strong>Phone:</strong> 044-25671555</p>
        
        <hr style={{margin: '2rem 0', borderColor: '#eee'}} />
        
        <h2>ALERTGOV AI Support Center</h2>
        <p>For technical issues regarding the Emergency Alert & Disaster Management Network:</p>
        <p><strong>Email:</strong> support@alertgov.ai</p>
        <p><strong>Helpline:</strong> 1077 (Toll Free / 24x7)</p>
        <p><strong>State Control Room:</strong> 1070</p>
      </div>
    </div>
  );
}

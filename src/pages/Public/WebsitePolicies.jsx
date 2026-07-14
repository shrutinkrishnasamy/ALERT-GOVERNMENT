import React from 'react';
import { Link } from 'react-router-dom';
import './PublicPages.css';

export default function WebsitePolicies() {
  return (
    <div className="public-page">
      <header className="public-header">
        <Link to="/">← Back to Home</Link>
        <h1>Website Policies</h1>
      </header>
      <div className="public-content">
        <h2>Copyright Policy</h2>
        <p>Material featured on this portal may be reproduced free of charge after taking proper permission by sending a mail to us. However, the material has to be reproduced accurately and not to be used in a derogatory manner or in a misleading context.</p>
        
        <h2>Privacy Policy</h2>
        <p>ALERTGOV AI does not automatically capture any specific personal information from you (like name, phone number or e-mail address), that allows us to identify you individually. Any personal information provided is protected.</p>
        
        <h2>Hyperlink Policy</h2>
        <p>Links to other websites that have been included on this Portal are provided for public convenience only. ALERTGOV AI is not responsible for the contents or reliability of linked websites and does not necessarily endorse the view expressed within them.</p>

        <h2>Terms and Conditions</h2>
        <p>This website is designed, developed and maintained by National Informatics Centre and content provided by Coimbatore District Administration for the ALERTGOV AI Emergency Network.</p>
      </div>
    </div>
  );
}

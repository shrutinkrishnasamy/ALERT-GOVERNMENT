import React from 'react';
import { Link } from 'react-router-dom';
import './PublicPages.css';
import Swal from 'sweetalert2';

export default function Feedback() {
  return (
    <div className="public-page">
      <header className="public-header">
        <Link to="/">← Back to Home</Link>
        <h1>Feedback</h1>
      </header>
      <div className="public-content">
        <p>We welcome your feedback on ALERTGOV AI to help us improve disaster management responses.</p>
        
        <form className="feedback-form" onSubmit={(e) => { e.preventDefault(); Swal.fire({title: 'Success', text: 'Thank you! Your feedback has been submitted successfully.', icon: 'success', confirmButtonColor: '#1C4E80'}); e.target.reset(); }}>
          <label>Name</label>
          <input type="text" placeholder="Your Name" required />
          
          <label>Email Address</label>
          <input type="email" placeholder="Your Email" required />
          
          <label>Mobile Number (Optional)</label>
          <input type="tel" placeholder="Your Mobile Number" />
          
          <label>Feedback / Suggestions</label>
          <textarea rows="6" placeholder="Please enter your comments here..." required></textarea>
          
          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
}

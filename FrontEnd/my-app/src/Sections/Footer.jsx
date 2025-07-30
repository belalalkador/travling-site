// src/components/Footer.jsx

import React from 'react';
import { FaPhone, FaWhatsapp } from 'react-icons/fa'; // Import icons
import './sections.css'; // Import the CSS file

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>Contact Admin</h2>
        <div className="contact-info">
          <div className="contact-item">
            <FaPhone className="icon" />
            <span>+123 456 7890</span> {/* Replace with real number if needed */}
          </div>
          <div className="contact-item">
            <FaWhatsapp className="icon" />
            <span>+123 456 7890</span> {/* WhatsApp number */}
          </div>
        </div>
        <p className="footer-text">© 2025 TravelSite. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;


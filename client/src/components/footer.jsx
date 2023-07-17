import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="contact">
          <h3>Contact Us</h3>
          <p>Email: info@example.com</p>
          <p>Phone: 123-456-7890</p>
          {/* Add more contact information as needed */}
        </div>
        <div className="social-media">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="#"><FontAwesomeIcon icon={faFacebookF} /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Pollite Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

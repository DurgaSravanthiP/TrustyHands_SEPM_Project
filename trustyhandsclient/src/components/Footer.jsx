import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <i className="fas fa-hands-helping"></i>
              <span>Trustyhands</span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                maxWidth: "300px",
                marginBottom: "18px",
                color: "var(--text-footer)",
              }}
            >
              Connecting customers with trusted local workers for any task,
              anytime, anywhere.
            </p>
            <div className="footer-social-icons">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/how-it-works">How it Works</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/safety">Safety Guidelines</Link>
              </li>
              <li>
                <Link to="/worker-resources">Worker Resources</Link>
              </li>
              <li>
                <Link to="/customer-resources">Customer Resources</Link>
              </li>
              <li>
                <Link to="/community">Community</Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/worker-agreement">Worker Agreement</Link>
              </li>
              <li>
                <Link to="/cookie-policy">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/gdpr">GDPR Compliance</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          <p>
            &copy; 2026 Trustyhands. All rights reserved. Premium Service
            Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

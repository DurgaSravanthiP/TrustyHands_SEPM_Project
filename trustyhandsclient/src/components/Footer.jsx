import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3 className="footer-logo">Trusty<span>Hands</span></h3>
          <p className="footer-about">
            India's most reliable platform connecting skilled professionals with local householders. 
            Empowering workers and simplifying home maintenance since 2023.
          </p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Our Services</h4>
          <ul className="footer-links">
            <li><Link to="/services">Electrician</Link></li>
            <li><Link to="/services">Plumber</Link></li>
            <li><Link to="/services">Deep Cleaning</Link></li>
            <li><Link to="/services">Carpentry</Link></li>
            <li><Link to="/services">Appliance Repair</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <ul className="contact-info">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Guntur, Andhra Pradesh, India</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+91 98765 43210</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>support@trustyhands.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} TrustyHands. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

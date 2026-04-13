import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <div
              className="logo"
              style={{
                marginBottom: "15px",
                fontSize: "20px",
                color: "var(--earth-yellow)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
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
            <div className="social-icons">
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
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Contact Us</h3>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>support@trustyhands.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>+91 86394 52100</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
            </div>
          </div>

          <div className="footer-column">
            <h3>Our Address</h3>
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span className="footer-address-text">
                Plot No. 45, Srinagar Colony,
                <br />
                Guntur, AP 522006,
                <br />
                India
              </span>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>
            &copy; {new Date().getFullYear()} Trustyhands. All rights reserved.
            Premium Service Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

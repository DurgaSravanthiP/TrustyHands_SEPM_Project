import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navLinkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <i className="fas fa-hands-helping"></i>
          <span>Trustyhands</span>
        </div>
        <nav className="navbar-nav">
          <ul>
            <li>
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={navLinkClass}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/how-it-works" className={navLinkClass}>
                How It Works
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>
                Contact Us
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="navbar-auth-buttons">
          <NavLink to="/login" className="btn btn-outline">
            Log In
          </NavLink>
          <NavLink to="/register" className="btn btn-primary">
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

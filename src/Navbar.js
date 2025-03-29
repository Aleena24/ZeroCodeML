import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Logo */}
        <div className="navbar-logo">
          <img 
            src="./img/logo.png" 
            alt="ZeroCodeML Logo" 
            className="logo-img" 
          />
          <span className="website-name"><b>ZeroCodeML</b></span>
        </div>

        {/* Center: Navigation Links */}
        <ul className="navbar-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/about" className="nav-link">About Us</Link></li>
          <li><Link to="/services" className="nav-link">Services</Link></li>
        </ul>

        {/* Right Side: Get Started Button */}
        <div className="navbar-button-container">
          <Link to="/main" className="get-started-button">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

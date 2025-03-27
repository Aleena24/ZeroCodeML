import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Navigation Links */}
        <div className="footer-links">
          <a href="/" className="footer-link">Home</a>
          <a href="/main" className="footer-link">Upload</a>
          <a href="/about" className="footer-link">About</a>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="footer-text">
          ZeroCodeML © 2025 | All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

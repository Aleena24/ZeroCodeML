import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
      

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
          <a href="https://www.linkedin.com/in/christ-university-computer-science-958aaa299/" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaLinkedin />
          </a>
        </div>

        {/* Copyright */}
        <p className="footer-text">
          ZeroCodeML © 2025 | All Rights Reserved.
        </p>

        <p className="footer-class">
          Batch of MSc AIML 
        </p>

      </div>
    </footer>
  );
};

export default Footer;

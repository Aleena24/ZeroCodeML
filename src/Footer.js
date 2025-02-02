import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="/" className="footer-link">Home</a>
          <a href="/main" className="footer-link">Upload</a>
          <a href="/about" className="footer-link">About</a>
        </div>
        <p className="footer-text">
          ZeroCodeML © 2025  | All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

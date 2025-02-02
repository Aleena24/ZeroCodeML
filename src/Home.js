import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import './AboutUs';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* About Us Button Icon */}
      <div className="top-right-link">
        <Link to="/about" className="about-us-link">
          <img 
            src="./img/abt.png" 
            alt="About Us Icon" 
            className="about-us-icon" 
          />
        </Link>
      </div>

      {/* Feature 1: Video Background */}
      <div className="feature-section" id="feature-1">
        <video className="background-video" autoPlay loop muted
        style={{
          opacity: 1,
        }
        }>
          <source src="./img/logo1.mp4" type="video/mp4" />
        </video>
      </div>

      <div
  className="feature-section"
  id="feature-2"
  style={{
    backgroundImage: 'url(./img/two.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="content-overlay"
      style={{
        background: 'rgba(255, 255, 255, 0.1)', // Dark semi-transparent background
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px', // Limit content width for better readability
        textAlign: 'center', // Center text inside the box
      }}
  >
    
    <h2
      className="feature-title"
      style={{
        color: '#063979', // Example color
      }}
    >
      Unleash the Power of Your Data 
    </h2>
    <p
      className="feature-description"
      style={{
        color: '#21130d', // Example color
        height: 'auto'
      }}
    >
      Ever wished you could squeeze insights out of your data without needing to
      learn complex coding or algorithms? Meet ZeroCodeML, your friendly data wizard!

      <br/><br/>

      <b>Simplify data analysis:</b><br/> Empower non-coders and beginners to explore their data like pros.<br/><br/>
      <b>Democratize machine learning:</b><br/> Make advanced algorithms and AI explainability accessible to everyone.<br/><br/>
      <b>Bridge the gap between data and decisions:</b><br/> Help users turn raw data into actionable insights with ease.<br/><br/>
    </p>
  </div>
</div>


      {/* Feature 2: Image Background */}
      <div className="feature-section" id="feature-1">
        <video className="background-video" autoPlay loop muted>
          <source src="./img/AI.mp4" type="video/mp4" />
        </video>
        <div className="content-overlay">
          <h2 className="feature-title">Why Choose ZeroCodeML ?</h2>
          <p className="feature-description">
          <b>Ease of Use:</b> <br/>Simplifies even the most technical data workflows.<br/><br/>
          <b>Engaging & Interactive:</b><br/> A seamless blend of functionality and fun.<br/><br/>
          <b>Scalable Insights:</b><br/> From hobby projects to business needs, ZeroCodeML grows with you.<br/><br/>
          </p>
        </div>
      </div>

      <div
  className="feature-section"
  id="feature-2"
  style={{
    backgroundImage: 'url(./img/two.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
<div className="content-overlay"
      style={{
        background: 'rgba(255, 255, 255, 0.1)', // Dark semi-transparent background
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px', // Limit content width for better readability
        textAlign: 'center', // Center text inside the box
      }}
  >
    
    <h6
      className="feature-title"
      style={{
        color: '#063979', // Example color
      }}
    >
      What ZeroCodeML Can Do
    </h6>
    <p
      className="feature-description"
      style={{
        color: '#21130d', // Example color
      }}
    >
      
<b>Plug & Play Data:</b><br/> Upload your files (.csv, .xlsx, images, etc.) effortlessly.<br/><br/>
<b>Explore Your Data:</b><br/> Automated EDA (Exploratory Data Analysis) with intuitive visualizations.<br/><br/>

<b>AI That Speaks Your Language:</b><br/> Our explainable AI bot translates complex results into simple, actionable insights.<br/><br/>
<b>No Code? No Problem!:</b><br/> Designed for users with zero coding experience—data analytics at your fingertips!<br/><br/>

    </p>
  </div>
</div>

      {/* Floating Button */}
      <Link to="/main" className="floating-button">
        Take Me Now
      </Link>
    </div>
  );
};

export default HomePage;

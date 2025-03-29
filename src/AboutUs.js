// AboutUs.js
import React from 'react';
import './AboutUs.css';  // Make sure to have your CSS styles imported
import Footer from "./Footer";
import Navbar from "./Navbar";

const AboutUs = () => {
  // Array of team members
  const teamMembers = [
    // Faculty Coordinator
    { name: 'Dr. Chandra J', role: 'Faculty Coordinator', imgSrc: './img/CM.jpg', linkedIn: 'https://www.linkedin.com/in/dr-chandra-j-98685334/' },
    { name: 'Dr. Tejil J John', role: 'Faculty Coordinator', imgSrc: './img/TS.jpeg', linkedIn: 'https://www.linkedin.com/in/dr-tegil-j-john-1b7a34150/' },

    // Core Team
    { name: 'Himanshu Gulecha', role: 'Core Team', imgSrc: './img/1.png', linkedIn: 'https://www.linkedin.com/in/himanshugulechha?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },
    { name: 'Priyansha Upadhyay', role: 'Core Team', imgSrc: './img/2.png', linkedIn: 'https://www.linkedin.com/in/priyansha1306/' },
    { name: 'Satyam Kumar', role: 'Core Team', imgSrc: './img/3.png', linkedIn: 'https://www.linkedin.com/in/satyamkumar09/' },

    // Frontend Team
    { name: 'Aleena Varghese', role: 'Frontend Developer', imgSrc: './img/4.png', linkedIn: 'http://www.linkedin.com/in/aleena-varghese-atv024' },
    { name: 'Sanin Zulphi', role: 'Frontend Developer', imgSrc: './img/5.png', linkedIn: 'https://www.linkedin.com/in/sanin-zulphi-590b58231/' },
    { name: 'Sneha P', role: 'Frontend Developer', imgSrc: './img/6.png', linkedIn: 'https://www.linkedin.com/in/sneha-p-5995sspp' },

    // Backend Team
    { name: 'Badrinarayanan S', role: 'Backend Developer', imgSrc: './img/7.png', linkedIn: 'https://www.linkedin.com/in/badrinarayanan-s-43629522a/' },
    { name: 'Kiran Basil Varghese', role: 'Backend Developer', imgSrc: './img/8.png', linkedIn: 'https://www.linkedin.com/in/kiran-basil/' },
    { name: 'Kripa Mary Jose', role: 'Backend Developer', imgSrc: './img/9.png', linkedIn: 'https://www.linkedin.com/in/kripa-mary-jose-b21555166/' },

    // Preprocessing Team
    { name: 'Bagyalakshmi S S', role: 'Preprocessing', imgSrc: './img/10.png', linkedIn: 'https://www.linkedin.com/in/bagyalakshmi-s-shinde-048559246/' },
    { name: 'C Steffi Angel', role: 'Preprocessing', imgSrc: './img/11A.png', linkedIn: 'https://www.linkedin.com/in/c-steffi-angel-8882a4244/' },
    { name: 'Elizabeth George', role: 'Preprocessing', imgSrc: './img/11.png', linkedIn: 'https://www.linkedin.com/in/elizabeth-george-62123322b/' },
    { name: 'Manav Gupta', role: 'Preprocessing', imgSrc: './img/12.png', linkedIn: 'https://www.linkedin.com/in/manav-gupta-83093a23b/' },
    { name: 'Manashwy Padhi', role: 'Preprocessing', imgSrc: './img/40.png', linkedIn: 'https://www.linkedin.com/in/manashwy-padhi-1664b576/' },
    { name: 'Nanditha S', role: 'Preprocessing', imgSrc: './img/13.png', linkedIn: 'http://www.linkedin.com/in/nanditha-s-385359247' },


    // Model Implementation Team
    { name: 'Christina J Thattil', role: 'Model Implementation', imgSrc: './img/14.png', linkedIn: 'https://www.linkedin.com/in/christina-thattil-2b32a8284?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    { name: 'Deyon Rose Babu T', role: 'Model Implementation', imgSrc: './img/15.png', linkedIn: 'https://www.linkedin.com/in/deyon-rose-babu-thomas/' },
    { name: 'Dhyan R', role: 'Model Implementation', imgSrc: './img/16.png', linkedIn: 'https://www.linkedin.com/in/dhyan-r/' },
    { name: 'Epista R', role: 'Model Implementation', imgSrc: './img/17.png', linkedIn: 'https://www.linkedin.com/in/epsita-rajesh/' },
    { name: 'Ismail Basheer', role: 'Model Implementation', imgSrc: './img/18.png', linkedIn: 'https://www.linkedin.com/in/ismail-basheer/' },
    { name: 'Karthikeyan K J', role: 'Model Implementation', imgSrc: './img/19.png', linkedIn: 'https://www.linkedin.com/in/karthikeyan-kj/' },
    { name: 'M Surendran', role: 'Model Implementation', imgSrc: './img/20.png', linkedIn: 'https://www.linkedin.com/in/surendran-m-71a7501a9/' },
    { name: 'Manu Martin', role: 'Model Implementation', imgSrc: './img/22.png', linkedIn: 'https://www.linkedin.com/in/manu-martin-7556971ba/' },
    { name: 'Marcus Daniel P', role: 'Model Implementation', imgSrc: './img/23.png', linkedIn: 'https://www.linkedin.com/in/marcus-daniel-p-b35b00284/' },
    { name: 'Melvin Infant A', role: 'Model Implementation', imgSrc: './img/24.png', linkedIn: 'https://www.linkedin.com/in/melvininfant/' },
    { name: 'Muzzammil Razin PA', role: 'Model Implementation', imgSrc: './img/25.png', linkedIn: 'https://www.linkedin.com/in/muzzammil-razin/' },
    { name: 'Ponwinsiya P', role: 'Model Implementation', imgSrc: './img/27.png', linkedIn: 'https://www.linkedin.com/in/ponwinsiya-ponpandi-585a611ba/' },
    { name: 'Pradakshina P', role: 'Model Implementation', imgSrc: './img/28.png', linkedIn: 'https://www.linkedin.com/in/pradakshina-premkumar-609043248/' },
    { name: 'Rahul Krishna K R', role: 'Model Implementation', imgSrc: './img/29.png', linkedIn: 'https://www.linkedin.com/in/rahul-krishna-kr/' },
    { name: 'Ranjan Shruti I', role: 'Model Implementation', imgSrc: './img/30.png', linkedIn: 'https://www.linkedin.com/in/shruti-ranjan20/' },
    { name: 'Ridhin Issac A', role: 'Model Implementation', imgSrc: './img/31.png', linkedIn: 'http://www.linkedin.com/in/ridhinissacabraham' },
    { name: 'Ritushree Dey', role: 'Model Implementation', imgSrc: './img/32.png', linkedIn: 'https://www.linkedin.com/in/ritushree-dey/' },
    { name: 'Samson Sabu', role: 'Model Implementation', imgSrc: './img/33.png', linkedIn: 'https://www.linkedin.com/in/samson-sabu-8aab0a22b/' },
    { name: 'Sanjay S', role: 'Model Implementation', imgSrc: './img/34.png', linkedIn: 'http://www.linkedin.com/in/SanjaySathiyasankar' },
    { name: 'Swapnali Singh', role: 'Model Implementation', imgSrc: './img/35.png', linkedIn: 'https://www.linkedin.com/in/swapnali-singh-3969a9247/' },
    { name: 'Swetha R', role: 'Model Implementation', imgSrc: './img/36.png', linkedIn: 'https://www.linkedin.com/in/swethar68/' },
    { name: 'Victor Jose I J', role: 'Model Implementation', imgSrc: './img/37.png', linkedIn: 'https://www.linkedin.com/in/victor-jose-i-j-210903284' },
    { name: 'Reeve R Mathew', role: 'Model Implementation', imgSrc: './img/38.png', linkedIn: 'https://www.linkedin.com/in/reeve-r-mathew-744b11284?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },


    // Research Team
    { name: 'Akshithaa Parvathavardhini', role: 'Research Team', imgSrc: './img/39.png', linkedIn: 'https://www.linkedin.com/in/akshithaa-parasuram/' },
    { name: 'Neha Seirah Biju', role: 'Research Team', imgSrc: './img/26.png', linkedIn: 'https://www.linkedin.com/in/neha-seirah-biju-940130216/' },
    { name: 'Vikash Krishna R', role: 'Research Team', imgSrc: './img/41.png', linkedIn: 'https://www.linkedin.com/in/vikash-krishna-r-0a01b2285/' },
    { name: 'Vivegavane D', role: 'Research Team', imgSrc: './img/42.png', linkedIn: 'https://www.linkedin.com/in/vivegavane/' },

  ];

  return (
    <div className="about-page">
      <Navbar/>
      {/* Header Section */}
      <section className="about-header">
        <h1>We are Team ZeROCodeML</h1>
        <p>
          For our ZeROCodeML Website, our team brings together a
          diverse set of skills and expertise, creating a dynamic and effective
          collaboration.
        </p>
      </section>

      <section className="project-overview">
  <div className="image-container">
    <img
      src="./img/PA.jpg"
      alt="Predictive Analysis"
      className="overview-image"
    />
  </div>
  <div className="text-content">
  <p>We are a team of postgraduate students from the <b>M.Sc. Artificial Intelligence 
    and Machine Learning program at CHRIST (Deemed to be University), Bangalore.</b> 
    We proudly present <b>ZeroCodeML, an intuitive no-code machine learning (ML)</b> 
    platform designed to streamline the ML workflow for users with little to 
    no programming experience. Our platform enables users to seamlessly upload 
    datasets, perform automated exploratory data analysis (EDA), preprocess data, 
    and generate valuable insights, predictions, and visualizations with ease.
  </p>
  <p>Driven by a commitment to harnessing <b>advanced AI and machine learning techniques,</b>
     we recognized the need for a powerful yet user-friendly solution to simplify 
     complex ML processes. <b>ZeroCodeML</b> empowers users with an efficient and intuitive 
     platform for end-to-end machine learning model development and data analysis, 
     eliminating the technical barriers typically associated with ML implementation.
</p>
<p>This is <b>Version 1.0</b> of <b>ZeroCodeML</b>, and we are continuously working to enhance 
  its capabilities. Future versions will introduce expanded functionalities, 
  improved performance, and a more refined user experience. We are committed to 
  evolving this platform into a comprehensive ML solution that caters to a wide 
  range of users, from beginners to experienced professionals.</p>

<p>We appreciate your support and interest in our project and remain dedicated 
  to advancing the field of <b>Artificial Intelligence and Machine Learning</b> through  
  <b> innovative research and development.</b> Stay tuned for upcoming updates and enhancements!
</p>
  </div>
</section>


      {/* Team Section */}
      <section className="team-section">
        <h2>Our Team</h2>
        
        {/* Faculty Coordinator */}
        <h3>Faculty Coordinator</h3>
        <div className="team-grid">
          {teamMembers.filter(member => member.role.includes('Coordinator')).map((member, index) => (
            <div className="team-member" key={index}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className="member-image"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img src="./img/link.png" alt="LinkedIn" className="linkedin-icon" />
              </a>
            </div>
          ))}
        </div>

        {/* Core Team */}
        <h3>Core Team</h3>
        <div className="team-grid">
          {teamMembers.filter(member => member.role.includes('Core Team')).map((member, index) => (
            <div className="team-member" key={index}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className="member-image"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img src="./img/link.png" alt="LinkedIn" className="linkedin-icon" />
              </a>
            </div>
          ))}
        </div>

        {/* Frontend Team */}
        <h3>Frontend Team</h3>
        <div className="team-grid">
          {teamMembers.filter(member => member.role.includes('Frontend')).map((member, index) => (
            <div className="team-member" key={index}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className="member-image"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img src="./img/link.png" alt="LinkedIn" className="linkedin-icon" />
              </a>
            </div>
          ))}
        </div>

        {/* Backend Team */}
        <h3>Backend Team</h3>
        <div className="team-grid">
          {teamMembers.filter(member => member.role.includes('Backend')).map((member, index) => (
            <div className="team-member" key={index}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className="member-image"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img src="./img/link.png" alt="LinkedIn" className="linkedin-icon" />
              </a>
            </div>
          ))}
        </div>

        {/* Preprocessing Team */}
        <h3>Preprocessing Team</h3>
        <div className="team-grid">
          {teamMembers.filter(member => member.role.includes('Preprocessing')).map((member, index) => (
            <div className="team-member" key={index}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className="member-image"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img src="./img/link.png" alt="LinkedIn" className="linkedin-icon" />
              </a>
            </div>
          ))}
        </div>

        {/* Model Implementation Team */}
        <h3>Model Implementation Team</h3>
        <div className="team-grid">
          {teamMembers.filter(member => member.role.includes('Model Implementation')).map((member, index) => (
            <div className="team-member" key={index}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className="member-image"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img src="./img/link.png" alt="LinkedIn" className="linkedin-icon" />
              </a>
            </div>
          ))}
        </div>

                {/* Research Team */}
                <h3>Research Team</h3>
        <div className="team-grid">
          {teamMembers.filter(member => member.role.includes('Research')).map((member, index) => (
            <div className="team-member" key={index}>
              <img
                src={member.imgSrc}
                alt={member.name}
                className="member-image"
              />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                <img src="./img/link.png" alt="LinkedIn" className="linkedin-icon" />
              </a>
            </div>
          ))}
        </div>

      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;

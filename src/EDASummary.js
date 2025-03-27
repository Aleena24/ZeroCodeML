import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EDASummary.css";

const EdaSummary = () => {
  const [edaSummary, setEdaSummary] = useState(null);
  const [descriptiveStats, setDescriptiveStats] = useState(null);
  const [numericalPlot, setNumericalPlot] = useState("");
  const [correlationPlot, setCorrelationPlot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/eda-summary")
      .then((response) => {
        console.log("EDA Summary Response:", response.data);  // Debugging
        setEdaSummary(response.data.summary || "No data available");
      })
      .catch((error) => {
        console.error("Error fetching EDA Summary:", error);
        setErrorMessage("Error fetching EDA Summary.");
      });
  
    axios.get("http://localhost:5000/descriptive-stats")
      .then((response) => {
        console.log("Descriptive Stats Response:", response.data);
        setDescriptiveStats(response.data.descriptive_stats || "No data available");
      })
      .catch((error) => {
        console.error("Error fetching Descriptive Stats:", error);
        setErrorMessage("Error fetching Descriptive Statistics.");
      });
  
    axios.get("http://localhost:5000/numerical-distribution")
      .then((response) => {
        console.log("Numerical Distribution Response:", response.data);
        setNumericalPlot(response.data.numerical_distribution || "");
      })
      .catch((error) => {
        console.error("Error fetching Numerical Distribution:", error);
        setErrorMessage("Error fetching Numerical Distribution.");
      });
  
    axios.get("http://localhost:5000/correlation-heatmap")
      .then((response) => {
        console.log("Correlation Heatmap Response:", response.data);
        setCorrelationPlot(response.data.correlation_plot || "");
      })
      .catch((error) => {
        console.error("Error fetching Correlation Heatmap:", error);
        setErrorMessage("Error fetching Correlation Heatmap.");
      });
  }, []);
  

  const toggleExpand = (cardName) => {
    setExpandedCard(expandedCard === cardName ? null : cardName);
  };

  return (
    <div className="eda-container">
      <h1>Exploratory Data Analysis (EDA) Report</h1>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <div className="card-grid">
        {[
          { key: "eda", title: "EDA Summary", description: "A brief overview of dataset structure.", content: edaSummary },
          { key: "stats", title: "Descriptive Statistics", description: "Statistical summary of dataset variables.", content: descriptiveStats },
          { key: "num", title: "Numerical Distribution", description: "Graphical representation of numeric data.", content: numericalPlot, isImage: true },
          { key: "corr", title: "Correlation Heatmap", description: "Correlation analysis of dataset features.", content: correlationPlot, isImage: true }
        ].map(({ key, title, description, content, isImage }) => (
          <div key={key} className={`card ${expandedCard === key ? "expanded" : ""}`} onClick={() => toggleExpand(key)}>
            <div className="card-content">
              <h2>{title}</h2>
              {expandedCard === key ? (
                isImage ? (
                  <img src={`data:image/png;base64,${content}`} alt={title} className="eda-image" />
                ) : (
                  <pre className="eda-json">{JSON.stringify(content, null, 2)}</pre>
                )
              ) : (
                <p className="card-description">{description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="button-container">
        <button className="back-button" onClick={() => navigate("/main")}>Back</button>
        <button className="next-button" onClick={() => navigate("/algorithm")}>Next</button>
      </div>
    </div>
  );
};

export default EdaSummary;

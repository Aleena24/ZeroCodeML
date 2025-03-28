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
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/eda-summary")
      .then((response) => {
        setEdaSummary(response.data.summary || "No data available");
      })
      .catch(() => setErrorMessage("Error fetching EDA Summary."));

    axios.get("http://localhost:5000/descriptive-stats")
      .then((response) => {
        setDescriptiveStats(response.data.descriptive_stats || "No data available");
      })
      .catch(() => setErrorMessage("Error fetching Descriptive Statistics."));

    axios.get("http://localhost:5000/numerical-distribution")
      .then((response) => {
        setNumericalPlot(response.data.numerical_distribution || "");
      })
      .catch(() => setErrorMessage("Error fetching Numerical Distribution."));

    axios.get("http://localhost:5000/correlation-heatmap")
      .then((response) => {
        setCorrelationPlot(response.data.correlation_plot || "");
      })
      .catch(() => setErrorMessage("Error fetching Correlation Heatmap."));
  }, []);

  return (
    <div className="eda-container">
      <h1>Exploratory Data Analysis (EDA) Report</h1>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      
      {!selectedOption ? (
        <div className="card-grid">
          {["EDA Summary", "Descriptive Statistics", "Numerical Distribution", "Correlation Heatmap"].map((option) => (
            <div key={option} className="card" onClick={() => setSelectedOption(option)}>
              <div className="card-content">
                <h2>{option}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="selected-section">
          <button className="back-button" onClick={() => setSelectedOption(null)}>Back</button>
          <h2>{selectedOption}</h2>
          {selectedOption === "EDA Summary" && (
            <div className="flip-card-grid">
              {Object.entries(edaSummary || {}).map(([col, details]) => (
                <div key={col} className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <p>{col}</p>
                    </div>
                    <div className="flip-card-back">
                      <pre>{JSON.stringify(details, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedOption === "Descriptive Statistics" && (
            <div className="flip-card-grid">
              {Object.entries(descriptiveStats || {}).map(([col, details]) => (
                <div key={col} className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <p>{col}</p>
                    </div>
                    <div className="flip-card-back">
                      <pre>{JSON.stringify(details, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedOption === "Numerical Distribution" && numericalPlot && (
            <img src={`data:image/png;base64,${numericalPlot}`} alt="Numerical Distribution" className="eda-image-large" />
          )}
          {selectedOption === "Correlation Heatmap" && correlationPlot && (
            <img src={`data:image/png;base64,${correlationPlot}`} alt="Correlation Heatmap" className="eda-image-large" />
          )}
        </div>
      )}
    </div>
  );
};

export default EdaSummary;

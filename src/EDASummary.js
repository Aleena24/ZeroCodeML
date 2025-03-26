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
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch EDA Summary
    axios.get("http://localhost:5000/eda-summary")
      .then((response) => setEdaSummary(response.data.summary))
      .catch(() => setErrorMessage("Error fetching EDA Summary. Please try again."));

    // Fetch Descriptive Statistics
    axios.get("http://localhost:5000/descriptive-stats")
      .then((response) => {
        if (response.data.descriptive_stats) {
          setDescriptiveStats(response.data.descriptive_stats);
        } else {
          setErrorMessage(response.data.error || "Error fetching Descriptive Statistics.");
        }
      })
      .catch(() => setErrorMessage("Error fetching Descriptive Statistics."));

    // Fetch Numerical Distribution
    axios.get("http://localhost:5000/numerical-distribution")
      .then((response) => {
        if (response.data.numerical_distribution) {
          setNumericalPlot(response.data.numerical_distribution);
        }
      })
      .catch(() => setErrorMessage("Error fetching Numerical Distribution."));

    // Fetch Correlation Heatmap
    axios.get("http://localhost:5000/correlation-heatmap")
      .then((response) => {
        if (response.data.correlation_plot) {
          setCorrelationPlot(response.data.correlation_plot);
        }
      })
      .catch(() => setErrorMessage("Error fetching Correlation Heatmap."));
  }, []);

  return (
    <div className="eda-container">
      <h1>Exploratory Data Analysis (EDA) Report</h1>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      {edaSummary ? (
        <div className="eda-section">
          <h2>EDA Summary</h2>
          <pre className="eda-content">{JSON.stringify(edaSummary, null, 2)}</pre>
        </div>
      ) : <p>Loading EDA Summary...</p>}

      {descriptiveStats ? (
        <div className="eda-section">
          <h2>Descriptive Statistics</h2>
          <pre className="eda-content">{JSON.stringify(descriptiveStats, null, 2)}</pre>
        </div>
      ) : <p>Loading Descriptive Statistics...</p>}

      {numericalPlot ? (
        <div className="eda-section">
          <h2>Numerical Distribution</h2>
          <img src={`data:image/png;base64,${numericalPlot}`} alt="Numerical Distribution" className="eda-image" />
        </div>
      ) : <p>Loading Numerical Distribution...</p>}

      {correlationPlot ? (
        <div className="eda-section">
          <h2>Correlation Heatmap</h2>
          <img src={`data:image/png;base64,${correlationPlot}`} alt="Correlation Heatmap" className="eda-image" />
        </div>
      ) : <p>Loading Correlation Heatmap...</p>}

      <div className="button-container">
        <button className="back-button" onClick={() => navigate("/main")}>
          Back
        </button>
        <button className="next-button" onClick={() => navigate("/algorithm")}>
          Next
        </button>
      </div>
    </div>
  );
};

export default EdaSummary;

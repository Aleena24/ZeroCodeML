import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EDASummary.css";

const EdaSummary = () => {
  const [edaSummary, setEdaSummary] = useState(null);
  const [descriptiveStats, setDescriptiveStats] = useState(null);
  const [numericalPlot, setNumericalPlot] = useState("");
  const [correlationPlot, setCorrelationPlot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const edaResponse = await axios.get("http://localhost:5000/eda-summary");
        setEdaSummary(edaResponse.data.summary || null);
      } catch (error) {
        console.error("Error fetching EDA Summary:", error);
        setErrorMessage("Error fetching EDA Summary. Please upload a valid dataset.");
      }

      try {
        const statsResponse = await axios.get("http://localhost:5000/descriptive-stats");
        setDescriptiveStats(statsResponse.data.descriptive_stats || null);
      } catch {
        setErrorMessage("Error fetching Descriptive Statistics.");
      }

      try {
        const numericalResponse = await axios.get("http://localhost:5000/numerical-distribution");
        setNumericalPlot(numericalResponse.data.numerical_distribution || "");
      } catch {
        setErrorMessage("Error fetching Numerical Distribution.");
      }

      try {
        const correlationResponse = await axios.get("http://localhost:5000/correlation-heatmap");
        setCorrelationPlot(correlationResponse.data.correlation_plot || "");
      } catch {
        setErrorMessage("Error fetching Correlation Heatmap.");
      }
    };

    fetchData();
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
          {selectedOption === "EDA Summary" && edaSummary && (
            <div className="flip-card-grid">
              {Object.entries(edaSummary).map(([col, details]) => (
                <div key={col} className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <p>{col}</p>
                    </div>
                    <div className="flip-card-back">
                      <pre>
                        Missing: {details.missing} {"\n"}
                        Non-null: {details.non_null} {"\n"}
                        Unique: {details.unique} {"\n"}
                        Data Type: {details.data_type}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedOption === "Descriptive Statistics" && descriptiveStats && (
            <div className="flip-card-grid">
              {Object.entries(descriptiveStats).map(([col, details]) => (
                <div key={col} className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <p>{col}</p>
                    </div>
                    <div className="flip-card-back">
                      <pre>
                        Count: {details.count} {"\n"}
                        Mean: {details.mean.toFixed(2)} {"\n"}
                        Std Dev: {details.std.toFixed(2)} {"\n"}
                        Min: {details.min} {"\n"}
                        25%: {details["25%"]} {"\n"}
                        50% (Median): {details["50%"]} {"\n"}
                        75%: {details["75%"]} {"\n"}
                        Max: {details.max}
                      </pre>
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

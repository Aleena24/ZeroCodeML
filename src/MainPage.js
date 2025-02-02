import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import "./MainPage.css";

const MainPage = () => {
  const [view, setView] = useState("main");
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [edaSummary, setEdaSummary] = useState(null);
  const [descriptiveStats, setDescriptiveStats] = useState(null);
  const [numericalPlot, setNumericalPlot] = useState("");
  const [categoricalPlots, setCategoricalPlots] = useState({});
  const [correlationPlot, setCorrelationPlot] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const backgroundImageUrl = "./img/bg1.png";
    document.querySelector(".homepage-main").style.backgroundImage = `url(${backgroundImageUrl})`;
  }, []);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileType = uploadedFile.name.split(".").pop().toLowerCase();
      const allowedTypes = ["csv", "xlsx", "xls"];

      if (allowedTypes.includes(fileType)) {
        setFileName(uploadedFile.name);
        setFile(uploadedFile);
        setView("fileUploading");
        
        // Store file for later use
        localStorage.setItem('uploadedFile', uploadedFile);
        
        uploadFileToBackend(uploadedFile);
      } else {
        setErrorMessage("Please upload a valid file type: .csv, .xlsx, or .xls");
      }
    }
  };

  const uploadFileToBackend = async (uploadedFile) => {
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setEdaSummary(data.summary);
        setDescriptiveStats(data.descriptive_stats);
        setNumericalPlot(data.numerical_distribution);
        setCategoricalPlots(data.categorical_distributions);
        setCorrelationPlot(data.correlation_plot);
        setColumns(data.columns || []); // Store available columns
        setView("fileUploaded");
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Error uploading file. Please try again.");
      setView("main");
    }
  };

  const handleTargetColumnSelect = (event) => {
    const column = event.target.value;
    setTargetColumn(column);
    localStorage.setItem('targetColumn', column);
  };

  const handleSectionChange = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleNextClick = () => {
    if (!targetColumn) {
      setErrorMessage("Please select a target column before proceeding");
      return;
    }
    navigate("/algorithm");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div>
      <main className="homepage-main">
        {view === "main" && (
          <>
            <h1 className="headline">Build and evaluate ML algorithm automatically</h1>
            <p className="subheadline">Upload Your Data</p>

            <div className="cta">
              <label
                className="btn btn-secondary"
                data-tooltip="Upload CSV, Excel, or JSON files for text/numerical data"
              >
                Text / Numerical
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}
          </>
        )}

        {view === "fileUploading" && (
          <div className="alternate-content">
            <h1 className="headline">File Uploading...</h1>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {view === "fileUploaded" && (
          <div className="alternate-content">
            <div className="message-box">
              <h1>File Uploaded Successfully</h1>
              <p><strong>File Name:</strong> {fileName}</p>
              
              {/* Target Column Selection */}
              <div className="target-column-selection">
                <h3>Select Target Column</h3>
                <select 
                  value={targetColumn}
                  onChange={handleTargetColumnSelect}
                  className="column-select"
                >
                  <option value="">Select a column...</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <p>Proceed with your analysis now.</p>

              <div className="button-group">
                <button onClick={() => handleSectionChange("edaSummary")} className="btn btn-primary">
                  EDA Summary
                </button>
                <button onClick={() => handleSectionChange("descriptiveStats")} className="btn btn-primary">
                  Descriptive Statistics
                </button>
                <button onClick={() => handleSectionChange("numericalPlot")} className="btn btn-primary">
                  Numerical Distribution
                </button>
                <button onClick={() => handleSectionChange("correlationPlot")} className="btn btn-primary">
                  Correlation Heatmap
                </button>
              </div>

              {activeSection === "edaSummary" && edaSummary && (
                <div className="eda-summary">
                  <h2>EDA Summary</h2>
                  <pre>{JSON.stringify(edaSummary, null, 2)}</pre>
                </div>
              )}

              {activeSection === "descriptiveStats" && descriptiveStats && (
                <div className="descriptive-stats">
                  <h2>Descriptive Statistics</h2>
                  <pre>{JSON.stringify(descriptiveStats, null, 2)}</pre>
                </div>
              )}

              {activeSection === "numericalPlot" && numericalPlot && (
                <div className="plot-container">
                  <h2>Numerical Distribution</h2>
                  <img src={`data:image/png;base64,${numericalPlot}`} alt="Numerical Distribution" />
                </div>
              )}

              {activeSection === "correlationPlot" && correlationPlot && (
                <div className="plot-container">
                  <h2>Correlation Heatmap</h2>
                  <img src={`data:image/png;base64,${correlationPlot}`} alt="Correlation Heatmap" />
                </div>
              )}
            </div>

            <div className="swipe-button-container" onClick={handleNextClick}>
              <button className="swipe-button">
                <span>Swipe Next</span>
                <div className="arrow-container">
                  <div className="arrow"></div>
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="home-icon" onClick={handleHomeClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3l9 8h-3v10h-12v-10h-3z" />
        </svg>
      </div>

      <Footer />
    </div>
  );
};

export default MainPage;
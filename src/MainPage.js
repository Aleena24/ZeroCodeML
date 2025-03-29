import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "./MainPage.css"; // Ensure the background is handled in CSS

const MainPage = () => {
  const [view, setView] = useState("main");
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Removed unused 'file' state

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileType = uploadedFile.name.split(".").pop().toLowerCase();
      const allowedTypes = ["csv", "xlsx", "xls"];

      if (allowedTypes.includes(fileType)) {
        setFileName(uploadedFile.name);
        setView("fileUploading");

        localStorage.setItem("uploadedFile", uploadedFile.name); // Fixed: Store only file name
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
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        setView("fileUploaded");
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      setErrorMessage("Error uploading file. Please try again.");
      setView("main");
    }
  };

  return (
    <div className="zerocodeml-container">
      <Navbar />
      <main className="zerocodeml-content">
        <div className="zerocodeml-form-card">
          {view === "main" && (
            <>
              <h1 className="zerocodeml-form-title">Streamlined ML Workflow</h1>
              <p className="zerocodeml-form-subtitle">Upload Your File to Get Started</p>

              <div className="zerocodeml-upload-section">
                <label className="zerocodeml-upload-button">
                  Select File (.csv, .xlsx, .xls)
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {errorMessage && <p className="zerocodeml-error-text">{errorMessage}</p>}
            </>
          )}

          {view === "fileUploading" && (
            <>
              <h1>Uploading Your File...</h1>
              <div className="zerocodeml-progress-bar">
                <div className="zerocodeml-progress" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </>
          )}

          {view === "fileUploaded" && (
            <>
              <h1 className="zerocodeml-success-message">Upload Successful!</h1>
              <p className="zerocodeml-file-name">File Name: {fileName}</p>
              <button onClick={() => navigate("/eda-summary")} className="zerocodeml-eda-button">
                Proceed to EDA Summary
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;

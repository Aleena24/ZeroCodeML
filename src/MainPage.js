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
  const navigate = useNavigate();

  useEffect(() => {
    const backgroundImageUrl = "./img/bg1.png";
    document.querySelector(".mainpage-container").style.backgroundImage = `url(${backgroundImageUrl})`;
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileType = uploadedFile.name.split(".").pop().toLowerCase();
      const allowedTypes = ["csv", "xlsx", "xls"];

      if (allowedTypes.includes(fileType)) {
        setFileName(uploadedFile.name);
        setFile(uploadedFile);
        setView("fileUploading");
        
        localStorage.setItem("uploadedFile", uploadedFile);
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
    <div className="mainpage-container">
      <main className="mainpage-content">
        {view === "main" && (
          <div className="form-card">
            <h1 className="form-title">Build and Evaluate ML Algorithm Automatically</h1>
            <p className="form-subtitle">Upload Your Data</p>

            <div className="upload-section">
              <label className="upload-button">
                Text / Numerical
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}
          </div>
        )}

        {view === "fileUploading" && (
          <div className="upload-status">
            <h1>File Uploading...</h1>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {view === "fileUploaded" && (
          <div className="upload-status">
            <h1>File Uploaded Successfully</h1>
            <p><strong>File Name:</strong> {fileName}</p>



        <button onClick={() => navigate("/eda-summary")} className="btn btn-primary">
          View EDA Summary
        </button>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;

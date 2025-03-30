import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "./MainPage.css";

const MainPage = () => {
  const [view, setView] = useState("main");
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    const fileType = uploadedFile.name.split(".").pop().toLowerCase();
    const allowedTypes = ["csv", "xlsx", "xls"];

    if (!allowedTypes.includes(fileType)) {
      setErrorMessage("Please upload a valid file type: .csv, .xlsx, or .xls");
      return;
    }

    setFileName(uploadedFile.name);
    setView("fileUploading");
    localStorage.setItem("uploadedFile", uploadedFile.name);
    uploadFileToBackend(uploadedFile);
  };

  const uploadFileToBackend = async (uploadedFile) => {
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      // ✅ Updated the backend API URL to use port 8000
      const response = await axios.post("http://127.0.0.1:8000/upload-dataset", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        setView("fileUploaded");
        localStorage.setItem("datasetColumns", JSON.stringify(response.data.columns));
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
                  <input type="file" accept=".csv, .xlsx, .xls" style={{ display: "none" }} onChange={handleFileUpload} />
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

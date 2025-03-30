import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResultPage.css";

const ResultPage = () => {
  const [showVisualization, setShowVisualization] = useState(false);
  const [showChatGPTModal, setShowChatGPTModal] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const results = state?.results || {};

  const handleVisualizationClick = () => {
    setShowVisualization(!showVisualization);
  };

  const handleChatGPTClick = () => {
    setShowChatGPTModal(true);
  };

  const handleCloseModal = () => {
    setShowChatGPTModal(false);
  };

  const handleNextClick = () => {
    navigate("/main");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="result-page">
      <h1 className="headline">Analysis Results</h1>
      <p className="subheadline">Here are the insights from your analysis:</p>

      <div className="results-container">
        <div className="result-item"><h2>Model:</h2><p>{results.model_name}</p></div>
        <div className="result-item"><h2>Accuracy:</h2><p>{results.accuracy}</p></div>
        <div className="result-item"><h2>Precision:</h2><p>{results.precision}</p></div>
        <div className="result-item"><h2>Recall:</h2><p>{results.recall}</p></div>
        <div className="result-item"><h2>F1 Score:</h2><p>{results.f1_score}</p></div>
      </div>

      <button className="visualization-button" onClick={handleVisualizationClick}>
        {showVisualization ? "Hide Visualization" : "Show Visualization"}
      </button>

      {showVisualization && (
        <div className="visualization-content">
          <h2>Visualizations</h2>
          <img src={`data:image/png;base64,${results.confusion_matrix}`} alt="Confusion Matrix" />
          <img src={`data:image/png;base64,${results.roc_curve}`} alt="ROC Curve" />
          <img src={`data:image/png;base64,${results.precision_recall_curve}`} alt="Precision-Recall Curve" />
          <img src={`data:image/png;base64,${results.feature_importance}`} alt="Feature Importance" />
        </div>
      )}

      <img src="./img/gem.png" alt="ChatGPT Logo" className="chatgpt-logo-button" onClick={handleChatGPTClick} />
      {showChatGPTModal && (
        <div className="chatgpt-modal">
          <h2>ChatGPT Results</h2>
          <p><strong>Accuracy:</strong> {results.accuracy}</p>
          <p><strong>Precision:</strong> {results.precision}</p>
          <p><strong>Recall:</strong> {results.recall}</p>
          <p><strong>F1 Score:</strong> {results.f1_score}</p>
          <button className="modal-close-btn" onClick={handleCloseModal}>Close</button>
        </div>
      )}

      <div className="swipe-button-container" onClick={handleNextClick}>
        <button className="swipe-button">
          <span>Resume</span>
          <div className="arrow-container">
            <div className="arrow"></div>
          </div>
        </button>
      </div>

      <div className="home-icon" onClick={handleHomeClick}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3l9 8h-3v10h-12v-10h-3z" />
        </svg>
      </div>
    </div>
  );
};

export default ResultPage;

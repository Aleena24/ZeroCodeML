import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResultPage.css";

const ResultPage = () => {
  const [showVisualization, setShowVisualization] = useState(false);
  const [showChatGPTModal, setShowChatGPTModal] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  
  useEffect(() => {
      fetch("http://localhost:8000/get_results")
          .then(res => res.json())
          .then(data => {
              console.log("Received Data:", data);
              setResponseData(data);
          })
          .catch(error => console.error("Error fetching results:", error));
  }, []);

  const results = responseData || state?.results || {};

  const formatPercentage = (value) => {
    return value !== undefined ? `${(value * 100).toFixed(2)}%` : "N/A";
  };

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
        <div className="result-item"><h2>Accuracy:</h2><p>{formatPercentage(results.accuracy)}</p></div>
        <div className="result-item"><h2>Precision:</h2><p>{formatPercentage(results.precision)}</p></div>
        <div className="result-item"><h2>Recall:</h2><p>{formatPercentage(results.recall)}</p></div>
        <div className="result-item"><h2>F1 Score:</h2><p>{formatPercentage(results.f1_score)}</p></div>
      </div>

      <button className="visualization-button" onClick={handleVisualizationClick}>
        {showVisualization ? "Hide Visualization" : "Show Visualization"}
      </button>

      {showVisualization && (
        <div className="visualization-content">
          <h2>Visualizations</h2>
          {/* Confusion Matrix */}
          {results.confusion_matrix ? (
            <img src={`data:image/png;base64,${results.confusion_matrix}`} alt="Confusion Matrix" />
          ) : (
            <p className="attention-message">⚠️ Confusion Matrix Not Available</p>
          )}

          {/* ROC Curve */}
          {results.roc_curve ? (
            <img src={`data:image/png;base64,${results.roc_curve}`} alt="ROC Curve" />
          ) : (
            <p className="attention-message">⚠️ ROC Curve Not Available</p>
          )}

          {/* Precision-Recall Curve */}
          {results.precision_recall_curve ? (
            <img src={`data:image/png;base64,${results.precision_recall_curve}`} alt="Precision-Recall Curve" />
          ) : (
            <p className="attention-message">⚠️ Precision-Recall Curve Not Available</p>
          )}

          {/* Feature Importance */}
          {results.feature_importance ? (
            <img src={`data:image/png;base64,${results.feature_importance}`} alt="Feature Importance" />
          ) : (
            <p className="attention-message">⚠️ Feature Importance Not Available</p>
          )}
        </div>
      )}
      <img src="./img/gem.png" alt="ChatGPT Logo" className="chatgpt-logo-button" onClick={handleChatGPTClick} />
      {showChatGPTModal && (
        <div className="chatgpt-modal">
          <h2>ChatGPT Results</h2>
          <p><strong>Accuracy:</strong> {formatPercentage(results.accuracy)}</p>
          <p><strong>Precision:</strong> {formatPercentage(results.precision)}</p>
          <p><strong>Recall:</strong> {formatPercentage(results.recall)}</p>
          <p><strong>F1 Score:</strong> {formatPercentage(results.f1_score)}</p>
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

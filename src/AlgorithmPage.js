import React, { useState } from "react";
import "./AlgorithmPage.css";
import { useNavigate } from "react-router-dom";

const AlgorithmPage = () => {
  const navigate = useNavigate();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [showSupervised, setShowSupervised] = useState(false);
  const [showUnsupervised, setShowUnsupervised] = useState(false);

  const supervisedAlgorithms = {
    "Regression Algorithms": [
      { name: "Linear Regression", description: "A method for modeling the relationship between variables." },
      { name: "Polynomial Regression", description: "A type of regression that models relationships as polynomial functions." },
      { name: "Ridge Regression", description: "A regularized version of linear regression." },
      { name: "Lasso Regression", description: "Another regularized form of linear regression using L1 penalty." },
    ],
    "Classification Algorithms": [
      { name: "Logistic Regression", description: "Used for binary classification problems." },
      { name: "Support Vector Machines (SVM)", description: "Classifies data by finding the best boundary." },
      { name: "Decision Tree", description: "A tree-like structure used for classification and regression." },
      { name: "Random Forest", description: "An ensemble method using multiple decision trees." },
      { name: "Gradient Boosting", description: "An ensemble technique that builds models sequentially." },
      { name: "K-Nearest Neighbors (KNN)", description: "Classifies based on the nearest neighbors in the dataset." },
      { name: "Naive Bayes", description: "A probabilistic classifier based on Bayes' theorem." },
    ],
    "Time Series Forecasting": [
      { name: "ARIMA", description: "Auto-regressive integrated moving average for time series prediction." },
      { name: "SARIMA", description: "ARIMA with seasonal components." },
      { name: "ARCH", description: "Autoregressive Conditional Heteroskedasticity model for financial data." },
      { name: "GARCH", description: "Generalized ARCH for volatility modeling in time series." },
    ],
  };

  const unsupervisedAlgorithms = {
    "Clustering Algorithms": [
      { name: "K-Means Clustering", description: "A popular algorithm to partition data into clusters." },
      { name: "K-Medoids Clustering", description: "A variation of K-Means that uses medoids instead of centroids." },
      { name: "Hierarchical Clustering", description: "Builds a hierarchy of clusters, can be agglomerative or divisive." },
      { name: "Fuzzy C-Means", description: "A clustering algorithm where each point can belong to multiple clusters." },
    ],
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleNextClick = () => {
    if (!selectedAlgorithm) {
      alert("Please select an algorithm!");
      return;
    }
    navigate("/result", { state: { selectedAlgorithm } });
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const renderAlgorithmList = (algorithms) => {
    return Object.entries(algorithms).map(([category, items]) => (
      <div key={category} className="algorithm-category">
        <h3>{category}</h3>
        <ul>
          {items.map((algo) => (
            <li
              key={algo.name}
              onClick={() => handleAlgorithmSelect(algo.name)}
              className={`algorithm-item ${
                selectedAlgorithm === algo.name ? "selected" : ""
              }`}
              title={algo.description}
            >
              {algo.name}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="algorithm-page">
      <h1 className="headline">Select an Algorithm</h1>
      <p className="subheadline">Choose the best-suited algorithm for your data.</p>

      <div className="button-group">
        <button
          className={`toggle-button ${showSupervised ? "active" : ""}`}
          onClick={() => {
            setShowSupervised(!showSupervised);
            setShowUnsupervised(false);
          }}
        >
          Supervised Learning
        </button>
        <button
          className={`toggle-button ${showUnsupervised ? "active" : ""}`}
          onClick={() => {
            setShowUnsupervised(!showUnsupervised);
            setShowSupervised(false);
          }}
        >
          Unsupervised Learning
        </button>
      </div>

      {showSupervised && (
        <div className="algorithm-list">
          {renderAlgorithmList(supervisedAlgorithms)}
        </div>
      )}
      {showUnsupervised && (
        <div className="algorithm-list">
          {renderAlgorithmList(unsupervisedAlgorithms)}
        </div>
      )}

      {/* Updated Swipe Button */}
      <div className="swipe-button-container" onClick={handleNextClick}>
        <button className="swipe-button">
          <span>Swipe Next</span>
          <div className="arrow-container">
            <div className="arrow"></div>
          </div>
        </button>
      </div>
{/* Home Icon */}
<div className="home-icon" onClick={handleHomeClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 3l9 8h-3v10h-12v-10h-3z" />
        </svg>
      </div>
    </div>
  );
};

export default AlgorithmPage;

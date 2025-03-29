import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AlgorithmPage.css";
import Navbar from "./Navbar";
import Footer from "./Footer"

const AlgorithmPage = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState("");

  const supervisedAlgorithms = {
    Regression: [
      "Linear Regression",
      "Polynomial Regression",
      "Ridge Regression",
      "Lasso Regression",
    ],
    Classification: [
      "Logistic Regression",
      "Support Vector Machines (SVM)",
      "Decision Tree",
      "Random Forest",
      "Gradient Boosting",
      "K-Nearest Neighbors (KNN)",
      "Naive Bayes",
    ],
    Clustering: [
      "K-Means Clustering",
      "K-Medoids Clustering",
      "Hierarchical Clustering",
      "Fuzzy C-Means",
    ],
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleSubmit = () => {
    if (!selectedModel) {
      alert("Please select a model!");
      return;
    }
    navigate("/result", { state: { selectedModel } });
  };

  return (
    <div className="algorithm-page">
      <Navbar />
      <h1 className="headline">Supervised Algorithm</h1>

      <div className="categories">
        {Object.entries(supervisedAlgorithms).map(([category, models]) => (
          <div key={category} className="category-box">
            <h2>{category}</h2>
            <div className="model-buttons">
              {models.map((model) => (
                <button
                  key={model}
                  className={`model-button ${selectedModel === model ? "selected" : ""}`}
                  onClick={() => handleModelSelect(model)}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
      <Footer />
    </div>
  );
};

export default AlgorithmPage;

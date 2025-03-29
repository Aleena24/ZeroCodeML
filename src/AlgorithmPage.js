import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AlgorithmPage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AlgorithmPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null); // State for selected model
  const navigate = useNavigate();

  const supervisedAlgorithms = {
    Regression: {
      description: "Regression models predict continuous values based on input data.",
      models: {
        "Linear Regression": "Predicts a continuous output based on a linear function of input features.",
        "Polynomial Regression": "Extends linear regression by considering polynomial relationships.",
        "Ridge Regression": "Uses L2 regularization to prevent overfitting in linear regression.",
        "Lasso Regression": "Uses L1 regularization to enforce sparsity in the regression model.",
      },
    },
    Classification: {
      description: "Classification models categorize data into predefined classes.",
      models: {
        "Logistic Regression": "Predicts categorical outcomes using a logistic function.",
        "Support Vector Machines (SVM)": "Finds the best hyperplane to separate classes.",
        "Decision Tree": "Uses a tree structure to make decisions based on input features.",
        "Random Forest": "Combines multiple decision trees to improve accuracy.",
        "Gradient Boosting": "Sequentially improves weak models to create a strong classifier.",
        "K-Nearest Neighbors (KNN)": "Classifies data based on the closest training examples.",
        "Naive Bayes": "Uses probability and Bayes’ theorem for classification.",
      },
    },
    Clustering: {
      description: "Clustering models group similar data points together.",
      models: {
        "K-Means Clustering": "Groups data points into k clusters based on similarity.",
        "K-Medoids Clustering": "Similar to k-means but uses actual data points as cluster centers.",
        "Hierarchical Clustering": "Builds a hierarchy of clusters using a tree structure.",
        "Fuzzy C-Means": "Assigns data points to clusters with degrees of belonging.",
      },
    },
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedModel(null); // Reset model selection when category changes
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedModel(null);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleSubmit = () => {
    if (!selectedModel) {
      alert("Please select a model before submitting.");
      return;
    }
    navigate("/result", { state: { selectedModel } }); // Pass selected model to result page
  };

  return (
    <div className="algo-page">
      <Navbar />
      <h1 className="algo-headline">Supervised Algorithm</h1>

      {!selectedCategory ? (
        <div className="algo-categories">
          {Object.entries(supervisedAlgorithms).map(([category, { description }]) => (
            <motion.div
              key={category}
              className="algo-flip-card"
              whileHover={{ rotateY: 180 }}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="algo-flip-card-inner">
                <div className="algo-flip-card-front">{category}</div>
                <div className="algo-flip-card-back">{description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="algo-models-section">
          <h2>{selectedCategory}</h2>
          <div className="algo-model-buttons">
            {Object.entries(supervisedAlgorithms[selectedCategory].models).map(([model, description]) => (
              <motion.div
                key={model}
                className={`algo-flip-card ${selectedModel === model ? "selected-model" : ""}`}
                whileHover={{ rotateY: 180 }}
                onClick={() => handleModelSelect(model)}
              >
                <div className="algo-flip-card-inner">
                  <div className="algo-flip-card-front">{model}</div>
                  <div className="algo-flip-card-back">{description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="algo-buttons">
            <button className="algo-back-button" onClick={handleBackToCategories}>
              Cancel
            </button>
            <button className="algo-submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AlgorithmPage;

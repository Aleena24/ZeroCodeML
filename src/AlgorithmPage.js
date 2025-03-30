import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AlgorithmPage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AlgorithmPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedTargetColumn, setSelectedTargetColumn] = useState("");
  const [columns, setColumns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get_columns");
        const data = await response.json();
        console.log("Fetched Columns:", data);
        setColumns(data.columns || []);
      } catch (error) {
        console.error("Failed to fetch columns:", error);
        setColumns([]);
      }
    };
    fetchColumns();
  }, []);

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
    setSelectedModel(null);
  };

  const modelKeys = {
    "Logistic Regression": "logistic_regression",
    "Support Vector Machines (SVM)": "linear_svc",
    "K-Nearest Neighbors": "knn",
    "Naive Bayes": "naive_bayes",
    "Decision Tree": "decision_tree",
    "Random Forest": "random_forest",
    "Gradient Boosting": "gradient_boosting",
    "XGBoost": "xgboost"
  };
  
  const handleModelSelect = (model) => {
    const mappedModel = modelKeys[model];
  
    console.log("Frontend Model Selected:", model);
    console.log("Mapped Model for Backend:", mappedModel);  // Debugging output
  
    if (mappedModel) {
      setSelectedModel(mappedModel);  // Correctly set state
    } else {
      console.error("Invalid Model Selection:", model);
    }
  };
  

  const handleTrainModel = async () => {
    if (!selectedModel || !selectedTargetColumn) {
      alert("Please select a model and target column before training.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/train_classification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_name: selectedModel, target_column: selectedTargetColumn }),
      });

      const data = await response.json();
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        navigate("/result", { state: { results: data } });
      }
    } catch (error) {
      alert("Failed to train model. Please try again.");
    }
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
          {Object.entries(supervisedAlgorithms[selectedCategory]?.models || {}).map(([modelName, description]) => (
              <motion.div
                key={modelName}
                className={`algo-flip-card ${selectedModel === modelKeys[modelName] ? "selected-model" : ""}`} 
                whileHover={{ rotateY: 180 }}
                onClick={() => handleModelSelect(modelName)}  
              >
                <div className="algo-flip-card-inner">
                  <div className="algo-flip-card-front">{modelName}</div>
                  <div className="algo-flip-card-back">{description}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Target Column Selection */}
          <div className="algo-input">
            <select value={selectedTargetColumn} onChange={(e) => setSelectedTargetColumn(e.target.value)}>
              <option value="">Select Target Column</option>
              {columns.length > 0 ? (
                columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))
              ) : (
                <option disabled>No columns available</option>
              )}
            </select>
          </div>

          <button className="algo-submit-button" onClick={handleTrainModel}>Train Model</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AlgorithmPage;

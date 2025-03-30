import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

def plot_actual_vs_predicted(y_test, y_pred, model_name="Model"):
    """Visualizes actual vs. predicted values for regression."""
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test, y_pred, alpha=0.7, color="blue", label="Predicted")
    plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], '--r', label="Perfect Fit")  # 45-degree line
    plt.xlabel("Actual Values")
    plt.ylabel("Predicted Values")
    plt.title(f"Actual vs. Predicted Values ({model_name})")
    plt.legend()
    plt.grid()
    plt.show()

def plot_residuals(y_test, y_pred, model_name="Model"):
    """Plots residual errors to check how well the model fits."""
    residuals = y_test - y_pred
    plt.figure(figsize=(8, 6))
    sns.histplot(residuals, bins=30, kde=True, color="purple")
    plt.axvline(0, color='red', linestyle='dashed', linewidth=2)
    plt.xlabel("Residuals (y_actual - y_pred)")
    plt.ylabel("Frequency")
    plt.title(f"Residual Distribution ({model_name})")
    plt.show()

def plot_feature_importance(model, X_train):
    """Plots feature importance for tree-based models (XGBoost, LightGBM, CatBoost)."""
    feature_names = X_train.columns.tolist()

    if hasattr(model, "feature_importances_"):
        importance = model.feature_importances_
        feature_df = pd.DataFrame({"Feature": feature_names, "Importance": importance})
        feature_df = feature_df.sort_values(by="Importance", ascending=False)

        plt.figure(figsize=(10, 6))
        sns.barplot(x="Importance", y="Feature", data=feature_df, palette="Blues_r")
        plt.xlabel("Feature Importance Score")
        plt.ylabel("Features")
        plt.title("Feature Importance")
        plt.show()
    else:
        print("Feature importance not available for this model.")


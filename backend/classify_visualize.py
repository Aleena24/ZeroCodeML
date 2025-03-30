import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc, precision_recall_curve

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

def plot_confusion_matrix(y_test, y_pred):
    """Plots a confusion matrix with automatic class name detection."""
    cm = confusion_matrix(y_test, y_pred)
    
    class_names = np.unique(y_test)  # Auto-detect class names
    
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.xlabel("Predicted Labels")
    plt.ylabel("True Labels")
    plt.title("Confusion Matrix")
    plt.show()


def plot_roc_curve(model,X_test,y_test):
    """Plots ROC Curve for binary and multi-class classification."""
    y_probs = model.predict_proba(X_test)
    n_classes = len(model.classes_)


    plt.figure(figsize=(8, 6))

    if n_classes == 2:
        fpr, tpr, _ = roc_curve(y_test, y_probs[:, 1])
        roc_auc = auc(fpr, tpr)
        plt.plot(fpr, tpr, color="blue", label=f"AUC = {roc_auc:.2f}")
    else:
        for i in range(n_classes):
            fpr, tpr, _ = roc_curve(y_test, y_probs[:, i], pos_label=i)
            roc_auc = auc(fpr, tpr)
            plt.plot(fpr, tpr, label=f"Class {i} (AUC = {roc_auc:.2f})")

    plt.plot([0, 1], [0, 1], "k--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend()
    plt.grid()
    plt.show()

def plot_precision_recall_curve(model,X_test,y_test):
    y_probs = model.predict_proba(X_test)
    n_classes = len(model.classes_)
    """Plots Precision-Recall curve for binary and multi-class classification."""
    plt.figure(figsize=(8, 6))

    if n_classes == 2:
        precision, recall, _ = precision_recall_curve(y_test, y_probs[:, 1])
        plt.plot(recall, precision, color="purple", label="Binary PR Curve")
    else:
        for i in range(n_classes):
            precision, recall, _ = precision_recall_curve(y_test, y_probs[:, i], pos_label=i)
            plt.plot(recall, precision, label=f"Class {i}")

    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall Curve")
    plt.legend()
    plt.grid()
    plt.show()

def plot_feature_importance(model, X_train):
    """Plots feature importance for tree-based models (XGBoost, LightGBM, CatBoost)."""
    feature_names = X_train.columns.tolist()
    if hasattr(model, "feature_importances_"):
        importance = model.feature_importances_
        feature_df = pd.DataFrame({"Feature": feature_names, "Importance": importance})
        feature_df = feature_df.sort_values(by="Importance", ascending=False)

        plt.figure(figsize=(10, 6))
        sns.barplot(x="Importance", y="Feature", data=feature_df, palette="Reds_r")
        plt.xlabel("Feature Importance Score")
        plt.ylabel("Features")
        plt.title("Feature Importance")
        plt.show()
    else:
        print("Feature importance not available for this model.")


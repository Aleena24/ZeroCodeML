from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import numpy as np
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import seaborn as sns
from werkzeug.utils import secure_filename
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder, StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_curve, auc, precision_recall_curve
from sklearn.preprocessing import label_binarize
from sklearn.metrics import roc_auc_score

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# File upload settings
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

uploaded_data = pd.DataFrame()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def encode_plot_as_base64(fig):
    """Convert Matplotlib figure to a base64 string."""
    buffer = BytesIO()
    fig.savefig(buffer, format="png")
    buffer.seek(0)
    return base64.b64encode(buffer.getvalue()).decode()

def preprocess_data(df, threshold=40):
    """Preprocess the dataset: handle missing values, encode categories, and scale features."""
    dropped_columns = df.columns[df.isnull().mean() * 100 >= threshold].tolist()
    df = df.drop(columns=dropped_columns)

    int_columns = df.select_dtypes(include=np.number).columns
    obj_columns = df.select_dtypes(exclude=np.number).columns

    # Handle missing values
    df[int_columns] = df[int_columns].apply(lambda x: x.fillna(x.mean()))
    df[obj_columns] = df[obj_columns].apply(lambda x: x.fillna(x.mode()[0]))

    # Encode categorical features
    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    df[obj_columns] = encoder.fit_transform(df[obj_columns])

    # Scale numerical features
    scaler = StandardScaler()
    df[int_columns] = scaler.fit_transform(df[int_columns])

    return df, encoder, scaler, dropped_columns

classification_models = {
    "logistic_regression": LogisticRegression(random_state=77, max_iter=10000),
    "linear_svc": LinearSVC(random_state=77, dual=False),
    "knn": KNeighborsClassifier(),
    "naive_bayes": MultinomialNB(),
    "decision_tree": DecisionTreeClassifier(random_state=77),
    "random_forest": RandomForestClassifier(random_state=77),
    "gradient_boosting": GradientBoostingClassifier(random_state=77),
    "xgboost": xgb.XGBClassifier(random_state=77)
}


@app.route('/upload-dataset', methods=['POST'])
def upload_file():
    global uploaded_data
    file = request.files.get("file")
    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format"}), 400
    
    try:
        file_path = os.path.join(UPLOAD_FOLDER, "uploaded_file.csv")
        file.save(file_path)
        uploaded_data = pd.read_csv(file_path)
        return jsonify({"message": "File uploaded successfully", "columns": list(uploaded_data.columns)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_columns", methods=["GET"])
def get_columns():
    """Fetch column names from the uploaded dataset."""
    global uploaded_data
    if uploaded_data.empty:
        return jsonify({"error": "No dataset uploaded"}), 400

    return jsonify({"columns": list(uploaded_data.columns)})

@app.route("/eda-summary", methods=["GET"])
def eda_summary():
    """Provide a summary of the uploaded dataset."""
    global uploaded_data
    if uploaded_data.empty:
        return jsonify({"error": "No dataset uploaded"}), 400

    summary = {
        col: {
            "dtype": str(uploaded_data[col].dtype),
            "missing": int(uploaded_data[col].isnull().sum()),
            "non_null": int(uploaded_data[col].count()),
            "unique": int(uploaded_data[col].nunique()),
        }
        for col in uploaded_data.columns
    }
    return jsonify({"summary": summary})

@app.route('/train_classification', methods=['POST'])
def train_classification():
    try:
        global uploaded_data, latest_results
        if uploaded_data.empty:
            return jsonify({"error": "No dataset uploaded"}), 400

        data = request.get_json()
        target_column = data.get("target_column")
        model_name = data.get("model_name")

        if not target_column or not model_name:
            return jsonify({"error": "Missing target column or model name"}), 400

        if model_name not in classification_models:
            return jsonify({"error": "Invalid model selection", "valid_models": list(classification_models.keys())}), 400

        # Preprocess Data
        df, encoder, scaler, dropped_columns = preprocess_data(uploaded_data, 40)
        if target_column not in df.columns:
            return jsonify({"error": f"Target column '{target_column}' not found"}), 400

        X_train, X_test, y_train, y_test = train_test_split(
            df.drop(columns=[target_column]), df[target_column], test_size=0.3, random_state=7
        )

        # Encode target column if categorical
        if y_train.dtype == "O":
            label_encoder = LabelEncoder()
            y_train = label_encoder.fit_transform(y_train)
            y_test = label_encoder.transform(y_test)

        # Train model
        model = classification_models[model_name]
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        # Compute Metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average="macro", zero_division=1)
        recall = recall_score(y_test, y_pred, average="macro", zero_division=1)
        f1 = f1_score(y_test, y_pred, average="macro", zero_division=1)

        # Generate Confusion Matrix Plot
        cm = confusion_matrix(y_test, y_pred)
        fig, ax = plt.subplots()
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=ax)
        ax.set_title("Confusion Matrix")
        confusion_matrix_img = encode_plot_as_base64(fig)

        # **Multiclass ROC & PR Handling**
        if len(np.unique(y_test)) == 2:  # Binary Classification
            fpr, tpr, _ = roc_curve(y_test, y_pred)
            roc_auc = auc(fpr, tpr)

            fig, ax = plt.subplots()
            ax.plot(fpr, tpr, color="blue", lw=2, label=f"AUC = {roc_auc:.2f}")
            ax.plot([0, 1], [0, 1], color="gray", linestyle="--")
            ax.set_title("ROC Curve")
            ax.legend(loc="lower right")
            roc_curve_img = encode_plot_as_base64(fig)

            precision_vals, recall_vals, _ = precision_recall_curve(y_test, y_pred)
            fig, ax = plt.subplots()
            ax.plot(recall_vals, precision_vals, color="green", lw=2)
            ax.set_title("Precision-Recall Curve")
            precision_recall_curve_img = encode_plot_as_base64(fig)

        else:  # **Multiclass Handling**
            y_test_bin = label_binarize(y_test, classes=np.unique(y_test))
            y_pred_bin = label_binarize(y_pred, classes=np.unique(y_test))

            roc_auc = roc_auc_score(y_test_bin, y_pred_bin, average="macro", multi_class="ovr")

            fig, ax = plt.subplots()
            ax.set_title(f"Multiclass ROC AUC: {roc_auc:.2f}")
            roc_curve_img = encode_plot_as_base64(fig)

            precision_recall_curve_img = "Not Available for Multiclass"

        # Save results for `/get_results`
        latest_results = {
            "model_name": model_name,
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "confusion_matrix": confusion_matrix_img,
            "roc_curve": roc_curve_img,
            "precision_recall_curve": precision_recall_curve_img
        }

        return jsonify({"model_name": model_name, "metrics": latest_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_results', methods=['GET'])
def get_results():
    """Fetch the latest classification results."""
    global latest_results
    if not latest_results:
        return jsonify({"error": "No results available"}), 400
    return jsonify(latest_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True, threaded=True)

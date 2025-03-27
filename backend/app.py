import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import base64
import os
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename


# Flask app initialization
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

eda_data = pd.DataFrame()

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def plot_to_base64(fig):
    buffer = BytesIO()
    fig.savefig(buffer, format='png')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    plt.close(fig)
    return image_base64

def dfSummary(data):
    summary = pd.DataFrame({
        'Column': data.columns,
        'Dtype': data.dtypes.astype(str),
        'Non-null': data.notnull().sum(),
        'Missing': data.isnull().sum(),
        'Missing (%)': (data.isnull().sum() * 100 / len(data)).round(2),
        'Uniques': data.nunique()
    })
    return summary.to_dict(orient='records')

@app.route('/upload', methods=['POST'])
def upload_file():
    global eda_data  # Make it accessible throughout the app
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file provided"}), 400  # Bad Request

    try:
        # Read the CSV file
        eda_data = pd.read_csv(file)

        return jsonify({"message": "File uploaded successfully", "columns": list(eda_data.columns)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Internal Server Error
    


@app.route('/eda-summary', methods=['GET'])
def get_eda_summary():
    global eda_data  # Ensure we access the global variable

    # Check if data is uploaded
    if eda_data.empty:
        return jsonify({'error': 'No dataset uploaded'}), 400  

    try:
        num_summary = eda_data.describe().to_dict()

        # Check if categorical data exists
        cat_summary = eda_data.describe(include=['O']).to_dict() if not eda_data.select_dtypes(include=['O']).empty else {}

        return jsonify({'summary': {'numerical_summary': num_summary, 'categorical_summary': cat_summary}})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500  



@app.route('/descriptive-stats', methods=['GET'])
def get_descriptive_stats():
    global eda_data  

    if eda_data is None or eda_data.empty:
        return jsonify({'error': 'No dataset uploaded or dataset is empty'}), 400

    # Ensure numerical columns exist
    num_cols = eda_data.select_dtypes(include=[np.number]).columns.tolist()
    if not num_cols:
        return jsonify({'error': 'No numerical columns found in dataset'}), 400

    stats = eda_data[num_cols].describe().to_dict()
    return jsonify({'descriptive_stats': stats})



@app.route('/correlation-heatmap', methods=['GET'])
def get_correlation_heatmap():
    global eda_data  

    if eda_data is None or eda_data.empty:
        return jsonify({'error': 'No dataset uploaded'}), 400

    try:
        numeric_data = eda_data.select_dtypes(include=[np.number])
        if numeric_data.shape[1] < 2:
            return jsonify({'error': 'Not enough numerical columns for correlation heatmap'}), 400

        corr = numeric_data.corr()  
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.2f', ax=ax)

        return jsonify({'correlation_plot': plot_to_base64(fig)})  # Updated key name

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/numerical-distribution', methods=['GET'])
def get_numerical_distribution():
    global eda_data  

    if eda_data is None or eda_data.empty:
        return jsonify({'error': 'No dataset uploaded'}), 400

    try:
        num_cols = eda_data.select_dtypes(include=[np.number]).columns.tolist()
        if not num_cols:
            return jsonify({'error': 'No numerical columns available'}), 400
        
        fig, axes = plt.subplots(nrows=len(num_cols), figsize=(10, 6 * len(num_cols)))
        
        if len(num_cols) == 1:
            eda_data[num_cols[0]].hist(ax=axes, bins=20, edgecolor='black', grid=False)
            axes.set_title(num_cols[0])
        else:
            for i, col in enumerate(num_cols):
                eda_data[col].hist(ax=axes[i], bins=20, edgecolor='black', grid=False)
                axes[i].set_title(col)

        return jsonify({'numerical_distribution': plot_to_base64(fig)})  # Updated key name
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)

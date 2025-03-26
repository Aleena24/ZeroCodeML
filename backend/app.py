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
from pandas import MultiIndex, Int64Index

# Flask app initialization
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

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
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400

    filename = secure_filename(file.filename)
    file_path = f"{UPLOAD_FOLDER}/{filename}"
    file.save(file_path)

    try:
        df = pd.read_csv(file_path) if filename.endswith('.csv') else pd.read_excel(file_path)
        global eda_data
        eda_data = df  # Store uploaded dataset globally for EDA endpoints
        return jsonify({
            'filename': filename,
            'shape': df.shape,
            'columns': df.columns.tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/eda-summary', methods=['GET'])
def get_eda_summary():
    if eda_data is None:
        return jsonify({'error': 'No dataset uploaded'}), 400
    return jsonify({'summary': dfSummary(eda_data)})

@app.route('/descriptive-stats', methods=['GET'])
def get_descriptive_stats():
    if eda_data is None:
        return jsonify({'error': 'No dataset uploaded'}), 400
    return jsonify({'descriptive_stats': eda_data.describe(include='all').to_dict()})

@app.route('/correlation-heatmap', methods=['GET'])
def get_correlation_heatmap():
    if eda_data is None:
        return jsonify({'error': 'No dataset uploaded'}), 400
    corr = eda_data.corr()
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.2f', ax=ax)
    return jsonify({'heatmap': plot_to_base64(fig)})

@app.route('/numerical-distribution', methods=['GET'])
def get_numerical_distribution():
    if eda_data is None:
        return jsonify({'error': 'No dataset uploaded'}), 400
    fig, ax = plt.subplots(figsize=(10, 6))
    eda_data.hist(ax=ax, bins=20, edgecolor='black')
    return jsonify({'distribution_plot': plot_to_base64(fig)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

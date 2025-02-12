import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sklearn.preprocessing import OrdinalEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Flask app initialization
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure uploads folder exists
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
    summary = pd.DataFrame(data.dtypes, columns=['dtypes'])
    summary = summary.reset_index()
    summary['Column'] = summary['index']
    summary = summary[['Column', 'dtypes']]
    summary['non-null'] = data.notnull().sum().values
    summary['Missing'] = data.isnull().sum().values
    summary['Missing (%)'] = (data.isnull().sum().values * 100 / len(data)).round(2)
    summary['Uniques'] = data.nunique().values
    summary['dtypes'] = summary['dtypes'].astype(str)
    return summary.to_dict(orient='records')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            # Read file
            if filename.endswith('.csv'):
                try:
                    df = pd.read_csv(file_path)
                except Exception:
                    encodings = ['utf-8', 'latin-1', 'iso-8859-1']
                    for encoding in encodings:
                        try:
                            df = pd.read_csv(file_path, encoding=encoding)
                            break
                        except:
                            continue
                    else:
                        return jsonify({'error': 'Could not read CSV'}), 400
            else:
                df = pd.read_excel(file_path)

            # Generate EDA
            summary = dfSummary(df)
            descriptive_stats = df.describe(include='all').to_dict()
            
            # Numerical distributions
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            fig, axes = plt.subplots(nrows=max(1, len(numeric_columns) // 3 + 1),
                                   ncols=3, figsize=(15, 5 * (len(numeric_columns) // 3 + 1)))
            axes = axes.flatten() if len(numeric_columns) > 1 else [axes]
            
            for i, col in enumerate(numeric_columns):
                if i < len(axes):
                    df[col].hist(ax=axes[i])
                    axes[i].set_title(f'Distribution of {col}')
            plt.tight_layout()
            numerical_plot = plot_to_base64(fig)

            # Categorical distributions
            cat_columns = df.select_dtypes(include=['object']).columns
            cat_plots = {}
            for col in cat_columns:
                fig, ax = plt.subplots(figsize=(10, 5))
                df[col].value_counts().plot(kind='bar', ax=ax)
                plt.title(f'Distribution of {col}')
                plt.xticks(rotation=90)
                cat_plots[col] = plot_to_base64(fig)

            # Correlation matrix
            if len(numeric_columns) > 1:
                fig, ax = plt.subplots(figsize=(10, 8))
                sns.heatmap(df[numeric_columns].corr(), annot=True, cmap='coolwarm', ax=ax)
                plt.title('Correlation Heatmap')
                correlation_plot = plot_to_base64(fig)
            else:
                correlation_plot = None

            return jsonify({
                'filename': filename,
                'shape': df.shape,
                'summary': summary,
                'descriptive_stats': descriptive_stats,
                'numerical_distribution': numerical_plot,
                'categorical_distributions': cat_plots,
                'correlation_plot': correlation_plot,
                'columns': df.columns.tolist()
            })

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/train', methods=['POST'])
def train_model():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    target_column = request.form.get('target_column')
    algorithm = request.form.get('algorithm')
    split_ratio = float(request.form.get('split_ratio', 70))

    # Read and process data
    if file.filename.endswith('.csv'):
        df = pd.read_csv(file)
    else:
        df = pd.read_excel(file)

    # Handle missing values and encoding
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(exclude=[np.number]).columns
    
    df[numeric_cols] = df[numeric_cols].apply(lambda x: x.fillna(x.mean()))
    df[categorical_cols] = df[categorical_cols].apply(lambda x: x.fillna(x.mode()[0]))
    
    encoder = OrdinalEncoder()
    df[categorical_cols] = encoder.fit_transform(df[categorical_cols])

    # Prepare data for training
    X = df.drop(target_column, axis=1)
    y = df[target_column]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1-split_ratio/100, random_state=77)

    # Model selection
    models = {
        'logistic': LogisticRegression(random_state=77),
        'svm': LinearSVC(random_state=77),
        'knn': KNeighborsClassifier(),
        'naive_bayes': MultinomialNB(),
        'decision_tree': DecisionTreeClassifier(random_state=77),
        'random_forest': RandomForestClassifier(random_state=77),
        'gradient_boosting': GradientBoostingClassifier(random_state=77),
        'xgboost': xgb.XGBClassifier(random_state=77)
    }

    model = models.get(algorithm)
    if not model:
        return jsonify({'error': 'Invalid algorithm'}), 400

    # Train and evaluate
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    results = {
        'accuracy': float(accuracy_score(y_test, y_pred)),
        'precision': float(precision_score(y_test, y_pred, average='macro')),
        'recall': float(recall_score(y_test, y_pred, average='macro')),
        'f1_score': float(f1_score(y_test, y_pred, average='macro'))
    }

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

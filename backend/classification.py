from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Dictionary of classification models
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

# Function to train and evaluate a classification model
def train_classification_model(model_name, X_train, X_test, y_train, y_test):
    if model_name not in classification_models:
        raise ValueError(f"Model '{model_name}' not found in classification models.")
    
    model = classification_models[model_name]
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, average="macro"),
        "recall": recall_score(y_test, y_pred, average="macro"),
        "f1_score": f1_score(y_test, y_pred, average="macro")
    }
    
    return model, metrics,y_pred

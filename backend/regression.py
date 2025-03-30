import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import (
    LinearRegression, Ridge, Lasso, ElasticNet, BayesianRidge, PassiveAggressiveRegressor
)
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import (
    RandomForestRegressor, GradientBoostingRegressor, AdaBoostRegressor, ExtraTreesRegressor, 
    BaggingRegressor
)
import xgboost as xgb
import lightgbm as lgb
import catboost as cb
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error, mean_absolute_percentage_error,root_mean_squared_error

# Dictionary of all regression models
regression_models = {
    "linear_regression": LinearRegression(),
    "ridge": Ridge(),
    "lasso": Lasso(),
    "elastic_net": ElasticNet(),
    "bayesian_ridge": BayesianRidge(),
    "passive_aggressive": PassiveAggressiveRegressor(),
    "svr": SVR(),
    "knn": KNeighborsRegressor(),
    "decision_tree": DecisionTreeRegressor(),
    "random_forest": RandomForestRegressor(),
    "gradient_boosting": GradientBoostingRegressor(),
    "ada_boost": AdaBoostRegressor(),
    "extra_trees": ExtraTreesRegressor(),
    "bagging": BaggingRegressor(),
    "xgboost": xgb.XGBRegressor(),
    "lightgbm": lgb.LGBMRegressor(),
    "catboost": cb.CatBoostRegressor(verbose=0)
}

# Function to train and evaluate a regression model
def train_regression_model(model_name, X_train, X_test, y_train, y_test):
    model = regression_models[model_name]
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    metrics = {
        "R2": r2_score(y_test, y_pred),
        "MSE": mean_squared_error(y_test, y_pred),
        "RMSE": root_mean_squared_error(y_test, y_pred),
        "MAE": mean_absolute_error(y_test, y_pred),
        "MAPE": mean_absolute_percentage_error(y_test, y_pred)
    }
    
    return model, metrics,y_pred


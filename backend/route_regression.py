#flask essentials
from flask import Flask, render_template, request, redirect, session, url_for, Blueprint, jsonify, flash
from flask_login import current_user, login_user, login_required, logout_user, LoginManager

import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
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


#custom import
from regression import *
from regression_visualize import *
from Preprocessing import *


regression = Blueprint('regression', __name__,  url_prefix='/regression')


@regression.route("/<learningType>/<algorithm>/<model_name>/<target_column>", methods = ['POST', 'GET'])
def regress(learningType, algorithm, model_name, target_column):
    print("route regression")
    data = pd.read_csv("data.csv")

    df, encoder, scaler, dropped_columns = preprocess_data(data, 40)
    X_train, X_test, y_train, y_test = split_data_supervised(df, target_column, 70 )

    model, metrics, y_pred = train_regression_model(model_name, X_train, X_test, y_train, y_test)

    '''

    Visulaization starts from here

    '''

    actual_vs_pred = plot_actual_vs_predicted(y_test, y_pred, model_name)
    residual = plot_residuals(y_test, y_pred, model_name)
    feature_importance = plot_feature_importance(model, X_train)
    return model_name




# return redirect(url_for('regression.regress_viz',
    #                         model_name = model_name,
    #                         model= model,
    #                         X_train = X_train,
    #                         X_test = X_test, 
    #                         y_train = y_train, 
    #                         y_test=y_test, 
    #                         y_pred = y_pred))
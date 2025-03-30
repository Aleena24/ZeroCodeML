#flask essentials
from flask import Flask, render_template, request, redirect, session, url_for, Blueprint, jsonify, flash
from flask_login import current_user, login_user, login_required, logout_user, LoginManager

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc, precision_recall_curve

#custom import
from classification import *
from classify_visualize import *
from Preprocessing import *

classification = Blueprint('classification', __name__, url_prefix='/classification')


@classification.route("/<learningType>/<algorithm>/<model_name>/<target_column>", methods = ['POST', 'GET'])
def classify(learningType, algorithm, model_name, target_column):
    print("route classification")

    data = pd.read_csv("data.csv")

    df, encoder, scaler, dropped_columns = preprocess_data(data, 40)
    X_train, X_test, y_train, y_test = split_data_supervised(df, target_column, 70 )

    model, metrics, y_pred = train_classification_model(model_name, X_train, X_test, y_train, y_test)

    
    '''

    Visulaization starts from here

    '''

    confusion_matrix = plot_confusion_matrix(y_test, y_pred)
    roc_curve = plot_roc_curve(model,X_test,y_test)
    precision_recall_curve = plot_precision_recall_curve(model,X_test,y_test)
    feature_importance = plot_feature_importance(model, X_train)

    return model_name




# return redirect(url_for('classification.classificatio_viz',
#                         model_name = model_name,
#                         model = model,
#                         X_train = X_train,
#                         X_test = X_test, 
#                         y_train = y_train, 
#                         y_test=y_test, 
#                         y_pred = y_pred))
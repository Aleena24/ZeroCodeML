#flask essentials
from flask import Flask, render_template, request, redirect, session, url_for, Blueprint, jsonify, flash
from flask_login import current_user, login_user, login_required, logout_user, LoginManager

import pandas as pd
import os
import numpy as np
import csv
from io import StringIO
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder, StandardScaler

#custom import
from Preprocessing import *

preprocessing = Blueprint('preprocessing', __name__)

# @preprocessing.route("/<learningType>/<algorithm>/<model_name>/Preprocessing", methods = ['POST', 'GET'])
@preprocessing.route("/Preprocessing", methods = ['POST', 'GET'])
def Preprocessing():
    if request.method == 'POST':
        # if 'csvFile' not in request.files:
        #     return "No file part found. Ensure the input name is 'csvFile'.", 400
        
        # file = request.files['csvFile']
        # print("HERE")
        # file_path = os.getcwd()+os.path.altsep+"data.csv"
        # file.save(file_path)

        print('form elements: ', request.form)

        if request.form.get('targetColumn'):
            target_column = request.form.get('targetColumn')
            print(target_column)

        if request.form.get('Classification') != '':
            learningType = 'Supervised-Learning'
            algorithm = 'Classification'
            model_name = request.form.get('Classification')
            print(model_name)

        elif request.form['Regression'] != '':
            learningType = 'Supervised-Learning'
            algorithm = 'Regression'
            model_name = request.form['Regression']
            print("model name : ",model_name)

        elif request.form['Clustering'] != '':
            learningType = 'Unsupervised-Learning'
            algorithm = 'Clustering'
            model_name = request.form['Clustering']
            print(model_name)

        else:
            return "Please select a learning type and algorithm", 400


        print(learningType, algorithm, model_name) 
        # if file:
        #     df = load_data(file, file_path)
        # else:
        #     flash("file not found", "danger")
        #     return redirect(url_for('home'))
        # if learningType == 'Supervised-Learning' and target_column:
        #     X_train, X_test, y_train, y_test = split_data_supervised(df, target_column, 70 )

        if algorithm == 'Classification':                
            return redirect(url_for('classification.classify',
                                    learningType = learningType,
                                    algorithm = algorithm,
                                    model_name = model_name,
                                    target_column = target_column
                                    ))
                                    
        
        if algorithm == 'Regression':
            # print("algorithm : regression")
            return redirect(url_for('regression.regress', 
                                    learningType = learningType,
                                    algorithm = algorithm,
                                    model_name = model_name,
                                    target_column = target_column
                                    ))
        
        elif algorithm == 'Clustering':
            return redirect(url_for('clustering.cluster',
                                    learningType = learningType,
                                    algorithm = algorithm,
                                    model = model_name
                                    ))

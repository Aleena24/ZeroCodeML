#flask essentials
from flask import Flask, render_template, request, redirect, session, url_for, Blueprint, jsonify, flash
from flask_login import current_user, login_user, login_required, logout_user, LoginManager

from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from scipy.cluster.hierarchy import dendrogram, linkage

#custom import 
from clustering import *
from cluster_visualize import *
from Preprocessing import *


clustering = Blueprint('clustering', __name__,  url_prefix='/clustering')



@clustering.route('/<learningType>/<algorithm>/<model_name>', methods = ['POST', 'GET'])
def cluster(learningType, algorithm, model_name):

    data = pd.read_csv("data.csv")

    df, encoder, scaler, dropped_columns = preprocess_data(data, 40)
    
    model, labels, metrics = train_clustering_model(model_name, X)
    return redirect(url_for('cluster_viz'))

def cluster_viz(X, labels, model_name):
    elbow_method = plot_elbow_method(X, max_clusters=10)
    silhouette_scores = plot_silhouette_scores(X, max_clusters=10)
    clusters = plot_clusters(X, labels, method="PCA")
    dendrogram = plot_dendrogram(X, method='ward')
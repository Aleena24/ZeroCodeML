import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from scipy.cluster.hierarchy import dendrogram, linkage

def plot_elbow_method(X, max_clusters=10):
    """Plots the Elbow Method to determine the optimal number of clusters for KMeans."""
    distortions = []
    K = range(1, max_clusters + 1)
    
    for k in K:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(X)
        distortions.append(kmeans.inertia_)  # Sum of squared distances to cluster centers
    
    plt.figure(figsize=(8, 6))
    plt.plot(K, distortions, marker='o')
    plt.xlabel('Number of Clusters')
    plt.ylabel('Inertia (Distortion)')
    plt.title('Elbow Method for Optimal K')
    plt.grid()
    plt.show()

def plot_silhouette_scores(X, max_clusters=10):
    """Plots the Silhouette Score for different cluster numbers."""
    silhouette_scores = []
    K = range(2, max_clusters + 1)

    for k in K:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(X)
        silhouette_scores.append(silhouette_score(X, labels))

    plt.figure(figsize=(8, 6))
    plt.plot(K, silhouette_scores, marker='o', color='red')
    plt.xlabel('Number of Clusters')
    plt.ylabel('Silhouette Score')
    plt.title('Silhouette Score for Clustering Performance')
    plt.grid()
    plt.show()

def plot_clusters(X, labels, method="PCA"):
    """Plots the clustered data using PCA or T-SNE for dimensionality reduction."""
    if method == "PCA":
        reducer = PCA(n_components=2)
    else:
        raise ValueError("Only PCA is supported for now.")

    X_reduced = reducer.fit_transform(X)
    
    plt.figure(figsize=(8, 6))
    sns.scatterplot(x=X_reduced[:, 0], y=X_reduced[:, 1], hue=labels, palette="viridis", alpha=0.7)
    plt.xlabel("Component 1")
    plt.ylabel("Component 2")
    plt.title(f"Clusters Visualized using {method}")
    plt.legend(title="Cluster")
    plt.grid()
    plt.show()

def plot_dendrogram(X, method='ward'):
    """Plots a dendrogram for hierarchical clustering."""
    linked = linkage(X, method=method)

    plt.figure(figsize=(10, 6))
    dendrogram(linked, truncate_mode='level', p=10)  # Show top 10 merged clusters
    plt.xlabel("Sample Index")
    plt.ylabel("Distance")
    plt.title("Hierarchical Clustering Dendrogram")
    plt.grid()
    plt.show()

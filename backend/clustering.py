from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score

# Dictionary of clustering models
clustering_models = {
    "kmeans": KMeans(n_clusters=5, random_state=42),
    "dbscan": DBSCAN(eps=0.5, min_samples=5),
    "hierarchical": AgglomerativeClustering(n_clusters=5),
    "gaussian_mixture": GaussianMixture(n_components=5, random_state=42)
}

# Function to train and evaluate a clustering model
def train_clustering_model(model_name, X):
    if model_name not in clustering_models:
        raise ValueError(f"Model '{model_name}' not found in clustering models.")
    
    model = clustering_models[model_name]
    model.fit(X)
    
    # For Gaussian Mixture, we use `predict()`, for others we use `.labels_`
    labels = model.predict(X) if hasattr(model, "predict") else model.labels_
    
    # Handle DBSCAN case where a single cluster or all noise points exist
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    if n_clusters <= 1:
        metrics = {"message": "Evaluation metrics not available for single-cluster data."}
    else:
        metrics = {
            "silhouette_score": silhouette_score(X, labels),
            "calinski_harabasz_index": calinski_harabasz_score(X, labels),
            "davies_bouldin_index": davies_bouldin_score(X, labels)
        }

    return model, labels, metrics

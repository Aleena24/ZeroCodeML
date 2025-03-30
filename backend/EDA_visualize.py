import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns


def plot_numerical_distribution(df):
    """Plot histograms for all numerical columns in the dataset."""
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    df[numeric_cols].hist(figsize=(15, 15), bins=30, edgecolor='black')
    plt.suptitle("Numerical Data Distribution", fontsize=16)
    plt.show()

def plot_categorical_distribution(df, unique_threshold=10):
    """Plot count plots for categorical columns with unique values below the threshold."""
    categorical_cols = [col for col in df.select_dtypes(include=['object']).columns if df[col].nunique() <= unique_threshold]
    
    if not categorical_cols:
        print("No categorical columns found within the specified threshold.")
        return
    
    num_plots = len(categorical_cols)
    cols = 3  # Number of columns in subplot
    rows = (num_plots // cols) + (num_plots % cols > 0)

    fig, axes = plt.subplots(rows, cols, figsize=(15, 5 * rows))
    axes = axes.flatten()

    for i, col in enumerate(categorical_cols):
        sns.countplot(x=df[col], ax=axes[i])
        axes[i].set_title(f'Distribution of {col}')
        axes[i].tick_params(axis='x', rotation=90)

    for j in range(i + 1, len(axes)):  # Hide unused subplots
        fig.delaxes(axes[j])

    plt.tight_layout()
    plt.show()

def plot_boxplot(df, x_col, y_col):
    """Generate a boxplot for a numerical column grouped by a categorical column."""
    if x_col not in df.columns or y_col not in df.columns:
        raise ValueError("Invalid column names provided.")
    
    plt.figure(figsize=(10, 6))
    sns.boxplot(x=df[x_col], y=df[y_col])
    plt.title(f'Boxplot of {y_col} grouped by {x_col}')
    plt.xticks(rotation=90)
    plt.show()

def plot_scatter(df, x_col, y_col):
    """Generate a scatter plot between two numerical columns."""
    if x_col not in df.columns or y_col not in df.columns:
        raise ValueError("Invalid column names provided.")
    
    plt.figure(figsize=(8, 6))
    plt.scatter(df[x_col], df[y_col], alpha=0.7, edgecolors='black')
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(f'Scatter Plot of {x_col} vs {y_col}')
    plt.show()

def plot_correlation_heatmap(df):
    """Generate a correlation heatmap for numerical columns in the dataset."""
    plt.figure(figsize=(10, 8))
    sns.heatmap(df.corr(), vmin=-1, vmax=1, annot=True, cmap="coolwarm", linewidths=0.5)
    plt.title("Correlation Heatmap")
    plt.show()

import pandas as pd
import numpy as np
import csv
from io import StringIO
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder, StandardScaler

def load_data(file, file_path):
    """Loads CSV, XLSX, or XLS files into a Pandas DataFrame."""
    # Check if file is a path or a file object
    if isinstance(file, str):
        filename = file
        file_obj = None
    else:
        filename = file.filename
        file_obj = file
    
    extension = filename.rsplit('.', 1)[-1].lower()
    print("file ====>",file)
    print("file name ====>",filename)
    print("extension ====>",extension)
    
    if extension == 'csv':
        # if file_obj:
        #     stringio = StringIO(file_obj.getvalue().decode("utf-8"))
        # else:
        #     stringio = open(filename, "r", encoding="utf-8")
        
        # string_data = stringio.read()
        # sniffer = csv.Sniffer()
        # dialect = sniffer.sniff(string_data)
        # stringio.seek(0)  # Reset cursor to read the file
        # df = pd.read_csv(r"E:\ZeroCodeML\Model\london_weather.csv", sep=dialect.delimiter) #'''df = pd.read_csv(stringio, sep=dialect.delimiter)'''
        # stringio.close()
        df = pd.read_csv(file_path)
    
    elif extension in ['xlsx', 'xls']:
        df = pd.read_excel(file_obj if file_obj else filename, engine='openpyxl' if extension == 'xlsx' else None)
    
    else:
        raise ValueError("Unsupported file format! Only CSV, XLSX, and XLS are supported.")
    
    df_column = df.columns
    return df, df_column


def df_summary(df):
    """Generates a summary of the DataFrame, including data types, missing values, and unique value percentages."""
    summary = pd.DataFrame(df.dtypes, columns=['dtypes']).reset_index()
    summary.rename(columns={'index': 'Column'}, inplace=True)
    summary['Missing (%)'] = df.isnull().sum().values * 100 / len(df)
    summary['Uniques (%)'] = df.nunique().values * 100 / len(df)
    return summary


def preprocess_data(df, threshold=40):
    """Preprocesses the data by handling missing values, encoding categorical data, and standardizing numerical data."""
    summary = df_summary(df)
    
    # Drop columns with high missing values or unique values if they are categorical
    dropped_columns = summary[
        (summary['Missing (%)'] >= threshold) | 
        ((summary['Uniques (%)'] == 100) & (summary['dtypes'] == 'object'))]['Column'].tolist()
    df = df.drop(columns=dropped_columns)
    
    # Identify numerical and categorical columns
    int_columns = df.select_dtypes(include=np.number).columns
    obj_columns = df.select_dtypes(exclude=np.number).columns
    
    # Handle missing values
    df[int_columns] = df[int_columns].apply(lambda x: x.fillna(x.mean()))
    df[obj_columns] = df[obj_columns].apply(lambda x: x.fillna(x.mode()[0]))
    
    # Remove extra spaces from categorical values
    for col in obj_columns:
        df[col] = df[col].astype(str).str.replace(' ', '')
    
    # Encode categorical variables
    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
    df[obj_columns] = encoder.fit_transform(df[obj_columns])
    
    # Standardize numerical columns
    scaler = StandardScaler()
    df[int_columns] = scaler.fit_transform(df[int_columns])
    
    return df, encoder, scaler, dropped_columns


def split_data_supervised(df, target_column, split_ratio=70):
    """Splits the data into training and testing sets."""
    if target_column not in df.columns:
        raise ValueError(f"Target column '{target_column}' not found in dataset.")
    
    y = df[target_column]
    X = df.drop(columns=[target_column])
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=(100 - split_ratio) / 100, random_state=7
    )
    
    return X_train, X_test, y_train, y_test




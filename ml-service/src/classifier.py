import numpy as np
import pandas as pd
import matplotlib.pyplot as plot
from sklearn.utils import resample
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from rapidfuzz import fuzz
import re
import json
from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = (BASE_DIR.parent / "data" / "base_data.json").resolve()
MODEL_PATH = (BASE_DIR.parent / "model" / "classifier_model.pkl").resolve()
VECTORIZER_PATH = (BASE_DIR.parent / "model" / "vectorizer.pkl").resolve()
LABEL_DATA_PATH = (BASE_DIR.parent / "data" / "label_keywords.json").resolve()

# Pre-Processing / Cleaning the data

def pre_process(data_frame):
    data_frame["text"] = data_frame["subject"].fillna("") + " " + data_frame["summary"]
    df = data_frame.drop(columns=["name", "senderEmail", "subject", "date", "summary"])
    df.reset_index(drop=True, inplace=True)
    return df

# Using 10 predefined labels to weakly classify email data

# Predefined Classes : 
# 1. Food Orders
# 2. Google Forms
# 3. Login Attempts
# 4. Invoice Receipts
# 5. News Letters
# 6. Travel Bookings
# 7. LinkedIn
# 8. Promotions
# 9. Social 
# 10. Others

# Initially classifing with weak labels with basic if else statements

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

with open(LABEL_DATA_PATH, "r", encoding="utf-8") as f:
    LABEL_KEYWORDS = json.load(f)

def weak_classify(email_text):
    text = email_text.lower()
    text_clean = clean_text(text)
    for label, keywords in LABEL_KEYWORDS.items():
        for keyword in keywords:
            keyword_clean = clean_text(keyword)
            score = fuzz.partial_ratio(keyword_clean, text_clean)
            if score > 85:
                return label
    return "Others"


def drop_less_frequent_labels(df):
    # Removing Weak Labels with very small count beacause they don't really help with classification
    counts = df["label"].value_counts()
    small_classes = []
    for label, count in counts.items():
        if count < 40:
            small_classes.append(label)

    df["label"] = df["label"].apply(lambda x: "Others" if x in small_classes else x)
    return df

def downsample(df):
    # Downsample "Others" class as it count is much greater than any other class
    majority_class = df['label'].value_counts().idxmax()
    df_majority = df[df.label == majority_class]
    df_minority = df[df.label != majority_class]

    n_samples = 200
    if len(df_majority) < n_samples:
        n_samples = len(df_majority)

    df_majority_downsampled = resample(
        df_majority,
        replace=False,
        n_samples=n_samples, 
        random_state=10
    )

    df_balanced = pd.concat([df_minority, df_majority_downsampled])
    return df_balanced


# Training a logistic regression model to predict labels for future emails instead of relying on weak labels
def train_model(X_train_vec, y_train):
    clf = LogisticRegression(max_iter=1000, class_weight="balanced", random_state=10)
    clf.fit(X_train_vec, y_train)
    return clf

def evaluate_model(model, X_test_vec, y_test):
    y_pred = model.predict(X_test_vec)
    report = classification_report(y_test, y_pred)
    return report

def main():
    """Email data from user"""
    # Raw Data
    raw_df = pd.read_json(DATA_PATH)

    # Pre Processing Data
    df = pre_process(raw_df)

    # Applying weak labels to data (based on simple if else conditions)
    df["label"] = df["text"].apply(weak_classify)

    # Downsampling classes that may have very size in comparison to other.
    # Also removing classes with really little count, as they don't really help improve the model
    # Check using print(df["label"].value_counts())
    df = drop_less_frequent_labels(df)
    df = downsample(df)

    # Splitting the data into train and test
    X = df["text"]
    y = df["label"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 10)

    # Text Emedding (Freqeuncy Based Vectors) : TF-IDF
    # Since logistic regression can't directly understand words we need to use something called word embedding that converts words in vectors, more specifically using TF-IDF (Term Frequency Inverse Document Frequency) word embedding which is a frequency based word embedding. TF-IDF calculates how rare a frequent word in a document is in a corpus of documents, can be used to fugure out the keywords in a document.
    vectorizer = TfidfVectorizer(stop_words="english", max_features=4000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Training the model
    clf = train_model(X_train_vec, y_train)

    # Evaluating Model
    report = evaluate_model(clf, X_test_vec, y_test)
    print(report)
    # print(report) to see results

    # Saving the model and vectorizer
    joblib.dump(vectorizer, VECTORIZER_PATH)
    joblib.dump(clf, MODEL_PATH)
    print("Model and Vectroizer saved to '../models")


if __name__ == "__main__":
    main()
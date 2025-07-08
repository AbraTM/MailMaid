from flask import Flask, request, jsonify
import os
import pandas as pd
import joblib
from pathlib import Path

app = Flask(__name__)

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = (BASE_DIR.parent / "model" / "classifier_model.pkl").resolve()
VECTORIZER_PATH = (BASE_DIR.parent / "model" / "vectorizer.pkl").resolve()

# Loading Models and Vectorizer
clf = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

@app.route("/")
def home():
    return "ML Service"

@app.route("/classify-emails", methods=["POST"])
def classify_emails():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({"error": "Expcested a list of emails."})
    
    df = pd.DataFrame(data)
    if "subject" not in df.columns or "summary" not in df.columns:
        return jsonify({"error": "Missing 'subject' or 'summary' field."})
    
    df["text"] = df["subject"].fillna("") + " " + df["summary"].fillna("")
    df.reset_index(drop=True, inplace=True)

    # Text Embedding
    X_vec = vectorizer.transform(df["text"])
    
    # Prediction using Model
    preds = clf.predict(X_vec)
    results = []
    for email, label in zip(data, preds):
        email_copy = email.copy()
        email_copy["predictedLabel"] = label
        results.append(email_copy)
    
    return jsonify(results)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)
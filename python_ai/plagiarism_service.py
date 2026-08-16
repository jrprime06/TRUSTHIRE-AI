import os
import joblib

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

model = joblib.load(os.path.join(MODEL_DIR, "plagiarism_model.pkl"))
vectorizer = joblib.load(os.path.join(MODEL_DIR, "plagiarism_vectorizer.pkl"))
encoder = joblib.load(os.path.join(MODEL_DIR, "plagiarism_encoder.pkl"))


def calculate_plagiarism_score(resume_text):

    text = [resume_text]

    vector = vectorizer.transform(text)

    prediction = model.predict(vector)[0]

    probabilities = model.predict_proba(vector)[0]

    label = encoder.inverse_transform([prediction])[0]

    confidence = float(max(probabilities) * 100)

    if label == "AI":
        plagiarism_score = confidence
    else:
        plagiarism_score = 100 - confidence

    plagiarism_score = max(0, min(100, plagiarism_score))

    return {
        "plagiarism_score": round(plagiarism_score, 2),
        "prediction": label,
        "confidence": round(confidence, 2)
    }
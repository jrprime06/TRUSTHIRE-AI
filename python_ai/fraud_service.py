import os
import joblib
import shap
import pandas as pd
import numpy as np

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "models",
    "fraud_model.pkl"
)

# =========================================================
# Load Model
# =========================================================

model = joblib.load(MODEL_PATH)

FEATURE_NAMES = [
    "resume_length",
    "word_count",
    "ats_score",
    "skill_match",
    "plagiarism_score",
    "trust_score",
    "keyword_density",
    "experience_years"
]


# =========================================================
# Human Readable Explanation
# =========================================================

def get_feature_explanation(feature, shap_value):

    fraud_increased = shap_value > 0

    explanations = {

        "ats_score": (
            "ATS Score increased fraud risk."
            if fraud_increased else
            "ATS Score reduced fraud risk."
        ),

        "skill_match": (
            "Weak Skill Match increased fraud risk."
            if fraud_increased else
            "Strong Skill Match reduced fraud risk."
        ),

        "trust_score": (
            "Low Trust Score increased fraud risk."
            if fraud_increased else
            "High Trust Score reduced fraud risk."
        ),

        "plagiarism_score": (
            "High Plagiarism Score increased fraud risk."
            if fraud_increased else
            "Low Plagiarism Score reduced fraud risk."
        ),

        "keyword_density": (
            "Keyword Density increased fraud risk."
            if fraud_increased else
            "Keyword Density reduced fraud risk."
        ),

        "resume_length": (
            "Resume Length increased fraud risk."
            if fraud_increased else
            "Resume Length reduced fraud risk."
        ),

        "word_count": (
            "Resume Word Count increased fraud risk."
            if fraud_increased else
            "Resume Word Count reduced fraud risk."
        ),

        "experience_years": (
            "Experience Years increased fraud risk."
            if fraud_increased else
            "Experience Years reduced fraud risk."
        )
    }

    return explanations.get(
        feature,
        "No explanation available."
    )


# =========================================================
# Get SHAP Values From Individual Random Forests
# =========================================================

def get_shap_explanation(features):

    explanation = {}

    try:

        # Each VotingClassifier estimator corresponds
        # to exactly one feature.

        for index, feature in enumerate(FEATURE_NAMES):

            pipeline = model.estimators_[index]

            rf = pipeline.named_steps["random_forest"]

            # Extract the individual feature
            single_feature = features[[feature]]

            explainer = shap.TreeExplainer(rf)

            shap_values = explainer.shap_values(
                single_feature
            )

            # Binary classifier
            if isinstance(shap_values, list):

                value = shap_values[1][0][0]

            elif isinstance(shap_values, np.ndarray):

                if shap_values.ndim == 3:

                    value = shap_values[0, 0, 1]

                elif shap_values.ndim == 2:

                    value = shap_values[0, 0]

                else:

                    value = 0.0

            else:

                value = 0.0

            value = float(value)

            explanation[feature] = {

                "shap_value": round(value, 4),

                "impact": (
                    "Increased Fraud Risk"
                    if value > 0
                    else
                    "Reduced Fraud Risk"
                ),

                "message":
                    get_feature_explanation(
                        feature,
                        value
                    )
            }

    except Exception as e:

        print("SHAP Error:", e)

        for feature in FEATURE_NAMES:

            explanation[feature] = {

                "shap_value": 0.0,

                "impact": "Unknown",

                "message":
                    "Explanation unavailable."
            }

    return explanation


# =========================================================
# Fraud Prediction
# =========================================================

def predict_fraud(
    resume_length,
    word_count,
    ats_score,
    skill_match,
    plagiarism_score,
    trust_score,
    keyword_density,
    experience_years
):

    # =====================================================
    # Input Features
    # =====================================================

    features = pd.DataFrame([{

        "resume_length": resume_length,

        "word_count": word_count,

        "ats_score": ats_score,

        "skill_match": skill_match,

        "plagiarism_score": plagiarism_score,

        "trust_score": trust_score,

        "keyword_density": keyword_density,

        "experience_years": experience_years

    }])

    # =====================================================
    # Fraud Probability
    # =====================================================

    probability = float(
        model.predict_proba(features)[0][1] * 100
    )

    # =====================================================
    # SHAP
    # =====================================================

    explanation = get_shap_explanation(features)

    # =====================================================
    # Final Result
    # =====================================================

    return round(probability, 2), explanation
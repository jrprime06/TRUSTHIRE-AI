import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("fraud_training_data.csv")

X = data.drop("fraud", axis=1)
y = data["fraud"]

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, "fraud_model.pkl")

print("Model trained successfully.")
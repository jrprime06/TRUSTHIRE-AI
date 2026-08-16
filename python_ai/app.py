from flask import Flask, request, jsonify
import os

from resume_parser import extract_resume_text
from gemini_service import generate_questions
from evaluation_service import evaluate_resume

app = Flask(__name__)


@app.route("/")
def home():
    return "TrustHire AI Python API is Running 🚀"


# ==========================================================
# GENERATE TECHNICAL INTERVIEW QUESTIONS
# ==========================================================
@app.route("/generate_questions", methods=["POST"])
def generate():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No JSON received"
            }), 400

        if "resume_path" not in data:
            return jsonify({
                "success": False,
                "message": "resume_path is required"
            }), 400

        resume_path = data["resume_path"]

        print("\n================================")
        print("GENERATE QUESTIONS")
        print("RESUME PATH:", resume_path)
        print("FILE EXISTS:", os.path.exists(resume_path))
        print("================================")

        if not os.path.exists(resume_path):
            return jsonify({
                "success": False,
                "message": "Resume file does not exist.",
                "path": resume_path
            }), 400

        resume_text = extract_resume_text(resume_path)

        if not resume_text.strip():
            return jsonify({
                "success": False,
                "message": "Resume text could not be extracted."
            }), 400

        questions = generate_questions(resume_text)

        return jsonify({
            "success": True,
            "questions": questions
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ==========================================================
# AI RESUME EVALUATION
# ==========================================================
@app.route("/evaluate_candidate", methods=["POST"])
def evaluate_candidate():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No JSON received"
            }), 400

        if "resume_path" not in data:
            return jsonify({
                "success": False,
                "message": "resume_path is required"
            }), 400

        resume_path = data["resume_path"]

        job_description = data.get(
            "job_description",
            ""
        )

        previous_resumes = data.get(
            "previous_resumes",
            []
        )

        print("\n================================")
        print("AI RESUME EVALUATION")
        print("Resume:", resume_path)
        print("Job Description Length:", len(job_description))
        print("Previous Resumes:", len(previous_resumes))
        print("================================")

        if not os.path.exists(resume_path):
            return jsonify({
                "success": False,
                "message": "Resume file not found."
            }), 400

        resume_text = extract_resume_text(resume_path)

        if not resume_text.strip():
            return jsonify({
                "success": False,
                "message": "Unable to extract resume text."
            }), 400

        # ==============================
        # AI Evaluation
        # ==============================

        evaluation = evaluate_resume(
            resume_text,
            job_description,
            previous_resumes
        )

        print("\n===== AI RESULT =====")
        print(evaluation)
        print("=====================\n")

        return jsonify({

            "success": True,

            "ats_score": float(evaluation["ats_score"]),

            "skill_score": float(evaluation["skill_score"]),

            "matched_skills": evaluation["matched_skills"],

            "missing_skills": evaluation["missing_skills"],

            "resume_skills": evaluation["resume_skills"],

            "trust_score": float(evaluation["trust_score"]),

            "fraud_score": float(evaluation["fraud_score"]),

            "plagiarism_score": evaluation["plagiarism_score"],

            "plagiarism_prediction": evaluation["plagiarism_prediction"],

            "plagiarism_confidence": evaluation["plagiarism_confidence"],

            "resume_category": evaluation["resume_category"],

            "recommendation": evaluation["recommendation"],

            "ai_report": evaluation["ai_report"]

        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=8000,
        debug=True
    )
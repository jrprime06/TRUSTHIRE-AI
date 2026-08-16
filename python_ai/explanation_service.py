import json
import numpy as np


# =====================================
# Convert NumPy Types to Python Types
# =====================================
def convert_numpy(obj):

    if isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}

    elif isinstance(obj, list):
        return [convert_numpy(i) for i in obj]

    elif isinstance(obj, tuple):
        return tuple(convert_numpy(i) for i in obj)

    elif isinstance(obj, np.generic):
        return obj.item()

    return obj


# =====================================
# Generate Explainable AI Report
# =====================================
def generate_explanation(
    ats_score,
    skill_score,
    trust_score,
    plagiarism_score,
    fraud_score,
    matched_skills,
    missing_skills,
    experience_years
):

    # ==========================
    # Overall Assessment
    # ==========================

    if fraud_score <= 30:
        overall = (
            "The candidate appears genuine with a low fraud probability. "
            "The resume demonstrates strong credibility and is suitable for further recruitment."
        )
    elif fraud_score <= 70:
        overall = (
            "The candidate has a moderate fraud probability. "
            "Some resume characteristics require manual HR verification."
        )
    else:
        overall = (
            "The candidate has a high fraud probability. "
            "Manual verification is strongly recommended before proceeding."
        )

    # ==========================
    # ATS
    # ==========================

    if ats_score >= 85:
        ats_status = "Excellent"
        ats_reason = "The resume has excellent semantic similarity, keyword matching and skill matching with the Job Description."
        ats_rec = "No improvement required."

    elif ats_score >= 70:
        ats_status = "Good"
        ats_reason = "The resume matches most job requirements with minor missing keywords."
        ats_rec = "Include a few more job-specific keywords."

    else:
        ats_status = "Needs Improvement"
        ats_reason = "The resume has low semantic similarity and insufficient keyword matching."
        ats_rec = "Tailor the resume according to the Job Description."

    # ==========================
    # Trust
    # ==========================

    if trust_score >= 80:
        trust_status = "High"
        trust_reason = "Resume appears authentic, complete and internally consistent."
        trust_rec = "No action required."

    elif trust_score >= 60:
        trust_status = "Medium"
        trust_reason = "Minor inconsistencies detected."
        trust_rec = "Improve resume consistency."

    else:
        trust_status = "Low"
        trust_reason = "Multiple inconsistencies detected."
        trust_rec = "Resume should be manually verified."

    # ==========================
    # Plagiarism
    # ==========================

    if plagiarism_score <= 20:
        plagiarism_status = "Original"
        plagiarism_reason = "Resume appears to contain mostly original content."
        plagiarism_rec = "No action required."

    elif plagiarism_score <= 50:
        plagiarism_status = "Moderate"
        plagiarism_reason = "Some content may resemble AI-generated text."
        plagiarism_rec = "Review highlighted sections."

    else:
        plagiarism_status = "High"
        plagiarism_reason = "Large portions appear AI-generated or duplicated."
        plagiarism_rec = "Rewrite using original content."

    # ==========================
    # Fraud Factors
    # ==========================

    positives = []

    if skill_score >= 80:
        positives.append("Excellent technical skill match.")

    if trust_score >= 80:
        positives.append("Resume is highly trustworthy.")

    if plagiarism_score <= 20:
        positives.append("Resume originality is high.")

    if ats_score >= 70:
        positives.append("Resume aligns well with the Job Description.")

    negatives = []

    if ats_score < 70:
        negatives.append("ATS score is below the desired level.")

    if plagiarism_score > 50:
        negatives.append("High plagiarism score increased fraud risk.")

    if trust_score < 70:
        negatives.append("Trust score is lower than expected.")

    if experience_years < 2:
        negatives.append("Candidate has limited experience.")

    if fraud_score < 30:
        fraud_rec = "Candidate can be safely considered for interview."
    elif fraud_score < 70:
        fraud_rec = "Manual HR verification is recommended."
    else:
        fraud_rec = "Candidate should be carefully verified before proceeding."

    # ==========================
    # Final Text Report
    # ==========================

    report = f"""
===========================
 TRUSTHIRE AI REPORT
===========================

OVERALL ASSESSMENT
------------------
{overall}

ATS ANALYSIS
------------
Score: {ats_score:.2f}/100
Status: {ats_status}

Reason:
{ats_reason}

Recommendation:
{ats_rec}

--------------------------------------------------

SKILL ANALYSIS
--------------
Skill Score: {skill_score:.2f}/100

Matched Skills:
{", ".join(matched_skills) if matched_skills else "None"}

Missing Skills:
{", ".join(missing_skills) if missing_skills else "None"}

--------------------------------------------------

TRUST ANALYSIS
--------------
Trust Score: {trust_score:.2f}/100
Status: {trust_status}

Reason:
{trust_reason}

Recommendation:
{trust_rec}

--------------------------------------------------

PLAGIARISM ANALYSIS
-------------------
Score: {plagiarism_score:.2f}/100
Status: {plagiarism_status}

Reason:
{plagiarism_reason}

Recommendation:
{plagiarism_rec}

--------------------------------------------------

FRAUD ANALYSIS
--------------
Fraud Score: {fraud_score:.2f}/100

Positive Factors:
"""

    for item in positives:
        report += f"\n✓ {item}"

    report += "\n\nNegative Factors:"

    if negatives:
        for item in negatives:
            report += f"\n• {item}"
    else:
        report += "\nNone"

    report += f"""

Recommendation:
{fraud_rec}

===========================
END OF REPORT
===========================
"""

    return report
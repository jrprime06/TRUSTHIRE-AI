
import re

from ats_service import calculate_ats_score
from skill_service import calculate_skill_match
from plagiarism_service import calculate_plagiarism_score
from fraud_service import predict_fraud
from resume_classifier_service import classify_resume
from explanation_service import generate_explanation


# ============================================================
# TRUST SCORE
# ============================================================

def calculate_trust_score(
    resume_text,
    skill_score=0,
    plagiarism_score=0,
    experience_years=0
):
    """
    Calculate a credibility/trust score from 0-100.

    Trust Score is separate from the Fraud ML model.
    """

    text = resume_text or ""
    lower_text = text.lower()

    score = 0

    # ========================================================
    # 1. RESUME COMPLETENESS - 15 POINTS
    # ========================================================

    completeness = 0

    # Resume / CV heading
    if re.search(
        r"\b(resume|curriculum vitae|cv)\b",
        lower_text
    ):
        completeness += 3

    # Education
    if re.search(
        r"\b("
        r"education|degree|bachelor|master|"
        r"b\.?tech|m\.?tech|bca|mca|mba|phd|"
        r"university|college"
        r")\b",
        lower_text
    ):
        completeness += 4

    # Experience
    if re.search(
        r"\b("
        r"experience|employment|work history|"
        r"professional experience"
        r")\b",
        lower_text
    ):
        completeness += 4

    # Skills
    if re.search(
        r"\b("
        r"skills|technical skills|technologies|"
        r"competencies"
        r")\b",
        lower_text
    ):
        completeness += 4

    score += min(completeness, 15)

    # ========================================================
    # 2. CONTACT INFORMATION - 10 POINTS
    # ========================================================

    contact_score = 0

    # Email
    email_found = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    if email_found:
        contact_score += 5

    # Phone
    phone_found = re.search(
        r"(?:\+?\d[\d\s().-]{8,}\d)",
        text
    )

    if phone_found:
        contact_score += 5

    score += contact_score

    # ========================================================
    # 3. EXPERIENCE CONSISTENCY - 15 POINTS
    # ========================================================

    experience_score = 0

    experience_matches = re.findall(
        r"\b(\d+)\+?\s+years?\b",
        lower_text
    )

    if experience_matches:

        years = []

        for value in experience_matches:
            try:
                years.append(int(value))
            except ValueError:
                pass

        if years:

            max_years = max(years)

            # Reasonable experience
            if max_years <= 40:
                experience_score += 8

            # Experience-related language
            if re.search(
                r"\b("
                r"worked|working|experience|developer|"
                r"engineer|manager|intern|analyst|consultant"
                r")\b",
                lower_text
            ):
                experience_score += 4

            # Dates exist
            if re.search(
                r"\b(?:19|20)\d{2}\b",
                text
            ):
                experience_score += 3

    else:

        # No experience is not automatically suspicious.
        if re.search(
            r"\b(student|fresher|graduate|intern)\b",
            lower_text
        ):
            experience_score += 8

    score += min(experience_score, 15)

    # ========================================================
    # 4. EDUCATION CONSISTENCY - 10 POINTS
    # ========================================================

    education_score = 0

    education_keywords = [
        "education",
        "university",
        "college",
        "bachelor",
        "master",
        "b.tech",
        "m.tech",
        "bca",
        "mca",
        "mba",
        "phd"
    ]

    education_found = any(
        keyword in lower_text
        for keyword in education_keywords
    )

    if education_found:
        education_score += 5

    # Institution / year information
    if re.search(
        r"\b(?:19|20)\d{2}\b",
        text
    ):
        education_score += 3

    # Degree
    if re.search(
        r"\b("
        r"b\.?tech|m\.?tech|bca|mca|bba|mba|"
        r"bachelor|master|ph\.?d"
        r")\b",
        lower_text
    ):
        education_score += 2

    score += min(education_score, 10)

    # ========================================================
    # 5. SKILL EVIDENCE - 15 POINTS
    # ========================================================

    try:
        skill_score_value = float(skill_score or 0)
    except (TypeError, ValueError):
        skill_score_value = 0

    skill_score_value = max(
        0,
        min(skill_score_value, 100)
    )

    skill_contribution = (
        skill_score_value * 15 / 100
    )

    score += skill_contribution

    # ========================================================
    # 6. CAREER TIMELINE CONSISTENCY - 10 POINTS
    # ========================================================

    timeline_score = 0

    full_years = re.findall(
        r"\b(?:19|20)\d{2}\b",
        text
    )

    numeric_years = []

    for year in full_years:
        try:
            numeric_years.append(int(year))
        except ValueError:
            pass

    if numeric_years:

        current_year = 2026

        valid_years = [
            year
            for year in numeric_years
            if 1950 <= year <= current_year
        ]

        if valid_years:

            timeline_score += 5

            if len(valid_years) >= 2:

                if max(valid_years) - min(valid_years) <= 50:
                    timeline_score += 5

    else:

        # Do not heavily penalize resumes
        # that do not explicitly contain dates.
        timeline_score += 3

    score += min(timeline_score, 10)

    # ========================================================
    # 7. RESUME QUALITY / STRUCTURE - 10 POINTS
    # ========================================================

    quality_score = 0

    word_count = len(
        text.split()
    )

    character_count = len(text)

    # Reasonable resume length
    if 200 <= character_count <= 15000:
        quality_score += 4

    # Reasonable word count
    if 80 <= word_count <= 3000:
        quality_score += 3

    # Resume sections
    sections = [
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "summary",
        "profile"
    ]

    section_count = sum(
        1
        for section in sections
        if section in lower_text
    )

    if section_count >= 3:
        quality_score += 3

    score += min(quality_score, 10)

    # ========================================================
    # 8. SUSPICIOUS / PLACEHOLDER CONTENT - 5 POINTS
    # ========================================================

    suspicious_score = 5

    suspicious_patterns = [
        "lorem ipsum",
        "test resume",
        "dummy resume",
        "sample resume",
        "asdf",
        "qwerty",
        "xxxxx",
        "your name",
        "john doe",
        "example@example.com"
    ]

    suspicious_found = False

    for pattern in suspicious_patterns:

        if pattern in lower_text:
            suspicious_found = True
            break

    if suspicious_found:
        suspicious_score = 0

    score += suspicious_score

    # ========================================================
    # 9. PLAGIARISM SIGNAL - 10 POINTS
    # ========================================================

    try:
        plagiarism = float(
            plagiarism_score or 0
        )
    except (TypeError, ValueError):
        plagiarism = 0

    plagiarism = max(
        0,
        min(plagiarism, 100)
    )

    # Lower plagiarism = higher trust
    plagiarism_contribution = (
        (100 - plagiarism) * 10 / 100
    )

    score += plagiarism_contribution

    # ========================================================
    # FINAL TRUST SCORE
    # ========================================================

    score = max(
        0,
        min(score, 100)
    )

    return round(score, 2)


# ============================================================
# FINAL RECOMMENDATION
# ============================================================

def get_recommendation(
    ats,
    trust,
    fraud,
    plagiarism
):
    # High fraud risk always rejects the candidate
    if fraud >= 75:
        return "Rejected"

    # Moderate fraud risk requires manual review
    elif fraud >= 50:
        return "Consider"

    # Strong candidate with low fraud/plagiarism risk
    elif (
        ats >= 60
        and trust >= 80
        and plagiarism < 30
    ):
        return "Recommended"

    # Average candidate
    elif ats >= 40:
        return "Consider"

    # Low ATS score
    return "Rejected"


# ============================================================
# AI RESUME EVALUATION
# ============================================================

def evaluate_resume(
    resume_text,
    job_description,
    previous_resumes
):

    # ========================================================
    # 1. ATS SCORE
    # ========================================================

    ats = calculate_ats_score(
        resume_text,
        job_description
    )

    # ========================================================
    # 2. SKILL MATCHING
    # ========================================================

    skill_score, matched, missing, extracted = (
        calculate_skill_match(
            resume_text,
            job_description
        )
    )
 
    # ========================================================
    # 3. PLAGIARISM SCORE
    #
    # IMPORTANT:
    # This MUST happen before Trust Score because
    # Trust Score uses plagiarism.
    # ========================================================

    plagiarism_result = calculate_plagiarism_score(
        resume_text
    )

    plagiarism = plagiarism_result.get(
        "plagiarism_score",
        0
    )

    # Make sure plagiarism is numeric
    try:
        plagiarism = float(plagiarism)
    except (TypeError, ValueError):
        plagiarism = 0

    # ========================================================
    # 4. EXPERIENCE YEARS
    # ========================================================

    experience_matches = re.findall(
        r"\b(\d+)\+?\s+years?\b",
        resume_text.lower()
    )

    experience_years = 0

    if experience_matches:

        experience_values = []

        for value in experience_matches:

            try:
                experience_values.append(
                    int(value)
                )
            except ValueError:
                pass

        if experience_values:
            experience_years = max(
                experience_values
            )

    # ========================================================
    # 5. TRUST SCORE
    #
    # Now all required values exist:
    # - resume_text
    # - skill_score
    # - plagiarism
    # - experience_years
    # ========================================================

    trust = calculate_trust_score(
        resume_text=resume_text,
        skill_score=skill_score,
        plagiarism_score=plagiarism,
        experience_years=experience_years
    )

    # ========================================================
    # 6. FRAUD MODEL FEATURES
    # ========================================================

    resume_length = len(
        resume_text
    )

    word_count = len(
        resume_text.split()
    )

    keyword_density = ats / 100

    # ========================================================
    # 7. FRAUD PREDICTION + SHAP
    # ========================================================

    fraud_score, shap = predict_fraud(
        resume_length,
        word_count,
        ats,
        skill_score,
        plagiarism,
        trust,
        keyword_density,
        experience_years
    )

    # ========================================================
    # 8. RESUME CLASSIFICATION
    # ========================================================

    resume_category = classify_resume(
        resume_text
    )

    # ========================================================
    # 9. FINAL RECOMMENDATION
    # ========================================================

    recommendation = get_recommendation(
        ats,
        trust,
        fraud_score,
        plagiarism
    )

    # ========================================================
    # 10. AI EXPLAINABLE REPORT
    # ========================================================

    ai_report = generate_explanation(
        ats_score=ats,
        skill_score=skill_score,
        trust_score=trust,
        plagiarism_score=plagiarism,
        fraud_score=fraud_score,
        matched_skills=matched,
        missing_skills=missing,
        experience_years=experience_years
    )

    # ========================================================
    # 11. RETURN RESULT
    # ========================================================

    return {

        "ats_score": float(ats),

        "skill_score": float(
            skill_score
        ),

        "matched_skills": matched,

        "missing_skills": missing,

        "resume_skills": extracted,

        "trust_score": float(
            trust
        ),

        "fraud_score": float(
            fraud_score
        ),

        "plagiarism_score": float(
            plagiarism
        ),

        "plagiarism_prediction":
            plagiarism_result.get(
                "prediction",
                None
            ),

        "plagiarism_confidence":
            plagiarism_result.get(
                "confidence",
                0
            ),

        "resume_category":
            resume_category,

        "recommendation":
            recommendation,

        "ai_report":
            ai_report,

        # SHAP explanation
        "shap":
            shap
    }


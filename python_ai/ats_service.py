import re

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from skill_service import extract_skills

model = SentenceTransformer("all-MiniLM-L6-v2")


def preprocess(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9 ]", " ", text)
    return text


def keyword_overlap(resume, jd):

    resume_words = set(preprocess(resume).split())
    jd_words = set(preprocess(jd).split())

    if len(jd_words) == 0:
        return 0

    common = resume_words.intersection(jd_words)

    return (len(common) / len(jd_words)) * 100


def skill_overlap(resume, jd):

    resume_skills = set(extract_skills(resume))
    jd_skills = set(extract_skills(jd))

    if len(jd_skills) == 0:
        return 0

    matched = resume_skills.intersection(jd_skills)

    return (len(matched) / len(jd_skills)) * 100


def semantic_similarity(resume, jd):

    resume_embedding = model.encode(
        resume,
        convert_to_numpy=True
    )

    jd_embedding = model.encode(
        jd,
        convert_to_numpy=True
    )

    similarity = cosine_similarity(
        [resume_embedding],
        [jd_embedding]
    )[0][0]

    return similarity * 100


def calculate_ats_score(resume_text, job_description):

    if not resume_text.strip() or not job_description.strip():
        return 0

    semantic = semantic_similarity(
        resume_text,
        job_description
    )

    keyword = keyword_overlap(
        resume_text,
        job_description
    )

    skill = skill_overlap(
        resume_text,
        job_description
    )

    ats = (
        semantic * 0.40 +
        keyword * 0.20 +
        skill * 0.40
    )

    return round(min(100, ats), 2)
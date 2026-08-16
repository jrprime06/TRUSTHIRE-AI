from sentence_transformers import SentenceTransformer, util

# Load model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_ats_score(resume_text, job_description):
    """
    Calculate semantic ATS score using SBERT.
    """

    if not resume_text.strip():
        return 0.0

    if not job_description.strip():
        return 0.0

    resume_embedding = model.encode(
        resume_text,
        convert_to_tensor=True
    )

    job_embedding = model.encode(
        job_description,
        convert_to_tensor=True
    )

    similarity = util.cos_sim(
        resume_embedding,
        job_embedding
    )

    score = float(similarity.item()) * 100

    score = round(score, 2)

    if score < 0:
        score = 0

    if score > 100:
        score = 100

    return score
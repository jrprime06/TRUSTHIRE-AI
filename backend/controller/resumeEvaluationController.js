const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const axios = require("axios");


const evaluateCandidate = async (resume_id) => {

    try {

        console.log(`Starting AI Evaluation for Resume ID: ${resume_id}`);

        // ==========================================
        // GET RESUME FROM DATABASE
        // ==========================================
const resume = await new Promise((resolve, reject) => {

    db.query(

        `SELECT
            r.resume_id,
            r.candidate_id,
            r.job_id,
            r.resume_name,
            r.resume_file,
            r.file_type,
            j.job_description
         FROM resumes r
         INNER JOIN job_posts j
             ON r.job_id = j.job_id
         WHERE r.resume_id = ?
         LIMIT 1`,

        [resume_id],

        (err, results) => {

            if (err) return reject(err);

            if (results.length === 0) {
                return reject(new Error("Resume not found."));
            }

            resolve(results[0]);

        }

    );

});

console.log("Resume fetched successfully.");

        
// ==========================================
// CREATE TEMP DIRECTORY
// ==========================================

const tempFolder = path.join(__dirname, "../temp");

if (!fs.existsSync(tempFolder)) {

    fs.mkdirSync(tempFolder, {

        recursive: true

    });

}

// ==========================================
// CREATE TEMP PDF
// ==========================================

const extension = resume.file_type === "application/pdf"
    ? "pdf"
    : "docx";

const tempFilePath = path.join(

    tempFolder,

    `resume_${resume.resume_id}.${extension}`

);

fs.writeFileSync(

    tempFilePath,

    resume.resume_file

);

console.log(`Temporary resume created: ${tempFilePath}`);

// ==========================================
// CALL PYTHON AI
// ==========================================


console.log("Sending resume to Python AI...");

const aiResponse = await axios.post(

    "http://127.0.0.1:8000/evaluate_candidate",

    {
        resume_path: tempFilePath,
        job_description: resume.job_description
    },

    {
        timeout: 300000
    }

);

const evaluation = aiResponse.data;

console.log("Python AI Response:");

console.log(aiResponse.data);


// ==========================================
// SAVE AI EVALUATION
// ==========================================
// ==========================================
// SAVE AI EVALUATION
// ==========================================

await new Promise((resolve, reject) => {

    db.query(

        `INSERT INTO resume_evaluation
(
    candidate_id,
    resume_id,
    ats_score,
    skill_score,
    matched_skills,
    missing_skills,
    resume_skills,
    trust_score,
    fraud_score,
    plagiarism_score,
    plagiarism_prediction,
    plagiarism_confidence,
    recommendation,
    shap_json
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

       [
    resume.candidate_id,
    resume.resume_id,

    evaluation.ats_score,
    evaluation.skill_score,

    JSON.stringify(evaluation.matched_skills),
    JSON.stringify(evaluation.missing_skills),
    JSON.stringify(evaluation.resume_skills),

    evaluation.trust_score,
    evaluation.fraud_score,

    evaluation.plagiarism_score,
    evaluation.plagiarism_prediction,
    evaluation.plagiarism_confidence,

    evaluation.recommendation,

    evaluation.ai_report
],

        (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        }

    );

});

console.log("AI evaluation saved successfully.");

// ==========================================
// DELETE TEMP FILE
// ==========================================

if (fs.existsSync(tempFilePath)) {

    fs.unlinkSync(tempFilePath);

    console.log("Temporary resume deleted.");

}

// ==========================================
// RETURN RESULT
// ==========================================

return {

    success: true,

    evaluation

};

        

    } catch (error) {

    console.error("AI Evaluation Error:", error);

    // Delete temporary file if it exists
    try {

        if (
            typeof tempFilePath !== "undefined" &&
            fs.existsSync(tempFilePath)
        ) {

            fs.unlinkSync(tempFilePath);

        }

    } catch (cleanupError) {

        console.error(
            "Cleanup Error:",
            cleanupError.message
        );

    }

    throw error;

}

};

module.exports = {
    evaluateCandidate
};